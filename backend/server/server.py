from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import web3
from sys import path
import time
import os
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
import joblib
import subprocess


app = Flask("backend")
cors = CORS(app=app, resources={r"/upload": {"origins": "http://localhost:3000"}})

STORE_DIR = "./root/"
TEMPORARY_STORE_DIR = "./root-file-checking"

flag = [False, False]
turn = 0
SAVE = 0
BACKUP = 1

contract_names = ["DataBackup", "RansomWare"]
DATABACKUP = 0
RANSOMWARE = 1

w3 = web3.Web3(web3.HTTPProvider('http://127.0.0.1:8545'))
account = w3.eth.accounts[0]
contracts = []
for name in contract_names:
	contract_addr = open(f'../{name}.addr').read()
	contract = w3.eth.contract(address=contract_addr, abi=json.loads(open(f'../build/abi/{name}.json').read()))
	contracts.append(contract)

try:
	tx_hash = contracts[DATABACKUP].functions.register().transact({"from": account})
	tx = w3.eth.wait_for_transaction_receipt(tx_hash)
except:
	pass

SYSTEM_ID = contracts[DATABACKUP].functions.getSystemId().call({"from": account})
print(f"[LOG] system_id={SYSTEM_ID}")
LAST_SNAPSHOT = -1

# Loading the model
# model = joblib.load("model.joblib")

@app.route("/upload", methods=['POST'])
def upload_handler():
	try:
		file = request.files['file']
		filename = request.form['name']
		file.save(f'{TEMPORARY_STORE_DIR}/{filename}')
		print("point-1")
		infected = detect_ransomware(filename)
		success = True
		reason = ""
		if not infected:
			flag[SAVE] = True
			if flag[BACKUP] == True and turn == BACKUP:
				success = False
				reason = "Backup in progress"
			else:
				file.save(f'{STORE_DIR}/{filename}')
				reason = "Saved successfully"
			flag[SAVE] = False
		else:
			success = False
			reason = "File is a ransomware"
	except:
		success = False
		reason = "Server Error"

	data = {
		"success": success,
		"reason": reason
	}

	return json.dumps(data)

def getData(system_id: int = -1, snapshot_id: int = -1) -> list:
	filters = {}
	if system_id != -1:
		filters["system_id"] = system_id
	if snapshot_id != -1:
		filters["snapshot_id"] = snapshot_id
	logs = contracts[DATABACKUP].events.DataUpload().get_logs(argument_filters=filters, fromBlock=0, toBlock='latest')
	processed_logs = []
	for log in logs:
		processed_logs.append(log['args'])
	return processed_logs

# equals 1 if infected else 0
def predict(file):
    # Example: Dummy prediction
    return "True" if file is not None else "False"
	
def detect_ransomware(filename):
	try:
		# Run the script as a subprocess with the file path as an argument
		temp_file_path = filename
		root_dir = './root-file-checking/'
		file_path = os.path.join(root_dir,temp_file_path)

		command = ['python', './model_ransomware/mlrd.py', file_path]
		result = subprocess.check_output(command, universal_newlines=True)

		print(result)

		if result[58] == 'b':
			return False
		else:
			return True
	
	except Exception as e:
		return jsonify({'error': str(e)})


def flatten(directory: str) -> list:
	l = []
	for d,_,files in os.walk(directory):
		for f in files:
			p = os.path.join(d,f)
			l.append(p)
	return l

def generate_backup():
	flag[BACKUP] = True
	while flag[SAVE] == True and turn == SAVE:
		pass
	print("[LOG] Started Backup: ", time.asctime(time.localtime()))

	# Create new snapshot
	contracts[DATABACKUP].functions.startNewSnapshot().transact({"from": account})

	files = flatten(STORE_DIR)
	for file in files:
		contracts[DATABACKUP].functions.uploadFile((bytes(file, 'UTF-8'), open(file, "rb").read())).transact({"from": account})

	# Save the last successful snapshot ID
	global LAST_SNAPSHOT
	LAST_SNAPSHOT = contracts[DATABACKUP].functions.snapshotId().call({"from": account})

	# getData
	# logs = getData(system_id=SYSTEM_ID, snapshot_id=LAST_SNAPSHOT)

	print("[LOG] Completed Backup: ", time.asctime(time.localtime()))
	turn = SAVE

# Start Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=generate_backup, trigger='interval', seconds=30)
scheduler.start()

# Start App
app.run(port=5000, debug=False)

# Stop Scheduler
scheduler.shutdown()
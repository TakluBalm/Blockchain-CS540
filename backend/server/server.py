from flask import Flask, request
from flask_cors import CORS
import json
import web3
from sys import path
import time
import os
from apscheduler.schedulers.background import BackgroundScheduler
import zipfile
import base64

app = Flask("backend")
cors = CORS(app=app, resources={r"/upload": {"origins": "http://localhost:3000"}, r"/latestSnapshot": {"origins": "http://localhost:3000"}})

STORE_DIR = "./root/"

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
LAST_SNAPSHOT = contracts[DATABACKUP].functions.snapshotId().call({"from": account})

@app.route("/upload", methods=['POST'])
def upload_handler():
	try:
		file = request.files['file']
		filename = request.form['name']
		data = file.stream.read()
		infected = detect_ransomware(request.form['name'], data)
		success = True
		reason = ""
		if not infected:
			flag[SAVE] = True
			if flag[BACKUP] == True and turn == BACKUP:
				success = False
				reason = "Backup in progress"
			else:
				with open(os.path.join(STORE_DIR, filename), "wb") as f:
					f.write(data)
				reason = "Saved successfully"
			flag[SAVE] = False
		else:
			success = False
			reason = "File is a ransomware"
	except Exception as e :
		print(e)
		success = False
		reason = "Server Error"

	data = {
		"success": success,
		"reason": reason
	}

	return json.dumps(data)

@app.route('/latestSnapshot')
def latestSnapshot():
	logs = getData(system_id=SYSTEM_ID, snapshot_id=LAST_SNAPSHOT)
	tmpname = f'./tmp-{time.asctime(time.localtime())}-{SYSTEM_ID}-{LAST_SNAPSHOT}.zip'
	with zipfile.ZipFile(tmpname, "w", zipfile.ZIP_DEFLATED) as zip:
		for log in logs:
			# print(type(log["name"]), type(log["data"]))
			zip.writestr(str(log["name"]), log["data"])
	with open(tmpname, "rb") as f:
		data = f.read()
	os.remove(tmpname)
	return json.dumps({"data": base64.b64encode(data).decode("ascii")})

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

def detect_ransomware(name: str, data: bytes):
	# print(data)
	return False

def flatten(directory: str) -> list:
	l = []
	for d,_,files in os.walk(directory):
		for f in files:
			p = os.path.join(d,f)
			l.append(p)
	return l

def generate_backup():
	global turn
	global flag
	flag[BACKUP] = True
	while flag[SAVE] == True and turn == SAVE:
		pass
	print("[LOG] Started Backup: ", time.asctime(time.localtime()))

	# Create new snapshot
	contracts[DATABACKUP].functions.startNewSnapshot().transact({"from": account})

	files = flatten(STORE_DIR)
	for file in files:
		name = file.removeprefix('./root')
		if name == '/.gitkeep':
			continue
		name = bytes(name, 'UTF-8')
		with open(file, "rb") as f:
			data = f.read()
		contracts[DATABACKUP].functions.uploadFile((bytes(file.removeprefix('./root'), 'UTF-8'), data)).transact({"from": account})

	# Save the last successful snapshot ID
	global LAST_SNAPSHOT
	LAST_SNAPSHOT = contracts[DATABACKUP].functions.snapshotId().call({"from": account})

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
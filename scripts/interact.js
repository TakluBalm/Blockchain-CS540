const { Web3 } = require("web3");
const fs = require("fs");

async function main() {
	const loadContract = function (contract) {
		return JSON.parse(fs.readFileSync("./build/contracts/DataBackup.json"))["abi"];
	}

	const web3 = new Web3("http://127.0.0.1:8545")
	const abi, address = loadContract("DataBackup");

	const accounts = await web3.eth.getAccounts();
}

main().then(() => process.exit(0))
.catch((error) => {
	console.log(error);
	process.exit(0);
});
const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");
const solc = require("solc");

async function main() {
	const solFiles = fs.readdirSync("./contracts/").filter(e1 => path.extname(e1) === '.sol');
	var input = {
		language: "Solidity",
		sources: {},
		settings: {
			outputSelection: {
				'*': {
					'*': ['*'],
				},
			},
		},
	}

	solFiles.forEach((file) => input["sources"]["file"] = {
		content: String(fs.readFileSync(`./contracts/${file}`))
	});

	const byteCode = JSON.parse(solc.compile(JSON.stringify(input)))["contracts"]["file"];
	var contracts = []
	for(let key in byteCode) {
		fs.writeFile(`./build/abi/${key}.json`, JSON.stringify(byteCode[key]["abi"], null, '\t'), (err) => {})
		contracts.push(key)
	}

	const web3 = new Web3("http://127.0.0.1:8545");
	const accounts = await web3.eth.getAccounts();

	for(const contract of contracts) {
		const web3Contract = new web3.eth.Contract(byteCode[contract].abi)
		const preparedTx = web3Contract.deploy({
			data: '0x'+byteCode[contract].evm.bytecode.object,
			arguments: []
		})
		try {
			const tx = await preparedTx.send({
				from: accounts[0],
				gas: 30000000,
				gasPrice: 10000000000
			})
			fs.writeFile(`./scripts/${contract}.addr`, tx.options.address, (err) => {});
			console.log(`${contract}: ${tx.options.address}`)
		} catch (err) {
			console.log(err);
		}
	}
}

main();
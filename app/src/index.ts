import { ethers, JsonRpcProvider } from "ethers";
import { config } from 'dotenv';

config();  // 加载.env文件

const abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "number",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "new_number", "type": "uint256" }],
    "name": "setNumber",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "type": "function"
  }
];

const HELLO_WORLD_ADDRESS = "0x018544fcee109f5de1724b8c790f03d6bc65b278"; // 请替换为你的合约地址

const main = async () => {
  // 从环境变量中读取私钥
  const privateKey: string = process.env.PRIVATE_KEY || "";

  const provider = new JsonRpcProvider("https://stylus-testnet.arbitrum.io/rpc")

  const wallet = new ethers.Wallet(privateKey, provider)
  console.log("wallet", await wallet.getAddress());

  const contract = new ethers.Contract(HELLO_WORLD_ADDRESS, abi, provider);

  let currentNumber = await contract.number();
  console.log("Current number:", currentNumber.toString());

  const contractCanWrite = new ethers.Contract(HELLO_WORLD_ADDRESS, abi, wallet)
  // await contractCanWrite.setNumber(5);
  await contractCanWrite.increment();

  currentNumber = await contractCanWrite.number();
  console.log("New number:", currentNumber.toString());
}

main();

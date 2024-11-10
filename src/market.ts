import Web3 from 'web3';
import path from "path";
import fs from "fs";

// 初始化 Web3
const web3 = new Web3('https://mainnet.infura.io/v3/e57cbf7c6caa4c81aef80604caea87e3');

const abiPath = path.resolve(__dirname+'/abi', 'EventEmitter.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
const contractAddress = '0xC8ee91A54287DB53897056e12D9819156D3822Fb';

// 创建合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 从起始区块开始
let startBlock = 270832685;

// 查询事件的函数
async function queryEvents() {
    try {
        const latestBlock = await web3.eth.getBlockNumber();

        while (startBlock <= latestBlock) {
            const endBlock = Math.min(startBlock + 20000, latestBlock);

            console.log(`Querying blocks from ${startBlock} to ${endBlock}`);

            const events = await contract.getPastEvents('EventLog1', {
                fromBlock: startBlock,
                toBlock: endBlock
            });

            events.forEach(event => {
                console.log('Event received:', JSON.stringify(event.returnValues));
            });

            startBlock = endBlock + 1;
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

queryEvents();
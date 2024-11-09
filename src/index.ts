import Web3 from 'web3';
import fs from 'fs';
import path from 'path';

console.log(__dirname);
const web3 = new Web3('https://mainnet.infura.io/v3/e57cbf7c6caa4c81aef80604caea87e3');
const abiPath = path.resolve(__dirname+'/abi', 'EventEmitter.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
const contractAddress = '0xC8ee91A54287DB53897056e12D9819156D3822Fb';

// 创建合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 订阅事件
contract.events.EventLog1({
    filter: {}, // 可选：根据需要过滤事件
    fromBlock: 'latest'
}, (error: any, event: { returnValues: { msgSender: any; eventName: any; eventNameHash: any; topic1: any; eventData: any; }; }) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Event received:');
    console.log('msgSender:', event.returnValues.msgSender);
    console.log('eventName:', event.returnValues.eventName);
    console.log('eventNameHash:', event.returnValues.eventNameHash);
    console.log('topic1:', event.returnValues.topic1);
    console.log('eventData:', event.returnValues.eventData);
});
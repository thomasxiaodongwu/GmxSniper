import Web3 from 'web3';
import fs from 'fs';
import path from 'path';

console.log(__dirname);
const web3Http = new Web3('https://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS');
const web3 = new Web3('wss://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS');
const abiPath = path.resolve(__dirname+'/abi', 'EventEmitter.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
const contractAddress = '0xC8ee91A54287DB53897056e12D9819156D3822Fb';
let blockNumber = 0;
web3Http.eth.getBlock('latest', (error, latestBlock) => {
    if (error) {
        console.error('Error fetching latest block:', error);
    } else {
        blockNumber = latestBlock.number;
        console.log('Latest Block Number:', blockNumber);
    }
});

// 创建合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);
let init = 2000;
// 订阅事件
while (init <= blockNumber) {
    contract.events.EventLog1({
        filter: {eventName:"MarketCreated"}, // 可选：根据需要过滤事件
        fromBlock: init,
        toBlock: init + 5000
    }, (error: any, event: { returnValues: { msgSender: any; eventName: any; eventNameHash: any; topic1: any; eventData: any; }; }) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.log('Market received:');
        console.log('msgSender:', event.returnValues.msgSender);
        console.log('eventName:', event.returnValues.eventName);
        console.log('eventNameHash:', event.returnValues.eventNameHash);
        console.log('topic1:', event.returnValues.topic1);
        console.log('eventData:', JSON.stringify(event.returnValues.eventData));
    });
    init += 5000;
}
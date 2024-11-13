import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { getTokenPrices } from './MarketInfo';

console.log(__dirname);
// const web3 = new Web3('https://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS');
const web3 = new Web3('wss://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS');
const abiPath = path.resolve(__dirname+'/abi', 'EventEmitter.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
const contractAddress = '0xC8ee91A54287DB53897056e12D9819156D3822Fb';

// 创建合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 订阅事件
contract.events.EventLog1({
    filter: {}, // 可选：根据需要过滤事件
    fromBlock: 'latest'
}, async (error: any, event: { returnValues: { msgSender: any; eventName: any; eventNameHash: any; topic1: any; eventData: any; }; }) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    if (event.returnValues.eventName === 'OpenInterestUpdated') {
        console.log('eventName:', event.returnValues.eventName);
        const eventData = event.returnValues.eventData;
        await parseEventData(eventData);

    }
});

async function parseEventData(eventData: any) {
    const addressItems = eventData.addressItems;
    const boolItems = eventData.boolItems;
    const intItems = eventData.intItems;
    const uintItems = eventData.uintItems;

    const market = addressItems[0][0].market; // 或者使用 keys "market"
    const collateralToken = addressItems[0][1];
    const isLong = boolItems[0];
    const delta = intItems[0];
    const nextValue = uintItems[0];

    console.log('Market:', market);
    console.log('Collateral Token:', collateralToken);
    console.log('Is Long:', isLong);
    console.log('Delta:', delta);
    console.log('Next Value:', nextValue);

    //await getTokenPrices(market);
}
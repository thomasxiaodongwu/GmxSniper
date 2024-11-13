import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { getTokenPrices } from './MarketInfo';
import { getTokenInfo , calculate} from './tokens';


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
        const data = parseEventLogData(eventData);
        const result = await getTokenPrices(data.addressItems.items[0].value);
        if(result){
            const tokenInfo1 = getTokenInfo(result.market.indexToken);
            const tokenInfo2 = getTokenInfo(result.market.shortToken);
            console.log('Market:', tokenInfo1?.symbol + "|"+tokenInfo2?.symbol);
            console.log('borrowingFactorPerSecondForLongs:', calculate(result.borrowingFactorPerSecondForLongs.toString()).toString());
            console.log('borrowingFactorPerSecondForShorts:', calculate(result.borrowingFactorPerSecondForShorts.toString()).toString());
            console.log('Is Long:', data.boolItems.items[0].value);
            console.log('Next Value:', calculate(data.uintItems.items[0].value).toString());
        }
    }
});

function parseEventLogData(eventData: any): EventLogData {
    return {
        addressItems: eventData.addressItems,
        uintItems: eventData.uintItems,
        intItems: eventData.intItems,
        boolItems: eventData.boolItems,
        bytes32Items: eventData.bytes32Items,
        bytesItems: eventData.bytesItems,
        stringItems: eventData.stringItems,
    };
}

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

interface AddressKeyValue {
    key: string;
    value: string;
}

interface UintKeyValue {
    key: string;
    value: string;
}

interface IntKeyValue {
    key: string;
    value: string;
}

interface BoolKeyValue {
    key: string;
    value: boolean;
}

interface Bytes32KeyValue {
    key: string;
    value: string;
}

interface BytesKeyValue {
    key: string;
    value: string;
}

interface StringKeyValue {
    key: string;
    value: string;
}

interface AddressItems {
    items: AddressKeyValue[];
    arrayItems: AddressKeyValue[][];
}

interface UintItems {
    items: UintKeyValue[];
    arrayItems: UintKeyValue[][];
}

interface IntItems {
    items: IntKeyValue[];
    arrayItems: IntKeyValue[][];
}

interface BoolItems {
    items: BoolKeyValue[];
    arrayItems: BoolKeyValue[][];
}

interface Bytes32Items {
    items: Bytes32KeyValue[];
    arrayItems: Bytes32KeyValue[][];
}

interface BytesItems {
    items: BytesKeyValue[];
    arrayItems: BytesKeyValue[][];
}

interface StringItems {
    items: StringKeyValue[];
    arrayItems: StringKeyValue[][];
}

interface EventLogData {
    addressItems: AddressItems;
    uintItems: UintItems;
    intItems: IntItems;
    boolItems: BoolItems;
    bytes32Items: Bytes32Items;
    bytesItems: BytesItems;
    stringItems: StringItems;
}
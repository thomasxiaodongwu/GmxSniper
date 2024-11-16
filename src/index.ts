import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { getTokenPrices, callGetMarkets, initTokenPrices } from './MarketInfo';
import { getTokenInfo , calculate} from './tokens';
import { markets } from './Global';
import {BigNumber} from "bignumber.js";

// const web3 = new Web3('https://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS');
const web3 = new Web3('wss://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS');
const abiPath = path.resolve(__dirname+'/abi', 'EventEmitter.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
const contractAddress = '0xC8ee91A54287DB53897056e12D9819156D3822Fb';

// 创建合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);

function sumReturnUint256(a: number, b: number): number {
    const absB = Math.abs(b);
    if (b > 0) {
        return a + absB;
    }
    return a - absB;
}

async function main() {
    const iresult = await initTokenPrices();
    
    if(iresult) {
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
                if (result) {
                    const tokenInfo1 = getTokenInfo(result.market.indexToken);
                    const tokenInfo2 = getTokenInfo(result.market.shortToken);
                    console.log('Market:', tokenInfo1?.symbol + "|" + tokenInfo2?.symbol);
                    console.log('borrowingFactorPerSecondForLongs:', calculate(result.borrowingFactorPerSecondForLongs.toString()).toString());
                    console.log('borrowingFactorPerSecondForShorts:', calculate(result.borrowingFactorPerSecondForShorts.toString()).toString());
                    if(data.boolItems.items[0].value){
                        const iss = iresult.get(data.addressItems.items[0].value);
                        if(iss) {
                            let longInsterestOrigin = iss.longInsterest;
                            if (sumReturnUint256(Number(longInsterestOrigin), Number(data.intItems.items[0].value)) === Number(data.uintItems.items[0].value)) {
                                console.log("Long Origin Insterest Value:", longInsterestOrigin);
                                console.log("Long Delta Insterest Value:", data.intItems.items[0].value);
                                console.log("Long Next Insterest Value:", data.uintItems.items[0].value);
                                console.log('format Long Next Insterest Value:', calculate(data.uintItems.items[0].value).toString());
                                iss.longInsterest = data.uintItems.items[0].value;
                                iresult.set(data.addressItems.items[0].value, iss);
                            } else {
                                console.error("compute with long next value wrong, please check");
                            }
                        }
                    } else {
                        const iss = iresult.get(data.addressItems.items[0].value);
                        if (iss) {
                            let shortInsterestOrigin = iss.shortInsterest;
                            if (sumReturnUint256(Number(shortInsterestOrigin), Number(data.intItems.items[0].value)) === Number(data.uintItems.items[0].value)) {
                                console.log("Short Origin Insterest Value:", shortInsterestOrigin);
                                console.log("Short Delta Insterest Value:", data.intItems.items[0].value);
                                console.log("Short Next Insterest Value:", data.uintItems.items[0].value);
                                console.log('format Short Next Insterest Value:', calculate(data.uintItems.items[0].value).toString());
                                iss.shortInsterest = data.uintItems.items[0].value;
                                iresult.set(data.addressItems.items[0].value, iss);
                            } else {
                                console.error("compute with short next value wrong, please check");
                            }
                        }
                    }
                }
            }
        });
    }
}

main().catch(console.error);

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
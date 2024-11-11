import Web3 from 'web3';
import path from "path";
import fs from "fs";

console.log(__dirname);
const web3 = new Web3('https://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS');
const marketList = web3.utils.keccak256(web3.eth.abi.encodeParameter('string', 'MARKET_LIST'));

const abiPathDataStore = path.resolve(__dirname+'/abi', 'DataStore.json');
const contractABIDataStore = JSON.parse(fs.readFileSync(abiPathDataStore, 'utf-8'));
const contractAddressDataStore = "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8";
const contractDataStore = new web3.eth.Contract(contractABIDataStore, contractAddressDataStore);

const abiPathReader = path.resolve(__dirname+'/abi', 'Reader.json');
const contractABIReader = JSON.parse(fs.readFileSync(abiPathReader, 'utf-8'));
const contractAddressReader = "0x23D4Da5C7C6902D4C86d551CaE60d5755820df9E";
const contractReader = new web3.eth.Contract(contractABIReader, contractAddressReader);

async function callGetAddress(key: string) {
    try {
        const address = await contractDataStore.methods.getAddress(key).call();
        console.log('callGetAddress:', address);
        return address;
    } catch (error) {
        console.error('Error calling contract method:', error);
    }
}

async function callGetMarkets() {
    try {
        const market = await contractReader.methods.getMarkets("0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8c", 0, 100).call();
        console.log('callGetMarkets:', JSON.stringify(market));
    } catch (error) {
        console.error('Error calling contract method:', error);
    }
}

async function main() {
    try {

        await callGetMarkets();
    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();
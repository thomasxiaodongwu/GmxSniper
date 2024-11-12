import Web3 from 'web3';
import path from "path";
import fs from "fs";
import { BigNumber, BigNumberish, ethers } from "ethers";

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
        console.error('Error callGetAddress:', error);
    }
}

async function callGetMarkets() {
    try {
        const market = await contractReader.methods.getMarkets("0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8", 0, 100).call();
        console.log('callGetMarkets:', JSON.stringify(market));
        return market;
    } catch (error) {
        console.error('Error callGetMarkets:', error);
    }
}

function getTickersUrl() {
    return "https://arbitrum-api.gmxinfra2.io/prices/tickers";
}

// @ts-ignore
function getTokenPrice({ token, pricesByTokenAddress }) {
    let price = pricesByTokenAddress[token.toLowerCase()];
    return price;
}

async function main() {
    try {
        const marketKey = "0x47c031236e19d024b42f8AE6780E44A573170703";
        const tokenPricesResponse = await fetch(getTickersUrl());
        const tokenPrices = await tokenPricesResponse.json();
        const pricesByTokenAddress = {};

        for (const tokenPrice of tokenPrices) {
            // @ts-ignore
            pricesByTokenAddress[tokenPrice.tokenAddress.toLowerCase()] = {
                min: ethers.BigNumber.from(tokenPrice.minPrice),
                max: ethers.BigNumber.from(tokenPrice.maxPrice),
            };
        }
        const markets = [...(await callGetMarkets())];
        let marketPrices = {}
        for (const market of markets) {
            console.log(market.marketToken);
            if(marketKey === market.marketToken) {
                marketPrices = {
                    indexTokenPrice: getTokenPrice({token: market.indexToken, pricesByTokenAddress}),
                    longTokenPrice: getTokenPrice({token: market.longToken, pricesByTokenAddress}),
                    shortTokenPrice: getTokenPrice({token: market.shortToken, pricesByTokenAddress}),
                };
                console.log(marketPrices);
                break;
            }
        }
        console.log("get into market detail:");
        const marketInfos = await contractReader.methods.getMarketInfo("0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8", marketPrices, marketKey).call();
        console.log(JSON.stringify(marketInfos));
    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();
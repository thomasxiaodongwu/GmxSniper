import Web3 from 'web3';
import path from "path";
import fs from "fs";
import {ethers} from "ethers";
import {openInterestKeyEther} from "./Transform"
import {calculate, getTokenInfo} from "./tokens";
import * as keys from "./keys";

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

const abiPathMark = path.resolve(__dirname+'/abi', 'MarkUtils.json');
const contractABIMark = JSON.parse(fs.readFileSync(abiPathMark, 'utf-8'));
const contractAddressMark = "0x1eC2e346DbF47a0506531a9B8712144E955aC134";
const contractMark = new web3.eth.Contract(contractABIMark, contractAddressMark);

const abiPathMulti = path.resolve(__dirname+'/abi', 'Multicall3.json');
const contractABIMulti = JSON.parse(fs.readFileSync(abiPathMulti, 'utf-8'));
const contractAddressMulti = "0xe79118d6D92a4b23369ba356C90b9A7ABf1CB961";
const contractMulti = new web3.eth.Contract(contractABIMulti, contractAddressMulti);

const provider = new ethers.providers.JsonRpcProvider('https://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS');
const contract = new ethers.Contract("0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8", contractABIMulti, provider);

async function callGetAddress(key: string) {
    try {
        const address = await contractDataStore.methods.getAddress(key).call();
        //console.log('callGetAddress:', address);
        return address;
    } catch (error) {
        console.error('Error callGetAddress:', error);
    }
}

async function callGetUnit(key: string) {
    try {
        const currValue = await contractDataStore.methods.getUint(key).call();
        return currValue;
    } catch (error) {
        console.error('Error callGetUnit:', error);
    }
}
async function multiCall() {
    const multicallReadParams = [];
    const props = [];
    let propsCount = 0;

    const markets = [...(await callGetMarkets())];
    for (const market of markets) {
        console.log(
            "keys.savedFundingFactorPerSecondKey(market.marketToken)",
            market.marketToken,
            keys.savedFundingFactorPerSecondKey(market.marketToken)
        );
        for (const [prop, key] of [
            ["openInterest_collateralLong_isLong", keys.openInterestKey(market.marketToken, market.longToken, true)],
            ["openInterest_collateralLong_isShort", keys.openInterestKey(market.marketToken, market.longToken, false)],
            ["openInterest_collateralShort_isLong", keys.openInterestKey(market.marketToken, market.shortToken, true)],
            ["openInterest_collateralShort_isShort", keys.openInterestKey(market.marketToken, market.shortToken, false)],
        ] as const) {
            props.push(prop);
            //const callData = contractDataStore.methods[prop](key).encodeABI();
            multicallReadParams.push({
                target: "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8",
                allowFailure: false,
                callData: contract.interface.encodeFunctionData(
                    prop,
                    [key]
                ),
            });
        }

        if (propsCount === 0) {
            propsCount = multicallReadParams.length;
        }
    }
    const multicallReadResult = await contractMulti.methods.aggregate3(multicallReadParams);
    console.log(multicallReadResult);
}

async function callGetMarkets() {
    try {
        const market = await contractReader.methods.getMarkets("0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8", 0, 100).call();
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

interface insterest {
    indexInsterest: string;
    longInsterest: string;
    shortInsterest: string;
}

async function getOpenInterest(market: { marketToken: string, longToken: string, shortToken: string }, isLong: boolean): Promise<number> {
    try {
        const result = await contractMark.methods.getOpenInterest("0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8", market, isLong).call();
        return Number(result);
    } catch (error) {
        console.error('Error calling getOpenInterest:', error);
        throw error;
    }
}

async function initTokenPrices(){
    try {
        let result: Map<string, insterest> = new Map();
        const markets = [...(await callGetMarkets())];
        console.log(markets);
        for (const market of markets) {
            const temp = {
                marketToken: market.marketToken,
                longToken: market.longToken,
                shortToken: market.shortToken
            };
            //const longTokenInsterest = await getOpenInterest(temp, true);
            //const shortTokenInsterest = await getOpenInterest(temp, false);
            //console.log('longTokenInsterest:', longTokenInsterest);
            //console.log('shortTokenInsterest:', shortTokenInsterest);
            const indexTokenInsterest = await callGetUnit(keys.openInterestKey(market.marketToken, market.indexToken, true));
            const longTokenInsterest = await callGetUnit(keys.openInterestKey(market.marketToken, market.longToken, true));
            const shortTokenInsterest = await callGetUnit(keys.openInterestKey(market.marketToken, market.shortToken, false));
            console.log('indexTokenInsterest', indexTokenInsterest);
            console.log('longTokenInsterest', longTokenInsterest);
            console.log('shortTokenInsterest', shortTokenInsterest);
            //result.set(market.marketToken.toString(), {indexInsterest: indexTokenInsterest, longInsterest: longTokenInsterest, shortInsterest: shortTokenInsterest});
        }
        return result;
    } catch (error) {
        console.error('Error in initTokenPrices:', error);
    }
}

async function getTokenPrices(marketKey: string) : Promise <MarketInfo | undefined>   {
    try {
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
            if(marketKey === market.marketToken) {
                marketPrices = {
                    indexTokenPrice: getTokenPrice({token: market.indexToken, pricesByTokenAddress}),
                    longTokenPrice: getTokenPrice({token: market.longToken, pricesByTokenAddress}),
                    shortTokenPrice: getTokenPrice({token: market.shortToken, pricesByTokenAddress}),
                };
                break;
            }
        }
        const marketInfos = await contractReader.methods.getMarketInfo("0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8", marketPrices, marketKey).call();
        return parseMarketInfo(marketInfos);
    } catch (error) {
        console.error('Error in main:', error);
    }
}

function parseMarketInfo(data: any): MarketInfo {
    return {
        market: data.market,
        borrowingFactorPerSecondForLongs: data.borrowingFactorPerSecondForLongs,
        borrowingFactorPerSecondForShorts: data.borrowingFactorPerSecondForShorts,
        baseFunding: data.baseFunding,
        nextFunding: data.nextFunding,
        virtualInventory: data.virtualInventory,
        isDisabled: data.isDisabled,
    };
}

interface Props {
    marketToken: string;
    indexToken: string;
    longToken: string;
    shortToken: string;
}

interface CollateralType {
    longToken: number;
    shortToken: number;
}

interface PositionType {
    long: CollateralType;
    short: CollateralType;
}

interface BaseFundingValues {
    fundingFeeAmountPerSize: PositionType;
    claimableFundingAmountPerSize: PositionType;
}

interface GetNextFundingAmountPerSizeResult {
    longsPayShorts: boolean;
    fundingFactorPerSecond: number;
    nextSavedFundingFactorPerSecond: number;
    fundingFeeAmountPerSizeDelta: PositionType;
    claimableFundingAmountPerSizeDelta: PositionType;
}

interface VirtualInventory {
    virtualPoolAmountForLongToken: number;
    virtualPoolAmountForShortToken: number;
    virtualInventoryForPositions: number;
}

interface MarketInfo {
    market: Props;
    borrowingFactorPerSecondForLongs: number;
    borrowingFactorPerSecondForShorts: number;
    baseFunding: BaseFundingValues;
    nextFunding: GetNextFundingAmountPerSizeResult;
    virtualInventory: VirtualInventory;
    isDisabled: boolean;
}

export { getTokenPrices, callGetMarkets, initTokenPrices };

async function main(){
    await initTokenPrices();
    // await multiCall();
}

main().catch(console.error);
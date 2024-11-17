import Web3 from 'web3';
import { keccak256 } from 'ethers/lib/utils';

const web3 = new Web3();

const OPEN_INTEREST_WEB3 = web3.utils.keccak256(web3.utils.encodePacked('OPEN_INTEREST') as string);

function openInterestKeyWeb3(market: string, collateralToken: string, isLong: boolean): string {
    return web3.utils.keccak256(
        web3.utils.encodePacked(
            OPEN_INTEREST_WEB3,
            market,
            collateralToken,
            isLong ? '0x01' : '0x00'
        ) as string
    );
}

const OPEN_INTEREST_ETHER = keccak256(Buffer.from('OPEN_INTEREST'));

function openInterestKeyEther(market: string, collateralToken: string, isLong: boolean): string {
    return keccak256(
        Buffer.concat([
            Buffer.from(OPEN_INTEREST_ETHER.slice(2), 'hex'),
            Buffer.from(market.slice(2), 'hex'),
            Buffer.from(collateralToken.slice(2), 'hex'),
            Buffer.from([isLong ? 1 : 0])
        ])
    );
}

// 示例调用
const marketAddress1 = '0x1234567890abcdef1234567890abcdef12345678';
const collateralTokenAddress1 = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef';
const isLong1 = true;

const result1 = openInterestKeyEther(marketAddress1, collateralTokenAddress1, isLong1);
console.log('Open Interest Key:', result1);

const marketAddress = '0x1234567890abcdef1234567890abcdef12345678';
const collateralTokenAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef';
const isLong = true;

const result = openInterestKeyWeb3(marketAddress, collateralTokenAddress, isLong);
console.log('Open Interest Key:', result);

export { openInterestKeyWeb3, openInterestKeyEther };
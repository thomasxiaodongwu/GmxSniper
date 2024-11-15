import Web3 from 'web3';

const web3 = new Web3();

const OPEN_INTEREST = web3.utils.keccak256(web3.utils.encodePacked('OPEN_INTEREST') as string);

function openInterestKey(market: string, collateralToken: string, isLong: boolean): string {
    return web3.utils.keccak256(
        web3.utils.encodePacked(
            OPEN_INTEREST,
            market,
            collateralToken,
            isLong ? '0x01' : '0x00'
        ) as string
    );
}

export { openInterestKey };
import { BigNumber } from 'bignumber.js';

function calculate(a: string): BigNumber {
    const divisor = new BigNumber(2).pow(96);
    return new BigNumber(a).dividedBy(divisor);
}

const uint256Value = '41458205439508593024621185058880012909';
const result = calculate(uint256Value);
console.log('Result:', result.toString());
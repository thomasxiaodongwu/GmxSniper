import fs from 'fs';
import {BigNumber} from "bignumber.js";

interface Token {
    symbol: string;
    address: string;
    decimals: number;
}

interface TokensData {
    tokens: Token[];
}

function loadTokensData(filePath: string): TokensData {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function getTokenInfo(address: string): { symbol: string; decimals: number } | null {
    const tokensData = loadTokensData('./datafiles/tokens.json');
    const token = tokensData.tokens.find(token => token.address.toLowerCase() === address.toLowerCase());
    return token ? { symbol: token.symbol, decimals: token.decimals } : null;
}

function calculate(a: string): BigNumber {
    const divisor = new BigNumber(2).pow(96);
    return new BigNumber(a).dividedBy(divisor);
}

export { getTokenInfo , calculate};
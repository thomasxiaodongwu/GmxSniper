import Web3 from 'web3';

// 初始化 Web3
const web3 = new Web3();

// 假设 uint256Value 是一个十六进制的字符串
const uint256Value = '41458205439508593024621185058880012909'; // 示例值

// 转换为十进制字符串
const decimalValue = web3.utils.toBN(uint256Value).toString();
console.log('Decimal:', decimalValue);
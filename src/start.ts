import Web3 from 'web3';

// 使用 WebSocketProvider 初始化 Web3
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://arb-mainnet.g.alchemy.com/v2/Z08SBQ9CRg6OC8LhlObkEqWrDJyjY2CS'));

// 合约地址
const contractAddress = '0xC8ee91A54287DB53897056e12D9819156D3822Fb';
const eventSignature = web3.utils.keccak256('EventLog1(address,string,string,bytes32,(AddressItems,UintItems,IntItems,BoolItems,Bytes32Items,BytesItems,StringItems))');
console.log('Event Signature:', eventSignature);
// 订阅特定事件
web3.eth.subscribe('logs', {
    address: contractAddress,
    topics: [eventSignature]
}, (error, result) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Event received:', JSON.stringify(result));
        // 解析和处理事件数据
    }
});
const Web3 = require('web3')
var from = process.argv[2];
var fromPK = process.argv[3];
var to = process.argv[4];
var amt = process.argv[5];

const Web3js = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545"))
const privateKey = fromPK
const tokenAddress = '0x3BFB8A4A58E8d973d0834Fee291f0C19012CaF52' 
const fromAddress = from
const toAddress = to
let contractABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"}]
let contract = new Web3js.eth.Contract(contractABI,tokenAddress,{from: fromAddress})
let amount = Web3js.utils.toHex(Web3js.utils.toWei(amt)); 
let data = contract.methods.transfer(toAddress, amount).encodeABI()
let txObj = {
      gas: Web3js.utils.toHex(120000),
       "to": tokenAddress,
       "value": "0x00",
       "data": data,
       "from": fromAddress
}

Web3js.eth.accounts.signTransaction(txObj, privateKey,(err, signedTx)=>{
       if(err){
           return callback(err)
       }else{
           //console.log(signedTx)
           return Web3js.eth.sendSignedTransaction(signedTx.rawTransaction, (err, res)=>{
               if(err){
                   console.log('{"status":"false","hash":"'+err+'"}')
               }else{
                   console.log('{"status":"true","hash":"'+res+'"}')
               }
           })
       }
   })
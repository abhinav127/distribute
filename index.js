var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const Web3 = require('web3')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', function(request, response) {
  response.json({"status":"true"})
})

app.post('/transfer', function(request, response) {
 	const Web3js = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org"))
const privateKey = request.body.privateKey
const tokenAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' 
const fromAddress = request.body.fromAddress
const toAddress = request.body.toAddress
const amt = request.body.amt
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
          Web3js.eth.sendSignedTransaction(signedTx.rawTransaction, (err, result)=>{
               
                  
                  	response.json({"status":true,"result":result})
                 
           })
       }
   })
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

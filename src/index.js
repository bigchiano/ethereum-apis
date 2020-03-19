const express = require('express')
const app = express()
const web3js = require('./Lib/web3')

const port = 3000
app.use(express.json())

// allow cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// transfer ethers to a given address
// expected params {to,key,value}
app.get('/transfer_ethers', async (req, res) => {
    const response = await web3js.signTransaction(req.body)
    if (response.error)  return res.status(400).send({'error': response.error})
    res.status(200).send(response)
})

// check ethers account balance
app.get('/check_balance', async (req, res) => {
    const response = await web3js.checkBalance(req.body.address)
    if (response.error)  return res.status(400).send({'error': response.error})
    res.status(200).send(response)
})

// create ethers account
app.get('/create_address', async (req, res) => {
    const response = await web3js.createAccount()
    if (response.error)  return res.status(400).send({'error': response.error})
    res.status(200).send(response)
})

app.listen(port, () => {
    console.log('server is setup on port ' + port)
})
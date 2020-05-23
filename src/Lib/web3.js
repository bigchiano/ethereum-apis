const Web3 = require('web3')
const prodWeb3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/f3f30b367c6c45c093d0a7c7bd7709fa'))
const localWeb3 = new Web3("ws://127.0.0.1:7454")

// import lib to enable us read env file
const dotenv = require('dotenv');
dotenv.config();

const web3 = (process.env.NODE_ENV === 'production') ? prodWeb3 : localWeb3

async function createAccount() {
    let newAcc = await web3.eth.accounts.create()
    // let encryptKey = web3.eth.accounts.encrypt(newAcc.privateKey, process.env.key)
    return {
        'address': newAcc.address,
        'privateKey': newAcc.privateKey
    }
}

async function checkBalance(address) {
    if (!address) return {'error': 'account address is required'}
    let balance = await web3.eth.getBalance(address)
    balance = web3.utils.fromWei(balance)
    return { balance }
}

async function signTransaction(req) {
    try {
        // sign the transaction to prove ownership of the account to send
        // ethers from using the private key
        // get address nonce
        const account = await web3.eth.accounts.privateKeyToAccount('0x' + req.key)
        const pubKey = account.address
        // get transaction count for this wallet
        const nonce = await web3.eth.getTransactionCount(pubKey)
        // convert amount to send from ether to wei
        const value = web3.utils.toWei(`${req.value}`, "ether")
        // convert gas limit to big number
        const gas = web3.utils.toBN(21000)
        // get and convert gas price to wei 
        // const gasPrice = web3.utils.toWei(web3.utils.toBN(1), "gwei");
        const gasPrice = await web3.eth.getGasPrice()
        // calculate cost
        const cost = gas * gasPrice
        // subtract cost from value to send
        const sendValue = value - cost

        // create object for transaction to sign
        const txObj = {
            to: req.to,
            value: sendValue,
            gas,
            gasPrice,
            nonce
        }

        const signedTx = await web3.eth.accounts.signTransaction(txObj, req.key)

        try {
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            return receipt 
            
        } catch (error) {
            return {
                "error": error.message
            }
        }
        
    } catch (error) {
        return {
            "error": error.message
        }
    }
}

module.exports  = { createAccount, signTransaction, checkBalance }

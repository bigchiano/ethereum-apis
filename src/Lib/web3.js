const Web3 = require('web3')
const web3 = new Web3("ws://127.0.0.1:7000")
// import lib to enable us read env file
// const dotenv = require('dotenv');
// dotenv.config();

async function createAccount() {
    let newAcc = await web3.eth.accounts.create()
    // let encryptKey = web3.eth.accounts.encrypt(newAcc.privateKey, process.env.key)
    return {
        'address': newAcc.address,
        'privateKey': newAcc.privateKey
    }
}

async function signTransaction(req) {
    try {
        // sign the transaction to prove ownership of the account to send
        // ethers from using the private key
        let signedTx = await web3.eth.accounts.signTransaction({
            gas: '21000',
            to: req.to,
            value: web3.utils.toWei(`${req.value}`, "ether"),
        }, req.key)
        
        try {
            let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
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

module.exports  = { createAccount, signTransaction }
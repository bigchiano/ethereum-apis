const express = require('express')
const app = express()
const web3js = require('./Lib/web3')

const port = 3000
app.use(express.json())

app.get('/send_ethers', async (req, res) => {
    const response = await web3js.signTransaction(req.body)
    if (response.error)  return res.status(400).send(response.error)
    res.status(200).send(response)
})

app.listen(port, () => {
    console.log('server is setup on port ' + port)
})
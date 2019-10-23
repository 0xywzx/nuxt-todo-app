import Common from "ethereumjs-common"

export default async function(app, address, pk, functionAbi) {
  const EthereumTx = require('ethereumjs-tx').Transaction
  const nonce = await $web3.eth.getTransactionCount(address)

  var details = await {
      nonce : nonce,
      gasPrice : 0,
      gasLimit: 500000,
      from : address,
      to : $flibraContract.options.address, //app.$contract.options.address, 
      data : functionAbi,
  }
  const customCommon = await Common.forCustomChain(
      'mainnet',
      {
          name: 'privatechain',
          networkId: 1515,
          chainId: 1515,
      },
      'petersburg',
  )

  const transaction = await new EthereumTx(details,{ common: customCommon })
  await transaction.sign(Buffer.from(pk.slice(2),'hex',))
  
  var rawdata = await '0x' + transaction.serialize().toString('hex');
  await $web3.eth.sendSignedTransaction(rawdata)
  .on('transactionHash', function(hash){
      console.log(['transferToStaging Trx Hash:' + hash]);
  })
  .on('receipt', function(receipt){
      console.log(['transferToStaging Receipt:', receipt]);
  })
  .on('error', function(error) {console.log(error)});
}


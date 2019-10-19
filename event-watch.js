var Web3 = require('web3');
var flibra = require('./src/abis/FLibra.json');
var db = require ('./src/plugins/firebase.js');

async function setContract() {
  var web3 = await new Web3(new Web3.providers.WebsocketProvider('ws://0.0.0.0:8546'));
  let networkId = await web3.eth.net.getId();
  let flibraContract = await new web3.eth.Contract(
    flibra.abi,
    flibra.networks[networkId].address
  );

  flibraContract.events.PostItem({   }, function(error, event){  })
  .on('data', function(event){
      console.log(event)
      setItemInFirebase(event)
  })
  .on('changed', function(event){
      // remove event from local database
  })
  .on('error', console.error);
    
  // //subscribe
  // let web3Provider = await new Web3.providers.WebsocketProvider("ws://0.0.0.0:8546");
  // var web3Obj = await new Web3(web3Provider);
  // var subscription = web3Obj.eth.subscribe('logs', {
  //     address: '0x327Aa8e037bBC4C3ddD4591ec420C7fECe9d414D', //Smart contract address
  //     //topics: ['0x12345'] //topics for events
  // }, function(error, result){
  //     if (error) console.log(error);
  // }).on("data", function(trxData){
  //   console.log("Event received", trxData);
  //   //Code from here would be run immediately when event appeared
  // });
}

async function setItemInFirebase (item) {
  var itemRef = await db.collection('items')
  itemRef.add(item)
}

setContract()


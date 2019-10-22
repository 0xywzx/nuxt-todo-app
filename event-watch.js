var Web3 = require('web3');
var flibra = require('./src/abis/FLibra.json');

var firebase = require('firebase');
require('firebase/firestore');

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyAIqQE5536C0FyUnOQS94xi0UrqM-miX-k",
      authDomain: "nuxt-firestore-80092.firebaseapp.com",
      databaseURL: "https://nuxt-firestore-80092.firebaseio.com",
      projectId: "nuxt-firestore-80092",
      storageBucket: "gs://nuxt-firestore-80092.appspot.com",
      messagingSenderId: "247244459401",
      appId: "1:247244459401:web:af0d3f277789fdfcfe2558"
    }
  )
}
var db = firebase.firestore();

async function setContract() {
  var web3 = await new Web3(new Web3.providers.WebsocketProvider('ws://0.0.0.0:8546'));
  let networkId = await web3.eth.net.getId();
  let flibraContract = await new web3.eth.Contract(
    flibra.abi,
    flibra.networks[networkId].address
  );

  console.log('Watching event')

  // --------- PostItem event ---------
  flibraContract.events.PostItem({ }, function(error, event){  })
  .on('data', function(event){
      console.log(event.returnValues)
      setItemInFirebase(event)
  })
  .on('changed', function(event){
      // remove event from local database
  })
  .on('error', console.error);
    
  // --------- ItemPurchased event ---------
  flibraContract.events.ItemPurchased({ }, function(error, event){  })
  .on('data', function(event){
      console.log('ItemPurchased event detected', event.returnValues)
      changeItemStatusInFirebase(event)
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
  var itemRef = await db.collection('items').doc(item.returnValues.id)
  itemRef.add({
    itemId: item.returnValues.id,  // あとでItemIdに変更する
    itemName: item.returnValues.itemName,
    price: item.returnValues.price,
    purchaser: item.returnValues.purchaser,
    seller: item.returnValues.seller,
    selling: item.returnValues.selling,
  })
  .then(function() {
    console.log('Added item info in firestore');
  })
}

async function changeItemStatusInFirebase (item) {
  await db.collection('items').doc(item.returnValues.id).update({
    'selling': item.returnValues.selling,
    'purchaser': item.returnValues.purchaser,
  })
  .then(function() {
    console.log('item selling status updated in firestore');
  })

  // var itemRef = await db.collection('items')
  // itemRef.add({
  //   id: item.returnValues.id,
  //   itemName: item.returnValues.itemName,
  //   price: item.returnValues.price,
  //   purchaser: item.returnValues.purchaser,
  //   seller: item.returnValues.seller,
  //   selling: item.returnValues.selling,
  // })
}

setContract()


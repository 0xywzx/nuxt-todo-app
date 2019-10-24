var Web3 = require('web3');
var flibra = require('./src/abis/FLibra.json');
var itemDetail = require('./src/abis/ItemDetail.json');

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
}

async function setItemInFirebase (item) {
  var web3 = await new Web3(new Web3.providers.WebsocketProvider('ws://0.0.0.0:8546'));
  let itemContract = await new web3.eth.Contract(
    itemDetail.abi,
    item.returnValues.itemDetailContract
  );
  let itemDetailResult = await itemContract.methods.getItem().call()
  await db.collection('items').doc(item.returnValues.id)
  .set({
    itemId: item.returnValues.id, 
    itemDetailContract: item.returnValues.itemDetailContract,
    purchaser: item.returnValues.purchaser,
    seller: item.returnValues.seller,
    selling: item.returnValues.selling,
    itemName: itemDetailResult.itemName,
    itemPhoto: itemDetailResult.itemPhoto,
    price: itemDetailResult.price,
    itemDetailText: itemDetailResult.itemDetailText,
    category: itemDetailResult.category,
    subCategory: itemDetailResult.subCategory,
    itemCondition: itemDetailResult.itemCondition,
  })
  .then(function() {
    console.log('Set item info in firestore');
  })
}

async function changeItemStatusInFirebase (item) {
  await db.collection('items').doc(item.returnValues.id).update({
    'selling': Boolean(""),
    'purchaser': item.returnValues.purchaser,
  })
  .then(function() {
    console.log('item selling status updated in firestore');
  })
}

setContract()


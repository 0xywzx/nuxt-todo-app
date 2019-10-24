<template>
  <div>
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    <div style="padding: 30px;">
      <el-form ref="form" :model="form" label-width="120px" style="width: 500px">
        <el-form-item label="商品名">
          <el-input type="text" placeholder="Please input" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="写真">
          <input type="file" placeholder="Please input" @change="captureFile" />
        </el-form-item>
        <el-form-item label="価格">
          <el-input type="number" placeholder="商品の価格" v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="商品の説明">
          <el-input type="text" placeholder="商品の詳細な説明を記載してください" v-model="form.detailText"></el-input>
        </el-form-item>
        <el-form-item label="カテゴリー">
          <el-select v-model="form.category" placeholder="カテゴリー">
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="サブカテゴリー">
          <el-select v-model="form.subCategory" placeholder="サブカテゴリー">
            <el-option
              v-for="item in subCategoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品の状態">
          <el-select v-model="form.itemCondition" placeholder="商品の状態">
            <el-option
              v-for="item in itemConditionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="postItem">投稿する</el-button>
      </el-form>  
    </div>  
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ItemDetail from "../abis/ItemDetail.json";
import sendTx from "~/plugins/sendTx.js";
import Common from "ethereumjs-common";
import itemOption from "./itemOption.json"
import firebase from '~/plugins/firebase'
import 'firebase/firestore'


export default {

  data: function() {
    return {
      categoryList : itemOption.categoryList,
      subCategoryList : itemOption.subCategoryList1,
      itemConditionList : itemOption.itemConditionList,
      form: {
        name: '',
        price: '',
        buffer: '',
        detailText: '',
        category: '',
        subCategory: '',
        itemCondition: '',
      }
    }
  },
  computed: {
    libraAddress () {
      return this.$store.state.user.libraAddress;
    },
    etherAddress () {
      return this.$store.state.user.etherAddress;
    },
  },
  methods: {
    async captureFile(e) {
        event.preventDefault()
        const file = await event.target.files[0]
        const reader = await new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
          this.form.buffer = Buffer(reader.result)
          console.log('buffer', this.form.buffer)
        }
    },
    // async postItem() {
    //   //let result = await this.$ipfs.add(this.form.buffer);  result[0].hash,
    //   const address = await this.$store.state.user.etherAddress
    //   const pk = await this.$store.state.user.pk
    //   const functionAbi = await this.$flibraContract.methods.setItem(this.form.name, "QmSYuVwLoxKWaUWA9EpWZuPZDMJ9dVqpH4mGeyF82jNABD", this.form.price).encodeABI()
    //   await sendTx(this, address, pk, functionAbi)
    // }
    async postItem() {
      //let result = await this.$ipfs.add(this.form.buffer);  result[0].hash,
      const address = await this.$store.state.user.etherAddress
      const pk = await this.$store.state.user.pk

      // ------------- あとでplugin化する、データのフローを意識する -------------
      const customCommon = Common.forCustomChain(
        'mainnet',
        {
          name: 'privatechain',
          networkId: 1515,
          chainId: 1515,
        },
        'petersburg',
      )
      var itemContract = new this.$web3.eth.Contract(ItemDetail.abi)

      const hexdata = await itemContract.deploy({
        data: ItemDetail.bytecode,
        arguments:["name", "QmSYuVwLoxKWaUWA9EpWZuPZDMJ9dVqpH4mGeyF82jNABD", 10, "detailText", "category", "subCategory", "itemCondition"]
        //arguments:[this.form.name, "QmSYuVwLoxKWaUWA9EpWZuPZDMJ9dVqpH4mGeyF82jNABD", this.form.price, this.form.detailText, this.form.category, this.form.subCategory, this.form.itemCondition]
      }).encodeABI()

      const nonce = await this.$web3.eth.getTransactionCount(address)

      const nonceHex = await this.$web3.utils.toHex(nonce);
      const gasPriceHex = await this.$web3.utils.toHex(0);
      const gasLimitHex = await this.$web3.utils.toHex(5000000);

      var details = await {
        nonce : nonceHex,
        gasPrice : gasPriceHex,
        gasLimit: gasLimitHex,
        from : address,
        data : hexdata,
      };

      const EthereumTx = require('ethereumjs-tx').Transaction;
      const transaction = await new EthereumTx(details, { common: customCommon },);

      const privatekey = await Buffer.from(pk.slice(2), 'hex', )

      await transaction.sign(privatekey)
      console.log(transaction)

      var rawdata = await '0x' + transaction.serialize().toString('hex');
      console.log(rawdata)

      let app = this;
      let web3 = this.$web3
      let flibraContract = this.$flibraContract;
      let flibraContractWS = this.$flibraContractWS;
      let ref_item = await firebase.firestore().collection('items');

      await this.$web3.eth.sendSignedTransaction(rawdata)
      .on('transactionHash', function(hash){
        console.log(['transferToStaging Trx Hash:' + hash]);
      })
      .on('confirmation', function(confirmationNumber, receipt){
      })
      .on('receipt', async function(receipt){
        // いい感じにする 
        
        console.log(['transferToStaging Receipt:', receipt]);
        const functionAbi = await flibraContract.methods.postItem(receipt.contractAddress).send({from: address})
        .on('transactionHash', function(hash){
          console.log(hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
        })
        .on('receipt', function(receipt){
          console.log(receipt)
        }) 
        
        // encodeABI()
        // const result = await sendTx(app, address, pk, functionAbi)

        // itemのコントラクトを作成する
        // let itemContract = await new web3.eth.Contract(
        //   ItemDetail.abi,
        //   receipt.contractAddress
        // );
        // let itemDetailResult = await itemContract.methods.getItem().call()

        // flibraContractWS.events.ItemPurchased({ }, function(error, event){  })
        // .on('data', function(event){
        //     console.log('ItemPurchased event detected', event.returnValues)
        //     // firebaseに保存
        //     ref_item.doc(item.returnValues.id)
        //     .set({
        //       itemId: item.returnValues.id, 
        //       itemDetailContract: item.returnValues.itemDetailContract,
        //       purchaser: item.returnValues.purchaser,
        //       seller: item.returnValues.seller,
        //       selling: item.returnValues.selling,
        //       itemName: itemDetailResult.itemName,
        //       itemPhoto: itemDetailResult.itemPhoto,
        //       price: itemDetailResult.price,
        //       itemDetailText: itemDetailResult.itemDetailText,
        //       category: itemDetailResult.category,
        //       subCategory: itemDetailResult.subCategory,
        //       itemCondition: itemDetailResult.itemCondition,
        //     })

        // })
        // .on('error', console.error);
      })
      .on('error', console.error);
    },
  },
  async mounted() {

  }
}

</script>

<style scoped>
.practice-title {
  margin: 10px;
}
</style>

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
          <el-input type="number" placeholder="Please input" v-model="form.price"></el-input>
        </el-form-item>
        <el-button type="info" @click="postItem">投稿する</el-button>
      </el-form>  
    </div>  
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ItemDetal from "../abis/ItemDetail.json";
import sendTx from "~/plugins/sendTx.js";
import Common from "ethereumjs-common";


export default {
  data: function() {
    return {
      form: {
        name: '',
        price: '',
        buffer: '',
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
      var itemContract = new this.$web3.eth.Contract(ItemDetal.abi)

      const hexdata = await itemContract.deploy({
        data: ItemDetal.bytecode,
        arguments:["sample1", "QmSYuVwLoxKWaUWA9EpWZuPZDMJ9dVqpH4mGeyF82jNABD", 10, "Detail", "Categiry1", "subcategory1", "itemcondition1"]
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
      console.log(details)

      const EthereumTx = require('ethereumjs-tx').Transaction;
      const transaction = await new EthereumTx(details, { common: customCommon },);

      const privatekey = await Buffer.from(pk.slice(2), 'hex', )

      await transaction.sign(privatekey)
      console.log(transaction)

      var rawdata = await '0x' + transaction.serialize().toString('hex');
      console.log(rawdata)

      let flibraContract = this.$flibraContract

      await this.$web3.eth.sendSignedTransaction(rawdata)
      .on('transactionHash', function(hash){
        console.log(['transferToStaging Trx Hash:' + hash]);
      })
      .on('receipt', async function(receipt){
        console.log(['transferToStaging Receipt:', receipt]);
        const functionAbi = await flibraContract.methods.postItem(receipt.contractAddress).encodeABI()
        await sendTx(this, address, pk, functionAbi)
      })
      .on('error', console.error);
    }
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

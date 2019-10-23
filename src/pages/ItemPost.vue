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
import sendTx from "~/plugins/sendTx.js"

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
      var itemContract = new this.$web3.eth.Contract(ItemDetal.abi)

      await itemContract.deploy({
        data: bytecode,
        arguments:["sample1", "QmSYuVwLoxKWaUWA9EpWZuPZDMJ9dVqpH4mGeyF82jNABD", 10, "Detail", "Categiry1", "sub category 1", "item condition1"]
      })
      .send({
        from: address,
        gas: 1500000,
        gasPrice: '30000000000000',
      }).on('error', (error) => {
          console.log("Error: ", error);
      }).on('transactionHash', (transactionHash) => {
          console.log("TxHash: ", transactionHash);
      }).on('receipt', (receipt) => {
        console.log("Address: ", receipt.contractAddress)  
        const functionAbi = await this.$flibraContract.methods.postItem(receipt.contractAddress).encodeABI()
        await sendTx(this, address, pk, functionAbi)

      }).catch(function(error) {
          console.log(error);
      });


      const functionAbi = await this.$flibraContract.methods.setItem(this.form.name, "QmSYuVwLoxKWaUWA9EpWZuPZDMJ9dVqpH4mGeyF82jNABD", this.form.price).encodeABI()
      await sendTx(this, address, pk, functionAbi)
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

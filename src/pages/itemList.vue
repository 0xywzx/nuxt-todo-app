<template>
  <div>
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    <div style="padding: 30px;">
      <h2>商品リスト</h2>
      <div class="item-list" v-for="item in onSaleItems">
        <el-card class="item-card" :body-style="{ padding: '0px' }" style="width: 20%;">
          <img class="item-image" :src="'https://ipfs.io/ipfs/' + item.itemPhoto" >
          <div style="padding: 14px;">
            <span>{{ item.itemName }}</span>
            <span><img src="~/assets/img/libra-coin.png" style="width: 14px; height: 14px;">{{ item.price }}</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">詳細</el-button>
              <el-button @click="purchase(item.id, item.seller, item.price)" >購入する</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>  
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { LibraWallet, LibraClient, LibraNetwork } from 'kulap-libra';
const BigNumber = require('bignumber.js')
import sendTx from "~/plugins/sendTx.js"

export default {
  data: function() {
    return {

    }
  },
  computed: {
    onSaleItems () {
      return this.$store.state.item.onSaleItems;
    }
  },
  methods: {
    ...mapActions({
      getOnSaleItems: "item/getOnSaleItems"
    }),
    async purchase(itemId, toAddress, amount) {
      // const address = await this.$store.state.user.etherAddress
      // const pk = await this.$store.state.user.pk
      const mnemonic = await this.$store.state.user.mnemonic
      // const functionAbi = await this.$flibraContract.methods.purchaseItem(itemId).encodeABI()
      // await sendTx(this, address, pk, functionAbi)
      
      const client = new LibraClient({ 
        transferProtocol: 'https',
        host: 'ac-libra-testnet.kulap.io',
        port: '443',
        dataProtocol: 'grpc-web-text' 
      })
      const wallet = new LibraWallet({
        mnemonic: mnemonic
      })
      const account = wallet.newAccount()
      const amountToTransfer = BigNumber(100).times(1e6)

      // Stamp account state before transfering
      const beforeAccountState = await client.getAccountState(account.getAddress())

      // Transfer
      let toLibraAddress = "9b05871301dcbbd278db6741733dd98ada138e19f2f01a043546e25371661b2d"
      const response = await client.transferCoins(account, toLibraAddress, amountToTransfer)

      console.log(response)

      // const transferLibra = await this.$axios.post(`http://localhost:3005/transfer`, { 
      //   fromAddress: address,
      //   mnemonic: mnemonic,
      //   toAddress: toAddress,
      //   amount: amount 
      // })
      // console.log(transferLibra)
    }
  },
  async created() {
    await this.getOnSaleItems() 
    //ライフサイクル次第
    // const numberOfItem = await this.$flibraContract.methods.getNumberOfItem().call()
    // if (numberOfItem > 0 ) {
    //   for ( var i = 0; i < numberOfItem; i++ ) {
    //     const item = await this.$flibraContract.methods.getItemOnSale(i).call()
    //     console.log(item)
    //     if (item.selling === Boolean("true")) {
    //       this.$store.commit('item/setOnSaleItems', item)
    //     }
    //   }
    // }
  }
}

</script>

<style scoped>
.item-list {
  margin: 20px;
}

.item-card {
  float: left;
  margin-left: 5px;
  margin-bottom: 5px; 
}

.item-image {
  height: 200px;
}
</style>

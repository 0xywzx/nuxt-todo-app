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
      const address = await this.$store.state.user.etherAddress
      const pk = await this.$store.state.user.pk
      const mnemonic = await this.$store.state.user.mnemonic
      const functionAbi = await this.$flibraContract.methods.purchaseItem(itemId).encodeABI()
      await sendTx(this, address, pk, functionAbi)
      const transferLibra = await this.$axios.post(`http://localhost:3005/transfer`, { 
        fromAddress: address,
        mnemonic: mnemonic,
        toAddress: toAddress,
        amount: amount 
      })
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

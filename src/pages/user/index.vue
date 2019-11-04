<template>
  <div>
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    <div style="padding: 30px;">
      <p> Libra Address: {{ $store.state.user.libraAddress }}</p>
      <p> Libra Balance: {{ libraBalance }}</p>
      <p> Ether Address: {{ $store.state.user.etherAddress }}</p>
    </div>  
    <h2 class="title-text">投稿リスト</h2>
      <PostItemsList />
    <h2 class="title-text">購入リスト</h2>
    <div class="my-item-list" v-if="myPurchaedItems.length > 0" >
      <div class="item-list" v-for="item in myPurchaedItems">
        <el-card :body-style="{ padding: '0px' }" style="width: 100%;">
          <img class="item-image" :src="'https://ipfs.io/ipfs/' + item.itemPhoto" >
          <div style="padding: 14px;">
            <span>{{ item.itemName }}</span>
            <span><img src="~/assets/img/libra-coin.png" style="width: 14px; height: 14px;">{{ item.price }}</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">詳細</el-button>
              <el-button v-if="item.text === ''" class="button" @click="visibleReviewToSeller = true">レビューを書く</el-button>
              <el-dialog :visible.sync="visibleReviewToSeller" title="レビューを書く">
                <el-form ref="form" :model="form" label-width="120px" style="width: 500px">
                  <ReviewToSeller
                    :itemId="item.id" />
                </el-form>
              </el-dialog>  
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <h2 class="title-text">レビュー</h2>
      <div>
        <div class="review-list">
          <h3>販売者としてのレビュー</h3>
          <div v-for="review in myReviewsAsSeller">
            <p>From: {{ review.purchaser }}</p>
            <p>レート: {{ review.star }}</p>
            <p>メッセージ: {{ review.text }}</p>
          </div>
        </div>
        <div class="review-list">
          <h3>購買者としてのレビュー</h3>
          <div v-for="review in myReviewsAsPurchaser">
            <p>From: {{ review.seller }}</p>
            <p>レート: {{ review.star }}</p>
            <p>メッセージ: {{ review.text }}</p>
          </div>
        </div>
      </div>
  </div>  
</template>

<script>
import ReviewToPurchaser from '@/components/UserPage/ReviewToPurchaser'
import ReviewToSeller from '@/components/UserPage/ReviewToSeller'
import PostItemsList from '@/components/UserPage/PostItemsList'
import { mapMutations, mapActions } from 'vuex'
import sendTx from "~/plugins/sendTx.js"

export default {
  components: {
    ReviewToPurchaser,
    ReviewToSeller,
    PostItemsList
  },
  data: function() {
    return {
      visibleReviewToPurchaser: false,
      visibleReviewToSeller: false,
      libraBalance: '',
      form: {
        star: '',
        text: '',
      }
    }
  },
  computed: {
    myPurchaedItems () {
      return this.$store.state.item.myPurchaedItems;
    },
    myReviewsAsSeller () {
      return this.$store.state.item.myReviewsAsSeller;
    },
    myReviewsAsPurchaser () {
      return this.$store.state.item.myReviewsAsPurchaser;
    },
  },
  methods: {
    ...mapActions({
      //addTodoChain: "todosChain/addTodoChain"
      getMyPurchaedItems: "item/getMyPurchaedItems",
      getMyPostedItems: "item/getMyPostedItems"
    }),
    async getLibraBalance() {
      const walletBalance = await axios.post(`http://localhost:3005/getBalance`, { address: address })
    },
  },
  async created() {
    await this.getMyPurchaedItems(this)
    await this.getMyPostedItems(this)
  },
  async asyncData({app, store, commit}) {
    const address = await store.state.user.libraAddress;
    // const walletBalance = await app.$axios.post(`http://localhost:3005/getBalance`, { address: address })
    // return { libraBalance: walletBalance.data.balance } 
    const client = new LibraClient({ network: LibraNetwork.Testnet })
    const accountState = await client.getAccountState(address);

    // log account balance
    console.log(accountState.balance.toString());
  }
}

</script>

<style scoped>
.title-text {
  clear: both;
  text-align: center;
}

.my-item-list {
  padding-top: 10px;
  padding-left: 15px;
}

.item-list {
  width: 17%;
  float: left;
  margin: 2px;
}

.item-image {
  height: 200px;
} 

.review-list {
  float: left;
  width: 45%;
  margin-left: 5px;
  border: 1px solid black; 
}

</style>

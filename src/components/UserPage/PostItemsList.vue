<template>
  <div class="my-item-list" v-if="myPostedItems.length > 0">
    <div class="item-list" v-for="(item, index) in myPostedItems" v-bind:key="item.id" >
      <el-card :body-style="{ padding: '0px' }" style="width: 100%;">
        <img class="item-image" :src="'https://ipfs.io/ipfs/' + item.itemPhoto" >
        <div style="padding: 14px;">
          <span>{{ item.itemName }}</span>
          <span><img src="~/assets/img/libra-coin.png" style="width: 14px; height: 14px;">{{ item.price }}</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button">詳細</el-button>
            <div v-if="item.selling === Boolean(false)">
              <el-button v-if="item.text === '' " class="button" @click="visibleReviewToPurchaser = true">レビューを書く</el-button>
              <el-dialog :visible.sync="visibleReviewToPurchaser" title="レビューを書く">
                <ReviewToPurchaser
                  :itemId="item.id" />
              </el-dialog>  
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ReviewToPurchaser from '@/components/UserPage/ReviewToPurchaser'
import sendTx from "~/plugins/sendTx.js"

export default {
  props: ['itemId'],
  data: function() {
    return {
      form: {
        star: '',
        text: '',
      }
    }
  },
  computed: {
    myPostedItems () {
      return this.$store.state.item.myPostedItems;
    },
  },
  methods: {
    ...mapActions({
      //addTodoChain: "todosChain/addTodoChain"
      getMyPurchaedItems: "item/getMyPurchaedItems",
      getMyPostedItems: "item/getMyPostedItems"
    }),
  },
  async created() {
    await this.getMyPostedItems(this)
  },
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

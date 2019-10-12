import sendTx from "~/plugins/sendTx.js"

export const state = () => ({
  onSaleItems: [],
  myPostedItems: [],
  myPurchaedItems: [],
  writeReviewsToPurchaser: [],
  myReviewsAsSeller: [],
  myReviewsAsPurchaser: []
})

export const mutations = {
  setOnSaleItems(state, item) {
    state.onSaleItems.push(item)
  },
  setMyPostedItems(state, item) {
    state.myPostedItems.push(item)
  },
  setMyPurchaedItems(state, item) {
    state.myPurchaedItems.push(item)
  },
  setwriteReviewsToPurchaser(state, item) {
    state.writeReviewsToPurchaser.push(item)
  },
  setmyReviewsAsSeller(state, item) {
    state.myReviewsAsSeller.push(item)
  },
  setmyReviewsAsPurchaser(state, item) {
    state.myReviewsAsPurchaser.push(item)
  }
};

export const actions = {
  async getOnSaleItems({commit, state}) {
    const numberOfItem = await this.$flibraContract.methods.getNumberOfItem().call()
    if (numberOfItem > 0 ) {
      for ( var i = 0; i < numberOfItem; i++ ) {
        const item = await this.$flibraContract.methods.getItemOnSale(i).call()
        //console.log(item)
        if (item.selling === Boolean("true")) {
          commit('setOnSaleItems', item)
        }
      }
    }
  },
  async getMyPostedItems({commit, state}, app) {
    const etherAddress = await app.$store.state.user.etherAddress
    const myItemId = await this.$flibraContract.methods.getMyItemId(etherAddress).call()
    for ( var j = 0 ; j < myItemId.length; j++ ) {
      const myItem = await this.$flibraContract.methods.getMyItem(myItemId[j]).call()
      //console.log(myItem)
      //commit('setMyPostedItems', myItem)

      // List of Review to Purchaser
      const writeReviewToPurchaser = await this.$flibraContract.methods.getPurchaserReview(myItemId[j]).call()
      // console.log(writeReviewToPurchaser)
      // commit('setwriteReviewsToPurchaser', writeReviewToPurchaser)

      const myPostedItemInfo = await Object.assign(myItem, writeReviewToPurchaser);
      commit('setMyPostedItems', myPostedItemInfo)

      // My Review as Seller
      const myReviewAsSeller = await this.$flibraContract.methods.getSellerReview(myItemId[j]).call()
      if (myReviewAsSeller.text !== "") {
        const purchaser = {'purchaser': myItem.purchaser }
        const myReviewAsSellerInfo = await Object.assign(myReviewAsSeller, purchaser);
        commit('setmyReviewsAsSeller', myReviewAsSellerInfo)
      }
    }
  },
  async getMyPurchaedItems({commit, state}, app) {
    const etherAddress = await app.$store.state.user.etherAddress
    const myPurchaedItemId = await this.$flibraContract.methods.getMyPurchasedItemId(etherAddress).call()
    for ( var k = 0 ; k < myPurchaedItemId.length; k++ ) {
      const myPurchaedItem = await this.$flibraContract.methods.getMyPurchasedItem(myPurchaedItemId[k]).call()
      //console.log(myPurchaedItem)

      // List of Review to Seller
      const writeReviewToSeller = await this.$flibraContract.methods.getSellerReview(myPurchaedItemId[k]).call()
      
      const myPurchasedItemInfo = await Object.assign(myPurchaedItem, writeReviewToSeller);
      commit('setMyPurchaedItems', myPurchasedItemInfo)

      // My Review as Purchaser
      const purchaserReview = await this.$flibraContract.methods.getPurchaserReview(myPurchaedItemId[k]).call()
      if (purchaserReview.text !== "") {
        const seller = {'seller': myPurchaedItem.seller}
        const purchaserReviewInfo = Object.assign(purchaserReview, seller)
        console.log(purchaserReviewInfo)
        commit('setmyReviewsAsPurchaser', purchaserReview)
      }
    }      
  }  
}
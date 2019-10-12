<template>
  <div>
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    <div style="padding: 30px;">
      
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
  
  },
  methods: {
    ...mapActions({
      //addTodoChain: "todosChain/addTodoChain"
      getMyPurchaedItems: "item/getMyPurchaedItems",
      getMyPostedItems: "item/getMyPostedItems"
    }),
  },
  async mounted() {
   
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

</style>

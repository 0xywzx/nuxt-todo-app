<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" style="width: 500px">
      <el-form-item label="レート">
        <el-input type="number" min="0" max="10" placeholder="1-10" v-model="form.star"></el-input>
      </el-form-item>
      <el-form-item label="評価">
        <el-input type="text" placeholder="Please input" v-model="form.text"></el-input>
      </el-form-item>
      <el-button type="info" @click="writeReviewToSeller(itemId)">投稿する</el-button>
    </el-form>
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
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
  
  },
  methods: {
    async writeReviewToSeller(itemId) {
      const functionAbi = await this.$flibraContract.methods.writeReviewToSeller(itemId, this.form.star, this.form.text).encodeABI()
      const address = await this.$store.state.user.etherAddress
      const pk = await this.$store.state.user.pk
      await sendTx(this, address, pk, functionAbi)
    },
  },
  async mounted() {
   
  }
}

</script>

<style scoped>

</style>

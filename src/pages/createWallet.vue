<template>
  <div style="padding: 30px;"> 
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    
    <h2>新規作成</h2>
    <br/>
    <p>Libraアカウントを発行する</p>
    <el-button @click="createWallet">作成する</el-button>
    <br/>
    <div v-show="librawallet.length !== 0">
      <p>MnemonicはLoginする際に必要になります。大切に保管しておいてください。<br/>
      現在、メモをとり終えたら削除しましょう。{{ librawallet.length }}
      </p>
      <p>Libra Address {{ librawallet.address }}</p>
      <p>Mnemonic {{ librawallet.mnemonic }}</p>
    </div>
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { LibraWallet, Account as LibraAccount } from 'kulap-libra';

export default {
  data(){
    return {
      librawallet: []
    }
  },
  methods: {
    async createWallet() {
      const url = "http://localhost:3005/createWallet"
      const response = await this.$axios.post(url)
      //console.log(response.data)
      this.librawallet =response.data
    }  
  }
}

</script>

<style scoped>

</style>

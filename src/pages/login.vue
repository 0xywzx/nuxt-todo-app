<template>
  <div style="padding: 30px;"> 
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    
    <h2 className="title-text">Log in</h2>
    <br/>
    <p>Linraアカウントを作成した際に表示された、24個の単語（mnemonic）を入力してください。</p>
    <input placeholder="mnemonicを入力する" @change="handleValue" @keyup.enter="login">
    <br/>
    <el-button @click="login">ログイン(HandleValueを設定する)</el-button>
    <p>{{ libraAddress }}</p>
    <p>{{ mnemonic }}</p>
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import getPrivateKeyFromMnemonic from "~/plugins/mnemonic-privatekey-utils.js"

export default {
  data(){
    return {
      librawallet: []
    }
  },
  computed: {
    libraAddress () {
      return this.$store.state.user.libraAddress;
    },
    mnemonic () {
      return this.$store.state.user.mnemonic;
    },
  },
  methods: {
    async handleValue(e) {

    },
    async login(e) {
      const url = "http://localhost:3005/login"
      const response = await this.$axios.post(url, {
        mnemonic: e.target.value
      })
      let privateKeyEther = await getPrivateKeyFromMnemonic(e.target.value)
      privateKeyEther = await '0x' + privateKeyEther
      console.log(privateKeyEther)
      const etherAddress = this.$web3.eth.accounts.privateKeyToAccount(privateKeyEther).address;
      await this.$store.commit("user/setlibraAddress", response.data.address);
      await this.$store.commit('user/setmnemonic', e.target.value);
      await this.$store.commit('user/setetherAddress', etherAddress);
      await this.$store.commit('user/setetherPk', privateKeyEther);
      console.log("Done")
    }  
  }
}

</script>

<style scoped>

</style>

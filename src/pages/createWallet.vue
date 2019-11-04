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
const BigNumber = require('bignumber.js')
import { LibraWallet, LibraClient, LibraNetwork, Account as LibraAccount } from 'kulap-libra';
//import libraClient from '~/plugins/libra-core'

export default {
  data(){
    return {
      librawallet: []
    }
  },
  methods: {
    async createWallet() {
      
      const wallet = new LibraWallet()
      const account = wallet.newAccount()

      const url = `http://faucet.testnet.libra.org?amount=${BigNumber(100).times(1e6).toString(10)}&address=${account.getAddress().toHex()}`
      fetch(url, {
        method: 'post',
        mode: 'no-cors'
      }).then( function(data) {
        console.log(data)
      })
    }  
  }
}

</script>

<style scoped>

</style>

<template>
  <div>
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    <h3 class="practice-title">Nuxt x Solidity</h3>

    <div style="padding: 30px;"> 
      <el-button @click="visible = true">ボタン</el-button>
      <el-dialog :visible.sync="visible" title="確認">
        <p>処理されました</p>
      </el-dialog>  
    </div>
    <div style="padding: 30px;">
      <p> account: {{ account }}</p>
      <p> private key: {{ pk }}</p>
      <ul>
        <li v-for="todo in todos">
          <input type="checkbox" :checked="todo.completed" @change="toggle(todo)">
          <span :class="{ completed: todo.completed }">{{ todo.content }}</span>
        </li>
      </ul>  
      <input placeholder="タスクを追加" @keyup.enter="addTodo">
    </div>  
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import sendTx from "~/plugins/sendTx.js"

export default {
  data: function() {
    return {
      visible: false
    }
  },
  computed: {
    account () {
      return this.$store.state.user.etherAddress;
    },
    pk () {
      return this.$store.state.user.pk;
    },
    todos () {
      return this.$store.state.todosChain.listChain;
    }
  },
  methods: {
    ...mapActions({
      //addTodoChain: "todosChain/addTodoChain"
      getTodoChain: "todosChain/getTodoChain"
    }),
    async addTodo(e) {
      //this.addTodoChain(e.target.value, account, pk )
      // const account = await this.$store.state.user.etherAddress
      // const pk = await this.$store.state.user.pk
      // const funcionAbi = await this.$contract.methods.createTask(e.target.value).encodeABI()
      // let result = await sendTx(this, account, pk, funcionAbi)
      // const sample = await this.$web3.utils.toAscii("0x7508143378688c24a90e10589026b9caee42ff9ab9aef81f81001478653b5613")
      const sample = await this.$flibraContract.methods.getNumberOfItem().call()
      console.log(sample)
    }
  },
  async mounted() {
    await this.getTodoChain()
  }
}

</script>

<style scoped>
.practice-title {
  margin: 10px;
}
</style>

import sendTx from "~/plugins/sendTx.js"

export const state = () => ({
  listChain: [],
  account: '',
  privateKey: '',
})

export const mutations = {
  setAccount(state, account) {
    state.account = account;
  },
  setPrivateKey(state, privateKey) {
    state.privateKey = privateKey;
  },
  setTodoList(state, task) {
    state.listChain.push(task)
  }
};

export const actions = {
  async addTodoChain(text, account, pk) {
    console.log(this.state.account)
    const funcionAbi = await this.$contract.methods.createTask(text).encodeABI()
    let result = await sendTx(funcionAbi, account, pk)
  },
  async getTodoChain({commit, state}) {
    const numberOfTasks = await this.$contract.methods.taskCount.call()
    for (let i = 1; i <= numberOfTasks; i++) {
      let task = await this.$contract.methods.tasks(i).call()
      console.log(task)
      commit('setTodoList', task)
    }
  }
}
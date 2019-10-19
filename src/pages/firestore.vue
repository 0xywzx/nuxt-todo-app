<template>
  <div class="container">
     <table class="table is-narrow">
       <tbody>
         <tr>
           <th>todo</th>
           <th>limit</th>
         </tr>
       </tbody>
       <tbody>
         <tr v-for="(todo, index) in todos" :key="index">
           <td>{{todo.todo}}</td>
           <td>{{todo.limit}}</td>
         </tr>
       </tbody>
     </table>
     <div class="field is-grouped">
      <p class="control is-expanded">
        <input v-model="newTodo" class="input" type="text" placeholder="todo">
      </p>
      <p class="control is-expanded">
        <input v-model="newLimit" class="input" type="text" placeholder="limit">
      </p>
      <p class="control">
        <a class="button is-primary" @click="addTodo">
          add
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firestore'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      newTodo: '',
      newLimit: ''
    }
  },
  computed: {
    ...mapGetters({ todos: 'firestoreItem/getTodos' })
  },
  methods: {
    // ...mapActions({
    //   getOnSaleItems: "item/getOnSaleItems"
    // }),
    addTodo() {
      const todo = this.newTodo
      const limit = this.newLimit
      
      this.$store.dispatch('firestoreItem/addTodo', {todo, limit})
      this.newTodo = ''
      this.newLimit = ''
    },
  },
  async created() {
    this.$store.dispatch('firestoreItem/setTodosRef')
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}
</style>
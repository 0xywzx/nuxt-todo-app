import firebase from '~/plugins/firestore'
const db = firebase.firestore();
const todoRef = db.collection('todos')


export const state = () => ({
  userUid: '',
  userName: '', 
  todos: []
})

export const mutations = {
  setUserUid(state,userUid) {
    state.userUid = userUid
  },
  setUserName(state,userName) {
    state.userName = userName
  },
  addTodo(state, todo) {
    state.todos.push(todo)
  }
}

export const actions = {
  fetchTodos({ commit }) {
    todoRef
    .get()
    .then(res => {
      res.forEach((doc) => {
        console.log('success : ' + `${doc.id} => ${doc.data()}`);
        commit('addTodo', doc.data())
      })
    })
    .catch(error => {
      console.log('error : ' + error)
    })
  },
  addTodo({commit}, todo) {
    console.log(todo)
    todoRef
    .add({
      todo: todo.todo,
      limit: todo.limit,
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      commit('addTodo', todo)
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }  
}

export const getters = {
  getTodos(state) {
    return state.todos
  }
}
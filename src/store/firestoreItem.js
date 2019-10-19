import db from '~/plugins/firestore.js'
import {vuexfireMutations, firestoreAction } from 'vuexfire';

const todoRef = db.collection('todos')


export const state = () => ({
  todos: []
})

export const mutations = {

}

export const actions = {
  setTodosRef: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('todos', todoRef)
  })
}

export const getters = {
  getTodos: state => {
    return state.todos
  }
}
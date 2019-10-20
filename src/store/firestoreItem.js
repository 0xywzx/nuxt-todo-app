import firebase from '~/plugins/firebase.js'
import {vuexfireMutations, firestoreAction } from 'vuexfire';
import 'firebase/firestore'

const db = firebase.firestore()
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
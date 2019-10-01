export const state = () => ({
  list: []
})

export const mutations = {
  add (state, text) {
    state.list.push({
      text: text,
      doen: false
    })
  },
  toggle (state, todo) {
    todo.done = !todo.done
  }
}
<template>
  <header>
    <nav>
      <ul>
        <li><nuxt-link to="/"></nuxt-link></li>
        <li><nuxt-link to="/practice">Practice</nuxt-link></li>
        <li><nuxt-link to="/todo">Todo</nuxt-link></li>
        <li><nuxt-link to="/recipes">Recipes</nuxt-link></li>
        <li><nuxt-link to="/createWallet">Create Wallet</nuxt-link></li>
        <li><nuxt-link to="/login">Log in</nuxt-link></li>
        <li><nuxt-link to="/user">My Page</nuxt-link></li>
        <li><nuxt-link to="/itemPost">Item Post</nuxt-link></li>
        <li><nuxt-link to="/itemList">Item List</nuxt-link></li>
        <li><nuxt-link to="/user">Item Edit</nuxt-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: blue;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 10px;
}

a {
  text-decoration: none;
  color: white;
}
</style>
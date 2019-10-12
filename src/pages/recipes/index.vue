<template>
  <section class="recipes">
    <Recipe
      v-for="recipe in recipes"
      :key="recipe.id"
      :thumbnail="recipe.thumbnail"
      :id="recipe.id"
      :title="recipe.title"
      :previewText="recipe.previewText" />
  </section>  
</template>

<script>
import Recipe from '@/components/Recipe'
export default {
  components: {
    Recipe
  },
  asyncData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          recipes: [
            {
              thumbnail: "https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg",
              id: "1",
              title: "ハンバーガー",
              previewText: "Grest",
            },
            {
              thumbnail: "https://upload.wikimedia.org/wikipedia/commons/8/88/Karint%C5%8D_001.jpg",
              id: "2",
              title: "かりんとう",
              previewText: "うまい！！！",
            }
          ]
        })
      }, 1500)
    })
  }
}
</script>
<style scoped>
.recipes {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}

</style>
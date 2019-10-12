<template>
  <section class="single-receipe">
    <h1> {{ recipe.title }} </h1>
    <div>
      <img class="recipe-image" :src="recipe.thumbnail" :alt="recipe.title">
    </div>
    <p>The recipe description.</p>
  </section>  
</template>

<script>
export default {
  asyncData(context) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          recipe: [
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
          ].find(el => el.id === context.params.id)
        })
      }, 1500)
    })
  }
}
</script>

<style scoped>
.single-receipe {
  display : flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px;
}

.recipe-image {
  width: 100%;
  height: 400px;
}
</style>
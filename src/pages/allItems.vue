<template>
  <div>
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    <h2 class="title-text">全てのアイテム</h2>
    <div class="my-item-list" v-if="allItems.length > 0" >
      <div class="item-list" v-for="item in allItems">
        <P>{{ item.id }}</P>
        <p>{{ item.itemDetailContract }}</p>
      </div>
    </div>
  </div>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex'


export default {
  components: {

  },
  data: function() {
    return {

    }
  },
  computed: {
    allItems () {
      return this.$store.state.item.allItems;
    },
  },
  methods: {
    ...mapActions({
      getAllItems: "item/getAllItems",
    }),
  },
  async created() {
    await this.getAllItems(this)
  },
  async asyncData({app, store, commit}) {

  }
}

</script>

<style scoped>
.title-text {
  clear: both;
  text-align: center;
}

</style>

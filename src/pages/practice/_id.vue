<template>
  <div>
    <h2>IDをパラメーターで受け取る。</h2>
    <p>{{ $route.params.id }}を受け取りました。</p>
  </div>
</template>

<script>
export default {
  validate({ params }) {
    return /^\d+$/.test(params.id)
  }
}
</script>
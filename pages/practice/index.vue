<template>
  <div>
    <img src="~/assets/img/Libra-Freemarket-icon.png">
    <h3>Vueの練習</h3>

    <div style="padding: 30px;"> 
      <el-button @click="visible = true">ボタン</el-button>
      <el-dialog :visible.sync="visible" title="確認">
        <p>処理されました</p>
      </el-dialog>  
    </div>  
  </div>  
</template>

<script>
export default {
  data: function() {
    return {
      visible: false
    }
  }
}
</script>

<template>
  <div class="jetbrains-page">
    <AppHeader />
    <div class="jetbrains-container">
      <iframe src="/jetbrains/index.html" frameborder="0" class="jetbrains-iframe"></iframe>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
</script>

<style scoped>
.jetbrains-page {
  min-height: 100vh;
  background: #fff;
}

.jetbrains-container {
  width: 100%;
  height: calc(100vh - 64px);
  overflow: hidden;
}

.jetbrains-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>

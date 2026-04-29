<template>
  <div class="jetbrains-page">
    <AppHeader />
    <div class="jetbrains-container">
      <h1 class="sr-only">JetBrains IDE 激活 - IntelliJ IDEA、PyCharm、WebStorm 等全系激活</h1>
      <iframe 
        src="/jetbrains/index.html" 
        frameborder="0" 
        class="jetbrains-iframe"
        sandbox="allow-scripts allow-downloads allow-popups"
      ></iframe>
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
  background: #fff;
}
</style>

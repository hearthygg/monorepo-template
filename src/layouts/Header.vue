<template>
  <header class="header">
    <div class="logo">My App</div>
    <nav class="nav">
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #35495e;
  color: #fff;
}

.logo {
  font-size: 1.5em;
}

.nav a {
  margin-left: 20px;
  color: #fff;
  text-decoration: none;
}
</style>

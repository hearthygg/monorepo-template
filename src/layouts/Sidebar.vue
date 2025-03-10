<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li><a href="/">Dashboard</a></li>
        <li><a href="/users">Users</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #2c3e50;
  color: #fff;
  padding: 20px;
}

.sidebar a {
  color: #fff;
  text-decoration: none;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
}
</style>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav style="padding: 20px; text-align: center;">
      <RouterLink to="/login">Login</RouterLink> | 
      <RouterLink to="/register">Registro</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style>
/* Reset básico para que se vea limpio */
body { margin: 0; font-family: sans-serif; background-color: #f4f4f4; }
</style>

<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1>Биомеханика в ортодонтии</h1>
        <p class="subtitle">Интерактивная обучающая система</p>
        <p class="author">По методологии проф. Попова Сергея Александровича</p>
      </div>
    </header>

    <nav class="app-navigation">
      <router-link to="/" class="nav-link">Главная</router-link>
      <router-link to="/theory" class="nav-link">Теория</router-link>
      <router-link to="/calculator" class="nav-link">Калькулятор</router-link>
      <router-link to="/simulator" class="nav-link">Симулятор</router-link>
      <router-link to="/cases" class="nav-link">Клинические случаи</router-link>
    </nav>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>&copy; 2025 Обучающая система по биомеханике в ортодонтии</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Orthodontics Biomechanics App initialized')
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #667eea;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.author {
  color: #7f8c8d;
  font-size: 0.95rem;
  font-style: italic;
}

.app-navigation {
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #2c3e50;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: #764ba2;
  color: white;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  padding: 1.5rem;
  color: #7f8c8d;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}
</style>

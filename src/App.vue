<template>
  <div id="app" class="app-container" :class="{ 'dark-theme': isDarkTheme }">
    <header class="app-header">
      <div class="header-content">
        <h1>Биомеханика в ортодонтии</h1>
        <p class="subtitle">Интерактивная обучающая система</p>
        <p class="author">По методологии проф. Попова Сергея Александровича</p>
      </div>
      <button @click="toggleTheme" class="theme-toggle" :title="isDarkTheme ? 'Светлая тема' : 'Темная тема'">
        <span class="theme-icon">{{ isDarkTheme ? '☀️' : '🌙' }}</span>
      </button>
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
import { onMounted, ref, watch } from 'vue'

const isDarkTheme = ref(false)

// Загрузка темы из localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDarkTheme.value = savedTheme === 'dark'
  console.log('Orthodontics Biomechanics App initialized')
})

// Переключение темы
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
}

// Отслеживание изменения темы для применения к body
watch(isDarkTheme, (newValue) => {
  if (newValue) {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}, { immediate: true })
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
  transition: background 0.4s ease, color 0.4s ease;
}

body.dark-theme {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
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
  position: relative;
  transition: background 0.4s ease, box-shadow 0.4s ease;
}

.dark-theme .app-header {
  background: rgba(26, 26, 46, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(102, 126, 234, 0.2);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.theme-toggle:hover {
  transform: rotate(180deg) scale(1.1);
  background: rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.theme-icon {
  font-size: 1.5rem;
  display: block;
  transition: transform 0.4s ease;
}

.theme-toggle:active .theme-icon {
  transform: scale(0.9);
}

.app-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  transition: color 0.4s ease;
}

.dark-theme .app-header h1 {
  color: #e0e0e0;
}

.subtitle {
  color: #667eea;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  transition: color 0.4s ease;
}

.dark-theme .subtitle {
  color: #9fa8da;
}

.author {
  color: #7f8c8d;
  font-size: 0.95rem;
  font-style: italic;
  transition: color 0.4s ease;
}

.dark-theme .author {
  color: #b0b0b0;
}

.app-navigation {
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  transition: background 0.4s ease, box-shadow 0.4s ease;
}

.dark-theme .app-navigation {
  background: rgba(26, 26, 46, 0.9);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.nav-link {
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #2c3e50;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.dark-theme .nav-link {
  color: #e0e0e0;
}

.nav-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.dark-theme .nav-link:hover {
  background: #7c8ff0;
}

.nav-link.router-link-active {
  background: #764ba2;
  color: white;
}

.dark-theme .nav-link.router-link-active {
  background: #8e5bb8;
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
  transition: background 0.4s ease, box-shadow 0.4s ease, color 0.4s ease;
}

.dark-theme .app-footer {
  background: rgba(26, 26, 46, 0.9);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  color: #b0b0b0;
}
</style>

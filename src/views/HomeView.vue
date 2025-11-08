<template>
  <div class="home-view">
    <section class="hero">
      <h2>Добро пожаловать в обучающую систему</h2>
      <p class="lead">Изучайте биомеханику ортодонтического лечения интерактивно</p>
    </section>

    <div class="grid grid-2">
      <div class="card feature-card">
        <div class="icon">📚</div>
        <h3>Теоретическая база</h3>
        <p>Фундаментальные принципы биомеханики по методологии проф. Попова С.А.</p>
        <router-link to="/theory" class="btn btn-primary">Изучить теорию</router-link>
      </div>

      <div class="card feature-card">
        <div class="icon">🧮</div>
        <h3>Биомеханические расчеты</h3>
        <p>Калькулятор для расчета сил, моментов и перемещений зубов</p>
        <router-link to="/calculator" class="btn btn-primary">Открыть калькулятор</router-link>
      </div>

      <div class="card feature-card">
        <div class="icon">🔬</div>
        <h3>Интерактивный симулятор</h3>
        <p>Визуализация и моделирование ортодонтических перемещений</p>
        <router-link to="/simulator" class="btn btn-primary">Запустить симулятор</router-link>
      </div>

      <div class="card feature-card">
        <div class="icon">🏥</div>
        <h3>Клинические случаи</h3>
        <p>Разбор реальных клинических ситуаций с биомеханическим анализом</p>
        <router-link to="/cases" class="btn btn-primary">Смотреть случаи</router-link>
      </div>
    </div>

    <section class="info-section">
      <div class="card">
        <h3>Основные разделы биомеханики</h3>
        <div class="topics-grid">
          <div class="topic-item">
            <strong>Центр сопротивления</strong>
            <p>Точка приложения равнодействующей силы</p>
          </div>
          <div class="topic-item">
            <strong>Система сил</strong>
            <p>Силы и моменты в ортодонтии</p>
          </div>
          <div class="topic-item">
            <strong>Типы перемещений</strong>
            <p>Наклонно-вращательное, корпусное, торковое</p>
          </div>
          <div class="topic-item">
            <strong>Биомеханика дуги</strong>
            <p>Свойства ортодонтических дуг и их применение</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Home view mounted')
})
</script>

<style scoped>
.home-view {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.hero h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.3rem;
  color: #667eea;
  font-weight: 500;
}

.feature-card {
  text-align: center;
  padding: 2rem;
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-card p {
  margin-bottom: 1.5rem;
  min-height: 60px;
}

.feature-card .btn {
  width: 100%;
}

.info-section {
  margin-top: 2rem;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.topic-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.topic-item strong {
  color: #2c3e50;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.topic-item p {
  color: #666;
  font-size: 0.95rem;
}
</style>

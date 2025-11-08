<template>
  <div class="theory-view">
    <h2>Теоретические основы биомеханики</h2>

    <div class="theory-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.title }}
      </button>
    </div>

    <div class="theory-content">
      <div v-show="activeTab === 'cr'" class="card theory-section">
        <h3>Центр сопротивления (ЦС)</h3>
        <div class="content-block">
          <p><strong>Определение:</strong> Центр сопротивления — это точка, через которую должна проходить равнодействующая сила для корпусного перемещения зуба без вращения.</p>

          <div class="highlight-box">
            <h4>Локализация ЦС:</h4>
            <ul>
              <li><strong>Однокорневые зубы:</strong> На 1/3 расстояния от апекса корня до альвеолярного гребня</li>
              <li><strong>Многокорневые зубы:</strong> В области бифуркации корней</li>
              <li><strong>При резорбции кости:</strong> ЦС смещается апикально</li>
            </ul>
          </div>

          <div class="formula-box">
            <p><strong>Расстояние от вершины альвеолярного гребня:</strong></p>
            <code>h<sub>цс</sub> = L / 3</code>
            <p class="formula-note">где L — длина корня зуба</p>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'forces'" class="card theory-section">
        <h3>Система сил в ортодонтии</h3>
        <div class="content-block">
          <h4>Типы сил:</h4>

          <div class="force-types">
            <div class="force-card">
              <h5>🔵 Одиночная сила</h5>
              <p>Вызывает наклонно-вращательное перемещение относительно ЦС</p>
              <div class="formula-box">
                <code>F = m × a</code>
              </div>
            </div>

            <div class="force-card">
              <h5>🔄 Момент пары сил</h5>
              <p>Вызывает чистое вращение зуба вокруг ЦС</p>
              <div class="formula-box">
                <code>M = F × d</code>
                <p class="formula-note">d — плечо силы</p>
              </div>
            </div>

            <div class="force-card">
              <h5>⚖️ Комбинированная система</h5>
              <p>Сила + момент = различные типы перемещений</p>
            </div>
          </div>

          <div class="highlight-box">
            <h4>Соотношение момент/сила (M/F):</h4>
            <ul>
              <li><strong>M/F = 0:</strong> Наклонно-вращательное перемещение</li>
              <li><strong>M/F = 7:1 (для однокорневых):</strong> Корпусное перемещение</li>
              <li><strong>M/F = 10:1:</strong> Корневое перемещение (торк)</li>
              <li><strong>M/F = 12:1:</strong> Выраженное корневое перемещение</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'movements'" class="card theory-section">
        <h3>Типы ортодонтических перемещений</h3>
        <div class="content-block">
          <div class="movement-types">
            <div class="movement-card">
              <h5>1. Наклонно-вращательное перемещение</h5>
              <p><strong>Характеристика:</strong> Коронка перемещается больше, чем корень</p>
              <p><strong>Система сил:</strong> Одиночная сила</p>
              <p><strong>M/F:</strong> 0</p>
              <div class="clinical-note">
                Наиболее распространенный тип при использовании съемной аппаратуры
              </div>
            </div>

            <div class="movement-card">
              <h5>2. Корпусное перемещение</h5>
              <p><strong>Характеристика:</strong> Коронка и корень перемещаются одинаково</p>
              <p><strong>Система сил:</strong> Сила + компенсирующий момент</p>
              <p><strong>M/F:</strong> 7-8:1 (однокорневые), 10-12:1 (многокорневые)</p>
              <div class="clinical-note">
                Используется при закрытии промежутков, ретракции фронтальных зубов
              </div>
            </div>

            <div class="movement-card">
              <h5>3. Корневое перемещение (торк)</h5>
              <p><strong>Характеристика:</strong> Корень перемещается больше, чем коронка</p>
              <p><strong>Система сил:</strong> Большой компенсирующий момент</p>
              <p><strong>M/F:</strong> 10-12:1</p>
              <div class="clinical-note">
                Применяется для коррекции инклинации резцов
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'archwire'" class="card theory-section">
        <h3>Биомеханика ортодонтической дуги</h3>
        <div class="content-block">
          <h4>Свойства материалов дуг:</h4>

          <div class="wire-comparison">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Материал</th>
                  <th>Модуль упругости</th>
                  <th>Упругость</th>
                  <th>Применение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Нержавеющая сталь</strong></td>
                  <td>Высокий</td>
                  <td>Низкая</td>
                  <td>Финальные этапы, требующие жесткости</td>
                </tr>
                <tr>
                  <td><strong>NiTi (Никель-титан)</strong></td>
                  <td>Средний</td>
                  <td>Высокая</td>
                  <td>Начальное выравнивание, эффект памяти формы</td>
                </tr>
                <tr>
                  <td><strong>TMA (β-титан)</strong></td>
                  <td>Низкий</td>
                  <td>Очень высокая</td>
                  <td>Создание петель, пружин</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="highlight-box">
            <h4>Факторы, влияющие на силу дуги:</h4>
            <ul>
              <li><strong>Диаметр дуги:</strong> Сила пропорциональна 4-й степени диаметра (d⁴)</li>
              <li><strong>Длина активной части:</strong> Обратно пропорциональна 3-й степени длины (1/L³)</li>
              <li><strong>Материал:</strong> Модуль упругости материала</li>
            </ul>
            <div class="formula-box">
              <code>F = (3 × E × I × δ) / L³</code>
              <p class="formula-note">
                E — модуль упругости, I — момент инерции, δ — деформация, L — длина
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'popov'" class="card theory-section">
        <h3>Методология проф. Попова С.А.</h3>
        <div class="content-block">
          <div class="highlight-box special">
            <h4>Ключевые принципы:</h4>

            <div class="principle-item">
              <h5>1. Индивидуальный биомеханический подход</h5>
              <p>Учет анатомических особенностей каждого пациента при планировании лечения</p>
            </div>

            <div class="principle-item">
              <h5>2. Оптимизация системы сил</h5>
              <p>Использование минимальных физиологичных сил для достижения максимального терапевтического эффекта</p>
            </div>

            <div class="principle-item">
              <h5>3. Контроль опорных зубов</h5>
              <p>Расчет и предотвращение нежелательных перемещений опорных зубов</p>
            </div>

            <div class="principle-item">
              <h5>4. Трехмерный анализ перемещений</h5>
              <p>Планирование перемещений во всех трех плоскостях пространства</p>
            </div>
          </div>

          <div class="methodology-details">
            <h4>Практическое применение:</h4>
            <ul>
              <li>Точный расчет положения ЦС для каждого зуба</li>
              <li>Определение оптимальных значений M/F для каждого типа перемещения</li>
              <li>Выбор правильных параметров дуг и элементов механики</li>
              <li>Прогнозирование результатов лечения на основе биомеханических законов</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Tab {
  id: string
  title: string
}

const tabs: Tab[] = [
  { id: 'cr', title: 'Центр сопротивления' },
  { id: 'forces', title: 'Система сил' },
  { id: 'movements', title: 'Типы перемещений' },
  { id: 'archwire', title: 'Биомеханика дуги' },
  { id: 'popov', title: 'Методология Попова' }
]

const activeTab = ref('cr')
</script>

<style scoped>
.theory-view {
  animation: fadeIn 0.5s ease-in;
}

.theory-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #2c3e50;
}

.tab-button:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.theory-section {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.content-block {
  line-height: 1.8;
}

.highlight-box {
  background: #f0f4ff;
  border-left: 4px solid #667eea;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 8px;
}

.highlight-box.special {
  background: linear-gradient(135deg, #f0f4ff 0%, #fef0ff 100%);
  border-left: 4px solid #764ba2;
}

.highlight-box h4 {
  color: #667eea;
  margin-bottom: 1rem;
}

.highlight-box ul {
  list-style-position: inside;
  margin-left: 0;
}

.highlight-box li {
  margin: 0.5rem 0;
}

.formula-box {
  background: #fff9e6;
  border: 2px dashed #ffc107;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  text-align: center;
}

.formula-box code {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  font-family: 'Courier New', monospace;
}

.formula-note {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
  font-style: italic;
}

.force-types,
.movement-types {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.force-card,
.movement-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.force-card h5,
.movement-card h5 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}

.clinical-note {
  background: #e8f5e9;
  padding: 0.75rem;
  margin-top: 1rem;
  border-radius: 6px;
  border-left: 3px solid #4caf50;
  font-style: italic;
  color: #2e7d32;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.comparison-table th,
.comparison-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.comparison-table th {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.comparison-table tr:hover {
  background: #f8f9fa;
}

.principle-item {
  margin: 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.principle-item:last-child {
  border-bottom: none;
}

.principle-item h5 {
  color: #764ba2;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.methodology-details {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.methodology-details h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.methodology-details ul {
  list-style-position: inside;
}

.methodology-details li {
  margin: 0.75rem 0;
  padding-left: 1rem;
}
</style>

<template>
  <div class="simulator-view">
    <h2>Интерактивный биомеханический симулятор</h2>
    <p class="subtitle">Визуализация ортодонтических перемещений зубов</p>

    <div class="simulator-layout">
      <!-- Панель управления -->
      <div class="card controls-panel">
        <h3>Параметры симуляции</h3>

        <div class="input-group">
          <label>Тип зуба:</label>
          <select v-model="params.toothType">
            <option value="incisor">Резец</option>
            <option value="canine">Клык</option>
            <option value="premolar">Премоляр</option>
            <option value="molar">Моляр</option>
          </select>
        </div>

        <div class="input-group">
          <label>Тип перемещения:</label>
          <select v-model="params.movementType" @change="updateForceParams">
            <option value="tipping">Наклонно-вращательное</option>
            <option value="bodily">Корпусное</option>
            <option value="root">Корневое (торк)</option>
            <option value="rotation">Ротация</option>
            <option value="intrusion">Интрузия</option>
            <option value="extrusion">Экструзия</option>
          </select>
        </div>

        <div class="input-group">
          <label>Сила (г): {{ params.force }}</label>
          <input
            type="range"
            v-model.number="params.force"
            :min="forceRange.min"
            :max="forceRange.max"
            step="5"
          />
          <div class="range-labels">
            <span>{{ forceRange.min }}</span>
            <span class="optimal-mark">Оптимально: {{ forceRange.optimal }}</span>
            <span>{{ forceRange.max }}</span>
          </div>
        </div>

        <div v-if="params.movementType !== 'tipping'" class="input-group">
          <label>M/F соотношение: {{ mfRatio }}</label>
          <input
            type="range"
            v-model.number="mfRatio"
            min="0"
            max="15"
            step="0.5"
          />
        </div>

        <div class="input-group">
          <label>Длина корня (мм): {{ params.rootLength }}</label>
          <input
            type="range"
            v-model.number="params.rootLength"
            min="8"
            max="18"
            step="0.5"
          />
        </div>

        <div class="input-group">
          <label>Время воздействия (дни): {{ params.duration }}</label>
          <input
            type="range"
            v-model.number="params.duration"
            min="1"
            max="90"
            step="1"
          />
        </div>

        <button @click="runSimulation" class="btn btn-primary">
          🎬 Запустить симуляцию
        </button>

        <button @click="resetSimulation" class="btn btn-secondary">
          🔄 Сбросить
        </button>
      </div>

      <!-- Область визуализации -->
      <div class="card visualization-panel">
        <h3>Визуализация</h3>
        <div class="tooth-canvas">
          <svg width="100%" height="500" viewBox="0 0 400 500">
            <!-- Альвеолярная кость -->
            <rect x="50" y="250" width="300" height="200" fill="#f5deb3" opacity="0.3" />
            <text x="200" y="470" text-anchor="middle" font-size="12" fill="#999">
              Альвеолярная кость
            </text>

            <!-- Зуб (корень) -->
            <path
              :d="toothRootPath"
              :fill="toothColor"
              :transform="toothTransform"
              stroke="#333"
              stroke-width="2"
            />

            <!-- Зуб (коронка) -->
            <path
              :d="toothCrownPath"
              :fill="toothColor"
              :transform="toothTransform"
              stroke="#333"
              stroke-width="2"
            />

            <!-- Центр сопротивления -->
            <circle
              :cx="crPosition.x"
              :cy="crPosition.y"
              r="6"
              fill="red"
              :transform="toothTransform"
            />
            <text
              :x="crPosition.x + 15"
              :y="crPosition.y"
              font-size="12"
              fill="red"
              :transform="toothTransform"
            >
              ЦС
            </text>

            <!-- Вектор силы -->
            <line
              v-if="isSimulating"
              :x1="forceVector.x1"
              :y1="forceVector.y1"
              :x2="forceVector.x2"
              :y2="forceVector.y2"
              stroke="blue"
              stroke-width="3"
              marker-end="url(#arrowhead)"
            />

            <!-- Момент (если есть) -->
            <path
              v-if="isSimulating && mfRatio > 0"
              :d="momentArc"
              fill="none"
              stroke="green"
              stroke-width="2"
              marker-end="url(#arrowhead-green)"
            />

            <!-- Определения для стрелок -->
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="blue" />
              </marker>
              <marker
                id="arrowhead-green"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="green" />
              </marker>
            </defs>

            <!-- Сетка координат -->
            <line x1="200" y1="0" x2="200" y2="500" stroke="#ddd" stroke-dasharray="5,5" />
            <line x1="0" y1="250" x2="400" y2="250" stroke="#ddd" stroke-dasharray="5,5" />
          </svg>
        </div>

        <!-- Легенда -->
        <div class="legend">
          <div class="legend-item">
            <div class="legend-color" style="background: red"></div>
            <span>Центр сопротивления (ЦС)</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: blue"></div>
            <span>Вектор силы</span>
          </div>
          <div class="legend-item" v-if="mfRatio > 0">
            <div class="legend-color" style="background: green"></div>
            <span>Момент пары сил</span>
          </div>
        </div>
      </div>

      <!-- Результаты симуляции -->
      <div class="card results-panel">
        <h3>Результаты симуляции</h3>

        <div v-if="simulationResults" class="results-content">
          <div class="result-item">
            <strong>Тип перемещения:</strong>
            <p>{{ getMovementTypeName(params.movementType) }}</p>
          </div>

          <div class="result-item">
            <strong>Приложенная сила:</strong>
            <p>{{ params.force }} г</p>
          </div>

          <div class="result-item">
            <strong>Момент:</strong>
            <p>{{ (params.force * mfRatio).toFixed(2) }} г·мм</p>
          </div>

          <div class="result-item">
            <strong>M/F соотношение:</strong>
            <p>{{ mfRatio }}:1</p>
          </div>

          <div class="result-item">
            <strong>Положение ЦС:</strong>
            <p>{{ simulationResults.crDistance.toFixed(2) }} мм от альвеолярного гребня</p>
          </div>

          <div class="result-item">
            <strong>Прогнозируемое смещение коронки:</strong>
            <p>{{ simulationResults.crownDisplacement.toFixed(3) }} мм за {{ params.duration }} дней</p>
          </div>

          <div class="result-item">
            <strong>Прогнозируемое смещение корня:</strong>
            <p>{{ simulationResults.rootDisplacement.toFixed(3) }} мм за {{ params.duration }} дней</p>
          </div>

          <div class="result-item assessment">
            <strong>Оценка параметров:</strong>
            <p :class="simulationResults.assessmentClass">
              {{ simulationResults.assessment }}
            </p>
          </div>

          <div class="clinical-recommendations">
            <h4>Клинические рекомендации:</h4>
            <ul>
              <li v-for="(rec, index) in simulationResults.recommendations" :key="index">
                {{ rec }}
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="placeholder">
          <p>Настройте параметры и запустите симуляцию</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { calculateCenterOfResistance, calculateOptimalForce } from '@/utils/biomechanics'

const params = reactive({
  toothType: 'incisor' as 'incisor' | 'canine' | 'premolar' | 'molar',
  movementType: 'bodily' as 'tipping' | 'bodily' | 'root' | 'rotation' | 'intrusion' | 'extrusion',
  force: 75,
  rootLength: 13,
  duration: 30
})

const mfRatio = ref(7)
const isSimulating = ref(false)
const simulationResults = ref<any>(null)

// Динамический диапазон силы
const forceRange = computed(() => {
  return calculateOptimalForce(params.toothType, params.movementType)
})

// Обновление параметров при изменении типа перемещения
const updateForceParams = () => {
  const optimalForce = calculateOptimalForce(params.toothType, params.movementType)
  params.force = optimalForce.optimal

  // Установка оптимального M/F
  if (params.movementType === 'tipping') {
    mfRatio.value = 0
  } else if (params.movementType === 'bodily') {
    mfRatio.value = 7
  } else if (params.movementType === 'root') {
    mfRatio.value = 10
  } else {
    mfRatio.value = 5
  }
}

// Позиция центра сопротивления
const crPosition = computed(() => {
  const cr = calculateCenterOfResistance('single', params.rootLength, 0)
  return {
    x: 200,
    y: 250 + cr.distance * 10 // масштабирование для отображения
  }
})

// Путь зуба (корень)
const toothRootPath = computed(() => {
  const width = 20
  const height = params.rootLength * 10
  return `M ${200 - width/2} 250 L ${200 - width/2} ${250 + height} L ${200} ${250 + height + 10} L ${200 + width/2} ${250 + height} L ${200 + width/2} 250 Z`
})

// Путь зуба (коронка)
const toothCrownPath = computed(() => {
  const width = 30
  const height = 40
  return `M ${200 - width/2} ${250 - height} L ${200 - width/2} 250 L ${200 + width/2} 250 L ${200 + width/2} ${250 - height} Z`
})

// Цвет зуба
const toothColor = computed(() => {
  return isSimulating.value ? '#e8f4f8' : '#f0f0f0'
})

// Трансформация зуба (для анимации перемещения)
const toothTransform = computed(() => {
  if (!isSimulating.value || !simulationResults.value) return ''

  const crownMove = simulationResults.value.crownDisplacement * 50 // масштаб
  const rootMove = simulationResults.value.rootDisplacement * 50

  const avgMove = (crownMove + rootMove) / 2
  const rotation = (crownMove - rootMove) * 2

  return `translate(${avgMove}, 0) rotate(${rotation}, 200, ${crPosition.value.y})`
})

// Вектор силы
const forceVector = computed(() => {
  return {
    x1: 200,
    y1: 210, // точка приложения на коронке
    x2: 200 - params.force / 2,
    y2: 210
  }
})

// Дуга момента
const momentArc = computed(() => {
  const cx = crPosition.value.x
  const cy = crPosition.value.y
  const radius = 40
  return `M ${cx + radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius}`
})

// Запуск симуляции
const runSimulation = () => {
  isSimulating.value = true

  const cr = calculateCenterOfResistance('single', params.rootLength, 0)

  // Упрощенная модель перемещения
  // Скорость перемещения зависит от силы (примерно 1 мм/месяц при оптимальной силе)
  const baseRate = 0.033 // мм/день при оптимальной силе

  let crownDisplacement = 0
  let rootDisplacement = 0

  const optimalForce = forceRange.value.optimal
  const forceRatio = params.force / optimalForce

  if (params.movementType === 'tipping') {
    // Наклонно-вращательное: коронка двигается больше
    crownDisplacement = baseRate * forceRatio * params.duration
    rootDisplacement = crownDisplacement * 0.2
  } else if (params.movementType === 'bodily') {
    // Корпусное: одинаковое перемещение
    crownDisplacement = baseRate * forceRatio * params.duration * 0.8
    rootDisplacement = crownDisplacement
  } else if (params.movementType === 'root') {
    // Корневое: корень больше
    rootDisplacement = baseRate * forceRatio * params.duration * 0.7
    crownDisplacement = rootDisplacement * 0.3
  } else if (params.movementType === 'intrusion') {
    // Интрузия: вертикальное перемещение
    crownDisplacement = baseRate * 0.5 * forceRatio * params.duration
    rootDisplacement = crownDisplacement
  } else if (params.movementType === 'extrusion') {
    // Экструзия: вертикальное перемещение
    crownDisplacement = baseRate * 1.5 * forceRatio * params.duration
    rootDisplacement = crownDisplacement
  } else {
    // Ротация
    crownDisplacement = baseRate * 0.8 * forceRatio * params.duration
    rootDisplacement = crownDisplacement * 0.5
  }

  // Оценка параметров
  let assessment = ''
  let assessmentClass = ''
  const recommendations: string[] = []

  if (params.force < forceRange.value.min) {
    assessment = 'Сила слишком мала для эффективного перемещения'
    assessmentClass = 'warning'
    recommendations.push('Увеличьте силу до оптимального диапазона')
  } else if (params.force > forceRange.value.max) {
    assessment = 'Чрезмерная сила! Риск резорбции корня и дискомфорта'
    assessmentClass = 'danger'
    recommendations.push('Уменьшите силу до безопасного диапазона')
    recommendations.push('Контролируйте состояние пародонта')
  } else {
    assessment = 'Оптимальные параметры для физиологичного перемещения'
    assessmentClass = 'optimal'
    recommendations.push('Параметры находятся в оптимальном диапазоне')
  }

  // Проверка M/F соотношения
  if (params.movementType === 'bodily' && Math.abs(mfRatio.value - 7) > 2) {
    recommendations.push('Для корпусного перемещения рекомендуется M/F = 7-8:1')
  }

  if (params.duration < 14) {
    recommendations.push('Короткий период воздействия - результат может быть минимальным')
  }

  recommendations.push('Регулярно контролируйте процесс перемещения')
  recommendations.push('При появлении дискомфорта у пациента снизьте силу')

  simulationResults.value = {
    crDistance: cr.distance,
    crownDisplacement,
    rootDisplacement,
    assessment,
    assessmentClass,
    recommendations
  }
}

const resetSimulation = () => {
  isSimulating.value = false
  simulationResults.value = null
}

const getMovementTypeName = (type: string) => {
  const names: Record<string, string> = {
    tipping: 'Наклонно-вращательное перемещение',
    bodily: 'Корпусное перемещение',
    root: 'Корневое перемещение (торк)',
    rotation: 'Ротация',
    intrusion: 'Интрузия',
    extrusion: 'Экструзия'
  }
  return names[type] || type
}
</script>

<style scoped>
.simulator-view {
  animation: fadeIn 0.5s ease-in;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.simulator-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
}

.controls-panel {
  grid-row: 1 / 3;
}

.visualization-panel {
  grid-column: 2;
  grid-row: 1;
}

.results-panel {
  grid-column: 2;
  grid-row: 2;
}

.controls-panel h3,
.visualization-panel h3,
.results-panel h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

input[type="range"] {
  width: 100%;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.optimal-mark {
  color: #4caf50;
  font-weight: bold;
}

.btn {
  width: 100%;
  margin-bottom: 0.5rem;
}

.tooth-canvas {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
}

.results-content {
  display: grid;
  gap: 1rem;
}

.result-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.result-item strong {
  color: #2c3e50;
  display: block;
  margin-bottom: 0.25rem;
}

.result-item p {
  color: #555;
  margin: 0;
}

.result-item.assessment {
  background: linear-gradient(135deg, #f0f4ff 0%, #fef0ff 100%);
}

.optimal {
  color: #4caf50;
  font-weight: bold;
}

.warning {
  color: #ff9800;
  font-weight: bold;
}

.danger {
  color: #f44336;
  font-weight: bold;
}

.clinical-recommendations {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.clinical-recommendations h4 {
  color: #2e7d32;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.clinical-recommendations ul {
  list-style-position: inside;
  margin: 0;
}

.clinical-recommendations li {
  margin: 0.5rem 0;
  color: #2c3e50;
}

.placeholder {
  text-align: center;
  padding: 3rem;
  color: #999;
}

@media (max-width: 1200px) {
  .simulator-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .controls-panel {
    grid-row: 1;
  }

  .visualization-panel {
    grid-column: 1;
    grid-row: 2;
  }

  .results-panel {
    grid-column: 1;
    grid-row: 3;
  }
}
</style>

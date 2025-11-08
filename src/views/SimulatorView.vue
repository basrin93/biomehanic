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

          <!-- Детальное объяснение формул -->
          <div class="formula-explanation-section">
            <h4>📐 Биомеханические формулы и расчеты:</h4>

            <div class="formula-card">
              <div class="formula-title">Момент силы (M):</div>
              <div class="formula-display">
                <code>M = F × d</code>
              </div>
              <div class="formula-breakdown">
                <div class="param-item">
                  <span class="param-letter">M</span>
                  <span class="param-name">Момент силы</span>
                  <span class="param-value">{{ simulationResults.moment.toFixed(2) }} г·мм</span>
                  <span class="param-explanation">Это вращающий эффект, создаваемый силой. Момент определяет, насколько сильно будет вращаться зуб. Чем больше момент, тем больше корень будет двигаться.</span>
                </div>
                <div class="param-item">
                  <span class="param-letter">F</span>
                  <span class="param-name">Сила</span>
                  <span class="param-value">{{ params.force }} г</span>
                  <span class="param-explanation">Величина силы, приложенной к зубу через брекет или другой элемент. Измеряется в граммах. Это та сила, которую мы создаем с помощью дуги, эластиков или пружин.</span>
                </div>
                <div class="param-item">
                  <span class="param-letter">d</span>
                  <span class="param-name">Плечо силы (M/F)</span>
                  <span class="param-value">{{ mfRatio }} мм</span>
                  <span class="param-explanation">Расстояние от точки приложения силы до центра сопротивления. Чем больше плечо, тем больше момент при той же силе. В ортодонтии используется соотношение M/F для контроля типа перемещения.</span>
                </div>
              </div>
            </div>

            <div class="formula-card">
              <div class="formula-title">Положение центра сопротивления (ЦС):</div>
              <div class="formula-display">
                <code>h<sub>ЦС</sub> = L / 3</code>
              </div>
              <div class="formula-breakdown">
                <div class="param-item">
                  <span class="param-letter">h<sub>ЦС</sub></span>
                  <span class="param-name">Расстояние ЦС от альвеолярного гребня</span>
                  <span class="param-value">{{ simulationResults.crDistance.toFixed(2) }} мм</span>
                  <span class="param-explanation">Это точка, через которую должна проходить сила для корпусного перемещения без вращения. ЦС - это "балансировочная точка" зуба.</span>
                </div>
                <div class="param-item">
                  <span class="param-letter">L</span>
                  <span class="param-name">Длина корня</span>
                  <span class="param-value">{{ params.rootLength }} мм</span>
                  <span class="param-explanation">Полная длина корня зуба от верхушки (апекса) до альвеолярного гребня. Определяет положение ЦС и влияет на тип перемещения.</span>
                </div>
              </div>
            </div>

            <div class="formula-card">
              <div class="formula-title">Соотношение момент/сила (M/F):</div>
              <div class="formula-display">
                <code>M/F = {{ mfRatio }}:1</code>
              </div>
              <div class="formula-breakdown">
                <div class="param-item">
                  <span class="param-name">Что это значит:</span>
                  <span class="param-explanation">
                    <strong>M/F = 0:</strong> Только сила без момента → Наклон (коронка двигается больше)<br>
                    <strong>M/F = 7-8:1:</strong> Сила + момент → Корпусное перемещение (коронка и корень одинаково)<br>
                    <strong>M/F = 10-12:1:</strong> Большой момент → Корневое перемещение/торк (корень двигается больше)<br><br>
                    Текущее значение <strong>{{ mfRatio }}:1</strong> означает, что на каждый грамм силы создается момент в {{ mfRatio }} грамм·мм.
                  </span>
                </div>
              </div>
            </div>

            <div class="formula-card">
              <div class="formula-title">Скорость перемещения:</div>
              <div class="formula-display">
                <code>v = k × (F/F<sub>opt</sub>) × t</code>
              </div>
              <div class="formula-breakdown">
                <div class="param-item">
                  <span class="param-letter">v</span>
                  <span class="param-name">Скорость перемещения</span>
                  <span class="param-value">≈ {{ (simulationResults.crownDisplacement / params.duration).toFixed(3) }} мм/день</span>
                  <span class="param-explanation">Скорость, с которой зуб перемещается. Зависит от величины силы и физиологических возможностей тканей пародонта.</span>
                </div>
                <div class="param-item">
                  <span class="param-letter">k</span>
                  <span class="param-name">Коэффициент</span>
                  <span class="param-value">≈ 0.033 мм/день</span>
                  <span class="param-explanation">Базовая скорость перемещения при оптимальной силе. Примерно 1 мм в месяц - это физиологичная скорость ремоделирования кости.</span>
                </div>
                <div class="param-item">
                  <span class="param-letter">F<sub>opt</sub></span>
                  <span class="param-name">Оптимальная сила</span>
                  <span class="param-value">{{ forceRange.optimal }} г</span>
                  <span class="param-explanation">Сила, при которой достигается максимально эффективное и безопасное перемещение без повреждения тканей.</span>
                </div>
                <div class="param-item">
                  <span class="param-letter">t</span>
                  <span class="param-name">Время воздействия</span>
                  <span class="param-value">{{ params.duration }} дней</span>
                  <span class="param-explanation">Продолжительность действия силы на зуб. Чем дольше действует оптимальная сила, тем больше перемещение.</span>
                </div>
              </div>
            </div>
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
import { ref, computed, reactive, watch } from 'vue'
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
const animationProgress = ref(0)
const showFormulaExplanation = ref(false)

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

// Трансформация зуба (для анимации перемещения с плавным прогрессом)
const toothTransform = computed(() => {
  if (!isSimulating.value || !simulationResults.value) return ''

  const progress = animationProgress.value
  const crownMove = simulationResults.value.crownDisplacement * 50 * progress
  const rootMove = simulationResults.value.rootDisplacement * 50 * progress

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

// Улучшенная анимация с easing
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const animateMovement = () => {
  animationProgress.value = 0
  const duration = 3000 // 3 секунды для более плавной анимации
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const linearProgress = Math.min(elapsed / duration, 1)
    animationProgress.value = easeInOutCubic(linearProgress)

    if (linearProgress < 1) {
      requestAnimationFrame(animate)
    } else {
      animationProgress.value = 1
    }
  }

  requestAnimationFrame(animate)
}

// Запуск симуляции
const runSimulation = () => {
  isSimulating.value = true
  animationProgress.value = 0

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
    recommendations,
    moment: params.force * mfRatio.value
  }

  // Запуск плавной анимации
  animateMovement()
}

const resetSimulation = () => {
  isSimulating.value = false
  simulationResults.value = null
  animationProgress.value = 0
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
  transition: color 0.3s ease, border-color 0.3s ease;
}

.dark-theme .controls-panel h3,
.dark-theme .visualization-panel h3,
.dark-theme .results-panel h3 {
  color: var(--text-color);
  border-bottom-color: #7c8ff0;
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
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .tooth-canvas {
  background: rgba(42, 42, 62, 0.6);
  border-color: var(--border-color);
}

.legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
  transition: background 0.3s ease;
}

.dark-theme .legend {
  background: rgba(30, 30, 46, 0.6);
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
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .result-item {
  background: rgba(30, 30, 46, 0.6);
  border-left-color: #7c8ff0;
}

.result-item strong {
  color: #2c3e50;
  display: block;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.dark-theme .result-item strong {
  color: var(--text-color);
}

.result-item p {
  color: #555;
  margin: 0;
}

.result-item.assessment {
  background: linear-gradient(135deg, #f0f4ff 0%, #fef0ff 100%);
}

.dark-theme .result-item.assessment {
  background: linear-gradient(135deg, rgba(124, 143, 240, 0.2) 0%, rgba(142, 91, 184, 0.2) 100%);
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
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .clinical-recommendations {
  background: rgba(76, 175, 80, 0.15);
  border-left-color: #66bb6a;
}

.clinical-recommendations h4 {
  color: #2e7d32;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.dark-theme .clinical-recommendations h4 {
  color: #81c784;
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

/* Детальное объяснение формул */
.formula-explanation-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 2px solid #0ea5e9;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .formula-explanation-section {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%);
  border-color: #38bdf8;
}

.formula-explanation-section h4 {
  color: #0c4a6e;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  text-align: center;
  transition: color 0.3s ease;
}

.dark-theme .formula-explanation-section h4 {
  color: #7dd3fc;
}

.formula-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.dark-theme .formula-card {
  background: rgba(42, 42, 62, 0.6);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.formula-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.formula-card:last-child {
  margin-bottom: 0;
}

.formula-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #dbeafe;
}

.formula-display {
  background: #fef3c7;
  border: 3px dashed #f59e0b;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .formula-display {
  background: rgba(245, 158, 11, 0.15);
  border-color: #fbbf24;
}

.formula-display code {
  font-size: 1.8rem;
  font-weight: bold;
  color: #92400e;
  font-family: 'Courier New', monospace;
}

.formula-breakdown {
  display: grid;
  gap: 1rem;
}

.param-item {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  transition: all 0.3s ease;
}

.dark-theme .param-item {
  background: rgba(30, 30, 46, 0.6);
  border-left-color: #60a5fa;
}

.param-item:hover {
  background: #eff6ff;
  border-left-color: #1d4ed8;
}

.dark-theme .param-item:hover {
  background: rgba(59, 130, 246, 0.15);
  border-left-color: #3b82f6;
}

.param-letter {
  grid-column: 1;
  grid-row: 1 / 3;
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e40af;
  font-family: 'Times New Roman', serif;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 8px;
  padding: 0.5rem;
}

.param-name {
  grid-column: 2;
  font-weight: 600;
  color: #1e293b;
  font-size: 1.05rem;
}

.param-value {
  grid-column: 2;
  font-weight: bold;
  color: #0891b2;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.param-explanation {
  grid-column: 2;
  color: #475569;
  line-height: 1.7;
  font-size: 0.95rem;
  text-align: justify;
}

/* Улучшенная анимация для зуба */
svg path, svg circle, svg line {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

svg path:hover {
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4));
}

.tooth-canvas svg {
  transition: all 0.3s ease;
}

.tooth-canvas:hover svg {
  transform: scale(1.02);
}

/* Добавить пульсацию для ЦС */
svg circle {
  animation: crPulse 2s ease-in-out infinite;
}

@keyframes crPulse {
  0%, 100% {
    r: 6;
    opacity: 1;
  }
  50% {
    r: 8;
    opacity: 0.8;
  }
}

/* Анимация для векторов силы */
svg line {
  stroke-dasharray: 5, 5;
  animation: dashMove 1s linear infinite;
}

@keyframes dashMove {
  to {
    stroke-dashoffset: -10;
  }
}

/* Плавное появление карточек результатов */
.result-item {
  animation: slideInUp 0.5s ease-out backwards;
}

.result-item:nth-child(1) { animation-delay: 0.1s; }
.result-item:nth-child(2) { animation-delay: 0.15s; }
.result-item:nth-child(3) { animation-delay: 0.2s; }
.result-item:nth-child(4) { animation-delay: 0.25s; }
.result-item:nth-child(5) { animation-delay: 0.3s; }
.result-item:nth-child(6) { animation-delay: 0.35s; }
.result-item:nth-child(7) { animation-delay: 0.4s; }
.result-item:nth-child(8) { animation-delay: 0.45s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Улучшенные эффекты для формул */
.formula-card {
  position: relative;
  overflow: hidden;
}

.formula-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s;
}

.formula-card:hover::before {
  left: 100%;
}

/* Интерактивные параметры */
.param-item {
  position: relative;
  overflow: hidden;
}

.param-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.4s ease;
}

.param-item:hover::after {
  width: 100%;
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

<template>
  <div class="calculator-view">
    <h2>Биомеханический калькулятор</h2>
    <p class="subtitle">Расчет сил и моментов для ортодонтических перемещений</p>

    <div class="calculator-grid">
      <!-- Калькулятор ЦС -->
      <div class="card calculator-card">
        <h3>📍 Расчет положения центра сопротивления</h3>
        <div class="input-group">
          <label>Тип зуба:</label>
          <select v-model="crCalc.toothType">
            <option value="single">Однокорневой</option>
            <option value="multi">Многокорневой</option>
          </select>
        </div>

        <div class="input-group">
          <label>Длина корня (мм):</label>
          <input type="number" v-model.number="crCalc.rootLength" min="1" step="0.1" />
        </div>

        <div class="input-group">
          <label>Уровень резорбции кости (мм):</label>
          <input type="number" v-model.number="crCalc.boneResorption" min="0" step="0.1" />
        </div>

        <button @click="calculateCR" class="btn btn-primary">Рассчитать</button>

        <div v-if="crCalc.result" class="result-box">
          <h4>Результат:</h4>
          <p>
            <strong>Расстояние ЦС от альвеолярного гребня:</strong>
            {{ crCalc.result.distance.toFixed(2) }} мм
          </p>
          <p>
            <strong>Расстояние от апекса:</strong>
            {{ crCalc.result.fromApex.toFixed(2) }} мм
          </p>
          <p class="note">{{ crCalc.result.note }}</p>
        </div>
      </div>

      <!-- Калькулятор M/F -->
      <div class="card calculator-card">
        <h3>⚖️ Расчет соотношения M/F</h3>
        <div class="input-group">
          <label>Тип перемещения:</label>
          <select v-model="mfCalc.movementType" @change="updateMFRatio">
            <option value="tipping">Наклонно-вращательное</option>
            <option value="bodily">Корпусное</option>
            <option value="root">Корневое (торк)</option>
            <option value="custom">Пользовательское</option>
          </select>
        </div>

        <div class="input-group">
          <label>Тип зуба:</label>
          <select v-model="mfCalc.toothType" @change="updateMFRatio">
            <option value="single">Однокорневой</option>
            <option value="multi">Многокорневой</option>
          </select>
        </div>

        <div class="input-group">
          <label>Сила (г):</label>
          <input type="number" v-model.number="mfCalc.force" min="0" step="1" />
        </div>

        <div class="input-group">
          <label>Оптимальное M/F:</label>
          <input
            type="number"
            v-model.number="mfCalc.ratio"
            :disabled="mfCalc.movementType !== 'custom'"
            step="0.1"
          />
        </div>

        <button @click="calculateMF" class="btn btn-primary">Рассчитать</button>

        <div v-if="mfCalc.result" class="result-box">
          <h4>Результат:</h4>
          <p>
            <strong>Требуемый момент:</strong>
            {{ mfCalc.result.moment.toFixed(2) }} г·мм
          </p>
          <p>
            <strong>Тип перемещения:</strong>
            {{ mfCalc.result.movementDescription }}
          </p>
        </div>
      </div>

      <!-- Калькулятор силы дуги -->
      <div class="card calculator-card">
        <h3>🔧 Расчет силы ортодонтической дуги</h3>
        <div class="input-group">
          <label>Материал дуги:</label>
          <select v-model="wireCalc.material">
            <option value="ss">Нержавеющая сталь</option>
            <option value="niti">NiTi (Никель-титан)</option>
            <option value="tma">TMA (β-титан)</option>
          </select>
        </div>

        <div class="input-group">
          <label>Размер дуги (дюймы):</label>
          <select v-model="wireCalc.size">
            <option value="0.012">0.012"</option>
            <option value="0.014">0.014"</option>
            <option value="0.016">0.016"</option>
            <option value="0.018">0.018"</option>
            <option value="0.020">0.020"</option>
            <option value="0.016x0.022">0.016" × 0.022"</option>
            <option value="0.017x0.025">0.017" × 0.025"</option>
            <option value="0.019x0.025">0.019" × 0.025"</option>
          </select>
        </div>

        <div class="input-group">
          <label>Активная длина (мм):</label>
          <input type="number" v-model.number="wireCalc.activeLength" min="1" step="1" />
        </div>

        <div class="input-group">
          <label>Деформация (мм):</label>
          <input type="number" v-model.number="wireCalc.deflection" min="0" step="0.1" />
        </div>

        <button @click="calculateWireForce" class="btn btn-primary">Рассчитать</button>

        <div v-if="wireCalc.result" class="result-box">
          <h4>Результат:</h4>
          <p>
            <strong>Сила:</strong>
            {{ wireCalc.result.force.toFixed(2) }} г
          </p>
          <p>
            <strong>Оценка:</strong>
            <span :class="wireCalc.result.assessmentClass">
              {{ wireCalc.result.assessment }}
            </span>
          </p>
          <p class="note">{{ wireCalc.result.note }}</p>
        </div>
      </div>

      <!-- Калькулятор опорных зубов -->
      <div class="card calculator-card">
        <h3>🦷 Анализ опорных зубов</h3>
        <div class="input-group">
          <label>Количество подвижных зубов:</label>
          <input type="number" v-model.number="anchorCalc.activeTeeth" min="1" max="10" />
        </div>

        <div class="input-group">
          <label>Количество опорных зубов:</label>
          <input type="number" v-model.number="anchorCalc.anchorTeeth" min="1" max="10" />
        </div>

        <div class="input-group">
          <label>Сила на активные зубы (г):</label>
          <input type="number" v-model.number="anchorCalc.activeForce" min="0" step="1" />
        </div>

        <button @click="calculateAnchor" class="btn btn-primary">Рассчитать</button>

        <div v-if="anchorCalc.result" class="result-box">
          <h4>Результат:</h4>
          <p>
            <strong>Соотношение опоры:</strong>
            {{ anchorCalc.result.ratio }}
          </p>
          <p>
            <strong>Реактивная сила на опору:</strong>
            {{ anchorCalc.result.reactionForce.toFixed(2) }} г
          </p>
          <p>
            <strong>Оценка опоры:</strong>
            <span :class="anchorCalc.result.assessmentClass">
              {{ anchorCalc.result.assessment }}
            </span>
          </p>
          <p class="note">{{ anchorCalc.result.recommendation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { calculateCenterOfResistance, calculateMomentForceRatio, calculateArchwireForce, calculateAnchorage } from '@/utils/biomechanics'

// Калькулятор центра сопротивления
const crCalc = reactive({
  toothType: 'single' as 'single' | 'multi',
  rootLength: 13,
  boneResorption: 0,
  result: null as any
})

const calculateCR = () => {
  crCalc.result = calculateCenterOfResistance(
    crCalc.toothType,
    crCalc.rootLength,
    crCalc.boneResorption
  )
}

// Калькулятор M/F
const mfCalc = reactive({
  movementType: 'bodily' as 'tipping' | 'bodily' | 'root' | 'custom',
  toothType: 'single' as 'single' | 'multi',
  force: 50,
  ratio: 7,
  result: null as any
})

const updateMFRatio = () => {
  if (mfCalc.movementType === 'tipping') {
    mfCalc.ratio = 0
  } else if (mfCalc.movementType === 'bodily') {
    mfCalc.ratio = mfCalc.toothType === 'single' ? 7 : 10
  } else if (mfCalc.movementType === 'root') {
    mfCalc.ratio = mfCalc.toothType === 'single' ? 10 : 12
  }
}

const calculateMF = () => {
  mfCalc.result = calculateMomentForceRatio(
    mfCalc.force,
    mfCalc.ratio,
    mfCalc.movementType
  )
}

// Калькулятор силы дуги
const wireCalc = reactive({
  material: 'niti',
  size: '0.016',
  activeLength: 8,
  deflection: 1,
  result: null as any
})

const calculateWireForce = () => {
  wireCalc.result = calculateArchwireForce(
    wireCalc.material,
    wireCalc.size,
    wireCalc.activeLength,
    wireCalc.deflection
  )
}

// Калькулятор опорных зубов
const anchorCalc = reactive({
  activeTeeth: 2,
  anchorTeeth: 4,
  activeForce: 100,
  result: null as any
})

const calculateAnchor = () => {
  anchorCalc.result = calculateAnchorage(
    anchorCalc.activeTeeth,
    anchorCalc.anchorTeeth,
    anchorCalc.activeForce
  )
}
</script>

<style scoped>
.calculator-view {
  animation: fadeIn 0.5s ease-in;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.calculator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.calculator-card {
  padding: 1.5rem;
}

.calculator-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.result-box {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #e8f5e9 0%, #f0f4ff 100%);
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.result-box h4 {
  color: #2e7d32;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.result-box p {
  margin: 0.5rem 0;
  color: #2c3e50;
}

.result-box strong {
  color: #1976d2;
}

.note {
  font-style: italic;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
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
</style>

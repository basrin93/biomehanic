<template>
  <div class="cases-view">
    <h2>Клинические случаи</h2>
    <p class="subtitle">Разбор реальных клинических ситуаций с биомеханическим анализом</p>

    <div class="cases-grid">
      <div
        v-for="clinicalCase in cases"
        :key="clinicalCase.id"
        class="card case-card"
        @click="selectCase(clinicalCase)"
      >
        <div class="case-header">
          <h3>{{ clinicalCase.title }}</h3>
          <span :class="['difficulty-badge', clinicalCase.difficulty]">
            {{ getDifficultyLabel(clinicalCase.difficulty) }}
          </span>
        </div>
        <p class="case-description">{{ clinicalCase.description }}</p>
        <div class="case-tags">
          <span v-for="tag in clinicalCase.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Модальное окно с детальным разбором -->
    <div v-if="selectedCase" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">✕</button>

        <h2>{{ selectedCase.title }}</h2>

        <div class="case-details">
          <!-- Информация о пациенте -->
          <div class="detail-section">
            <h3>📋 Информация о пациенте</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>Возраст:</strong>
                <span>{{ selectedCase.patientInfo.age }} лет</span>
              </div>
              <div class="info-item">
                <strong>Пол:</strong>
                <span>{{ selectedCase.patientInfo.gender }}</span>
              </div>
              <div class="info-item">
                <strong>Жалобы:</strong>
                <span>{{ selectedCase.patientInfo.complaints }}</span>
              </div>
            </div>
          </div>

          <!-- Диагноз -->
          <div class="detail-section">
            <h3>🔍 Диагноз</h3>
            <p>{{ selectedCase.diagnosis }}</p>
          </div>

          <!-- Биомеханический анализ -->
          <div class="detail-section highlight">
            <h3>⚙️ Биомеханический анализ</h3>
            <div class="biomechanics-content">
              <div v-for="(item, index) in selectedCase.biomechanicalAnalysis" :key="index" class="analysis-item">
                <h4>{{ item.aspect }}</h4>
                <p>{{ item.description }}</p>
                <div v-if="item.calculations" class="calculations">
                  <strong>Расчеты:</strong>
                  <ul>
                    <li v-for="(calc, i) in item.calculations" :key="i">{{ calc }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- План лечения -->
          <div class="detail-section">
            <h3>📝 План лечения</h3>
            <ol class="treatment-plan">
              <li v-for="(step, index) in selectedCase.treatmentPlan" :key="index">
                {{ step }}
              </li>
            </ol>
          </div>

          <!-- Используемая механика -->
          <div class="detail-section">
            <h3>🔧 Используемая механика</h3>
            <div class="mechanics-grid">
              <div v-for="(mech, index) in selectedCase.mechanics" :key="index" class="mechanic-item">
                <strong>{{ mech.type }}</strong>
                <p>{{ mech.description }}</p>
                <div class="parameters">
                  <span v-for="(param, i) in mech.parameters" :key="i" class="param-tag">
                    {{ param }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ключевые моменты -->
          <div class="detail-section special">
            <h3>💡 Ключевые моменты по методологии проф. Попова С.А.</h3>
            <ul class="key-points">
              <li v-for="(point, index) in selectedCase.keyPoints" :key="index">
                {{ point }}
              </li>
            </ul>
          </div>

          <!-- Прогноз -->
          <div class="detail-section">
            <h3>📊 Прогнозируемые результаты</h3>
            <p>{{ selectedCase.prognosis }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ClinicalCase {
  id: number
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  patientInfo: {
    age: number
    gender: string
    complaints: string
  }
  diagnosis: string
  biomechanicalAnalysis: Array<{
    aspect: string
    description: string
    calculations?: string[]
  }>
  treatmentPlan: string[]
  mechanics: Array<{
    type: string
    description: string
    parameters: string[]
  }>
  keyPoints: string[]
  prognosis: string
}

const cases: ClinicalCase[] = [
  {
    id: 1,
    title: 'Ретракция фронтальных зубов после удаления премоляров',
    description: 'Класс II, дивизион 1. Протрузия верхних резцов. Удаление 14, 24 зубов.',
    difficulty: 'medium',
    tags: ['Класс II', 'Ретракция', 'Опора'],
    patientInfo: {
      age: 16,
      gender: 'Женский',
      complaints: 'Выступающие передние зубы, эстетический дефект'
    },
    diagnosis: 'Аномалия окклюзии класса II по Энглю, дивизион 1. Протрузия верхних резцов. Скученность во фронтальном отделе.',
    biomechanicalAnalysis: [
      {
        aspect: 'Центр сопротивления фронтальной группы',
        description: 'ЦС группы из 6 фронтальных зубов расположен между латеральными резцами и клыками на уровне 8-10 мм от альвеолярного гребня',
        calculations: [
          'Расстояние ЦС от брекета ≈ 12 мм',
          'Требуемое M/F для корпусного перемещения: 10:1'
        ]
      },
      {
        aspect: 'Анализ опоры',
        description: 'Необходимо обеспечить максимальную опору для предотвращения мезиального смещения моляров',
        calculations: [
          'Соотношение опоры: 6 зубов (моляры + премоляры) : 6 зубов (фронтальные)',
          'Рекомендуется усиление опоры минивинтами или ТАД'
        ]
      },
      {
        aspect: 'Расчет силы ретракции',
        description: 'Оптимальная сила для корпусного перемещения фронтальной группы',
        calculations: [
          'Сила на один резец: 75-100 г',
          'Общая сила на фронтальную группу: 150-200 г (разделена на обе стороны)'
        ]
      }
    ],
    treatmentPlan: [
      'Установка брекет-системы 0.022" MBT',
      'Выравнивание и нивелирование (NiTi дуги 0.012"-0.016")',
      'Переход на рабочие дуги (0.019x0.025" SS)',
      'Установка минивинтов между 16-17 и 26-27 для усиления опоры',
      'Ретракция фронтальной группы с использованием эластомерных цепочек',
      'Коррекция торка резцов',
      'Финишинг и детализация',
      'Ретенция'
    ],
    mechanics: [
      {
        type: 'Усиление опоры',
        description: 'Минивинты в дистальном отделе',
        parameters: ['Позиция: между 1-м и 2-м молярами', 'Высота: 8-10 мм от десневого края']
      },
      {
        type: 'Ретракционная механика',
        description: 'Эластомерные цепочки от минивинтов к крючкам на дуге',
        parameters: ['Сила: 150-200 г с каждой стороны', 'Замена каждые 3-4 недели']
      },
      {
        type: 'Контроль торка',
        description: 'Прямоугольная дуга с увеличенным торком',
        parameters: ['Дуга: 0.019x0.025" SS', 'Торк: -7° для верхних резцов']
      }
    ],
    keyPoints: [
      'Использование минивинтов критично для предотвращения потери опоры',
      'M/F соотношение 10:1 обеспечивает корпусное перемещение без чрезмерного наклона',
      'Контроль вертикального компонента силы для предотвращения интрузии резцов',
      'Применение момента анти-опрокидывания на фронтальную группу',
      'Регулярный контроль положения ЦС при перемещении'
    ],
    prognosis: 'При правильном применении биомеханических принципов ожидается корпусное перемещение фронтальной группы на 6-7 мм с сохранением опоры. Срок активного лечения: 18-24 месяца.'
  },
  {
    id: 2,
    title: 'Интрузия верхних резцов при глубоком прикусе',
    description: 'Глубокий резцовый прикус. Необходима интрузия верхних резцов.',
    difficulty: 'hard',
    tags: ['Глубокий прикус', 'Интрузия', 'Вертикальный контроль'],
    patientInfo: {
      age: 24,
      gender: 'Мужской',
      complaints: 'Глубокий прикус, травма нижних резцов о небо'
    },
    diagnosis: 'Глубокий резцовый прикус с перекрытием более 5 мм. Травматическая окклюзия. Супраокклюзия верхних резцов.',
    biomechanicalAnalysis: [
      {
        aspect: 'Анализ вертикального компонента',
        description: 'Интрузия - наиболее сложное перемещение, требующее точного контроля силы',
        calculations: [
          'Оптимальная сила интрузии: 15-20 г на резец',
          'Общая сила на фронтальную группу: не более 60 г'
        ]
      },
      {
        aspect: 'Линия действия силы',
        description: 'Сила должна проходить через ЦС группы резцов для предотвращения проклинации',
        calculations: [
          'ЦС фронтальной группы: на уровне 8-10 мм апикально от брекетов',
          'Точка приложения силы: на уровне ЦС'
        ]
      }
    ],
    treatmentPlan: [
      'Установка брекет-системы',
      'Выравнивание',
      'Установка интрузионной дуги с изгибом',
      'Использование минивинтов для создания интрузионной силы',
      'Мониторинг резорбции корней (КЛКТ контроль)',
      'Стабилизация результата',
      'Ретенция с контролем вертикального компонента'
    ],
    mechanics: [
      {
        type: 'Интрузионная дуга',
        description: 'Базовая дуга с активационным изгибом',
        parameters: ['Материал: TMA 0.017x0.025"', 'Изгиб в области резцов для интрузии']
      },
      {
        type: 'Минивинт-опора',
        description: 'Минивинты между корнями резцов и клыков',
        parameters: ['Позиция: 6-8 мм от десны', 'Эластик от минивинта к дуге: 50-60 г']
      }
    ],
    keyPoints: [
      'Интрузионная сила должна быть минимальной - высокий риск резорбции корней',
      'Линия действия силы критична - должна проходить через ЦС',
      'Необходим рентгенологический контроль каждые 3 месяца',
      'Использование легких непрерывных сил',
      'Избегать чрезмерной проклинации во время интрузии'
    ],
    prognosis: 'При соблюдении биомеханических принципов ожидается интрузия верхних резцов на 3-4 мм. Риск резорбции корней умеренный при правильном контроле силы. Срок: 12-18 месяцев.'
  },
  {
    id: 3,
    title: 'Коррекция торка резцов при протрузии',
    description: 'Чрезмерная инклинация верхних резцов. Необходима коррекция торка.',
    difficulty: 'medium',
    tags: ['Торк', 'Корневое перемещение', 'Инклинация'],
    patientInfo: {
      age: 19,
      gender: 'Женский',
      complaints: 'Торчащие вперед передние зубы'
    },
    diagnosis: 'Протрузия верхних резцов с чрезмерной инклинацией. Увеличенный угол наклона резцов.',
    biomechanicalAnalysis: [
      {
        aspect: 'Торковое перемещение',
        description: 'Необходимо преимущественное перемещение корней при минимальном движении коронок',
        calculations: [
          'Требуемое M/F: 12:1 для корневого перемещения',
          'Сила: 50-75 г на резец',
          'Момент: 600-900 г·мм на резец'
        ]
      },
      {
        aspect: 'Создание торкового момента',
        description: 'Использование прямоугольной дуги в прямоугольном пазе брекета',
        calculations: [
          'Размер паза: 0.022"',
          'Размер дуги: 0.019x0.025" (заполнение паза ~85%)',
          'Торковый угол: +7° до +15°'
        ]
      }
    ],
    treatmentPlan: [
      'Выравнивание и нивелирование',
      'Переход на прямоугольные дуги',
      'Постепенное увеличение торка',
      'Использование дуг с запрограммированным отрицательным торком',
      'Контроль положения корней',
      'Финишинг',
      'Ретенция'
    ],
    mechanics: [
      {
        type: 'Торковые дуги',
        description: 'Последовательность прямоугольных дуг с увеличением торка',
        parameters: [
          '1-й этап: 0.016x0.022" NiTi',
          '2-й этап: 0.017x0.025" TMA',
          '3-й этап: 0.019x0.025" SS с дополнительным торком'
        ]
      }
    ],
    keyPoints: [
      'Высокое M/F (12:1) необходимо для корневого перемещения',
      'Постепенное увеличение торка предотвращает дискомфорт и резорбцию',
      'Полное заполнение паза брекета критично для передачи момента',
      'Контроль длины корня при значительном торковом перемещении'
    ],
    prognosis: 'Ожидается коррекция инклинации резцов на 10-15°. Корни переместятся небно на 2-3 мм. Срок: 8-12 месяцев.'
  },
  {
    id: 4,
    title: 'Корпусное мезиальное перемещение моляра',
    description: 'Закрытие пространства после раннего удаления первого моляра.',
    difficulty: 'hard',
    tags: ['Моляр', 'Закрытие пространства', 'Опора'],
    patientInfo: {
      age: 22,
      gender: 'Мужской',
      complaints: 'Отсутствие 36 зуба, промежуток'
    },
    diagnosis: 'Отсутствие 36 зуба (удален по медицинским показаниям). Наклон 37 зуба мезиально.',
    biomechanicalAnalysis: [
      {
        aspect: 'Корпусное перемещение моляра',
        description: 'Наиболее сложное перемещение из-за большой площади корней и необходимости высокого M/F',
        calculations: [
          'ЦС моляра: на уровне бифуркации корней (10-12 мм от альвеолярного гребня)',
          'M/F для корпусного перемещения моляра: 10-12:1',
          'Оптимальная сила: 150-200 г',
          'Требуемый момент: 1500-2400 г·мм'
        ]
      },
      {
        aspect: 'Контроль опоры',
        description: 'Предотвращение дистального смещения передних зубов',
        calculations: [
          'Соотношение: 1 моляр vs 7 зубов (премоляры + фронтальные)',
          'Рекомендуется усиление опоры'
        ]
      }
    ],
    treatmentPlan: [
      'Установка брекетов на все зубы',
      'Выравнивание',
      'Установка минивинтов для усиления опоры фронтального сегмента',
      'Использование кантилеверной механики для корпусного перемещения моляра',
      'Постепенное закрытие пространства',
      'Параллелизация корней',
      'Финишинг окклюзии'
    ],
    mechanics: [
      {
        type: 'Кантилеверная пружина',
        description: 'TMA пружина от минивинта к молярному брекету',
        parameters: [
          'Материал: TMA 0.017x0.025"',
          'Активация: 1-2 мм каждые 4-6 недель',
          'Сила: 150-200 г'
        ]
      },
      {
        type: 'Момент анти-наклона',
        description: 'Встроенный момент в пружину для корпусного перемещения',
        parameters: ['M/F = 10:1', 'Контроль наклона моляра']
      }
    ],
    keyPoints: [
      'Моляры требуют большой силы, но она должна оставаться физиологичной',
      'Высокое M/F критично для предотвращения наклона',
      'Кантилеверная механика эффективна для контроля всех компонентов движения',
      'Обязательно усиление опоры передних зубов',
      'Длительный срок лечения из-за большой массы зуба'
    ],
    prognosis: 'Ожидается корпусное перемещение 37 зуба мезиально на 8-10 мм с полным закрытием пространства. Срок: 24-30 месяцев.'
  }
]

const selectedCase = ref<ClinicalCase | null>(null)

const selectCase = (clinicalCase: ClinicalCase) => {
  selectedCase.value = clinicalCase
}

const closeModal = () => {
  selectedCase.value = null
}

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    easy: 'Простой',
    medium: 'Средний',
    hard: 'Сложный'
  }
  return labels[difficulty] || difficulty
}
</script>

<style scoped>
.cases-view {
  animation: fadeIn 0.5s ease-in;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.case-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.case-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.case-header h3 {
  flex: 1;
  color: #2c3e50;
  font-size: 1.2rem;
  margin: 0;
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.difficulty-badge.easy {
  background: #c8e6c9;
  color: #2e7d32;
}

.difficulty-badge.medium {
  background: #fff9c4;
  color: #f57f17;
}

.difficulty-badge.hard {
  background: #ffcdd2;
  color: #c62828;
}

.case-description {
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #d32f2f;
  transform: rotate(90deg);
}

.modal-content h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  padding-right: 3rem;
}

.case-details {
  display: grid;
  gap: 1.5rem;
}

.detail-section {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.detail-section.highlight {
  background: linear-gradient(135deg, #f0f4ff 0%, #fef0ff 100%);
  border-left-color: #764ba2;
}

.detail-section.special {
  background: linear-gradient(135deg, #fff9e6 0%, #ffe8cc 100%);
  border-left-color: #ff9800;
}

.detail-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.detail-section h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item strong {
  color: #2c3e50;
  font-size: 0.9rem;
}

.info-item span {
  color: #555;
}

.biomechanics-content {
  display: grid;
  gap: 1.5rem;
}

.analysis-item {
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.calculations {
  margin-top: 1rem;
  padding: 1rem;
  background: #fff9e6;
  border-radius: 6px;
  border-left: 3px solid #ffc107;
}

.calculations strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #f57f17;
}

.calculations ul {
  list-style-position: inside;
  margin: 0;
}

.calculations li {
  margin: 0.25rem 0;
  color: #555;
}

.treatment-plan {
  list-style-position: inside;
  margin: 0;
}

.treatment-plan li {
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  color: #2c3e50;
}

.mechanics-grid {
  display: grid;
  gap: 1rem;
}

.mechanic-item {
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.mechanic-item strong {
  color: #667eea;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.mechanic-item p {
  color: #555;
  margin-bottom: 0.75rem;
}

.parameters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.param-tag {
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 15px;
  font-size: 0.85rem;
}

.key-points {
  list-style-position: inside;
  margin: 0;
}

.key-points li {
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  color: #2c3e50;
  font-weight: 500;
}
</style>

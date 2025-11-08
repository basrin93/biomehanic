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
          <p><strong>Определение:</strong> Центр сопротивления (ЦС) — это фундаментальная биомеханическая точка зуба, которая определяет характер его перемещения. Это точка, через которую должна проходить равнодействующая сила для корпусного перемещения зуба без вращения.</p>

          <div class="highlight-box special">
            <h4>🎯 Что такое ЦС простыми словами:</h4>
            <p>Представьте, что зуб — это стержень в песке. Если вы толкаете его сверху (выше центра), он наклоняется. Если толкаете точно в центре — двигается всем телом. Если толкаете снизу центра — наклоняется в обратную сторону. Центр сопротивления — это та самая "балансировочная точка" зуба.</p>

            <div class="visual-example">
              <div class="example-grid">
                <div class="example-item">
                  <div class="tooth-diagram tipping-above">
                    <div class="tooth-body">
                      <div class="crown">🦷</div>
                      <div class="root"></div>
                      <div class="cr-dot">•</div>
                      <div class="force-arrow above">→</div>
                    </div>
                    <div class="movement-result">↺ Наклон</div>
                  </div>
                  <p class="example-label">Сила выше ЦС</p>
                </div>
                <div class="example-item">
                  <div class="tooth-diagram bodily">
                    <div class="tooth-body">
                      <div class="crown">🦷</div>
                      <div class="root"></div>
                      <div class="cr-dot">•</div>
                      <div class="force-arrow at-cr">→</div>
                    </div>
                    <div class="movement-result">⇒ Корпусное</div>
                  </div>
                  <p class="example-label">Сила через ЦС</p>
                </div>
                <div class="example-item">
                  <div class="tooth-diagram tipping-below">
                    <div class="tooth-body">
                      <div class="crown">🦷</div>
                      <div class="root"></div>
                      <div class="cr-dot">•</div>
                      <div class="force-arrow below">→</div>
                    </div>
                    <div class="movement-result">↻ Торк</div>
                  </div>
                  <p class="example-label">Сила ниже ЦС</p>
                </div>
              </div>
            </div>
          </div>

          <div class="highlight-box">
            <h4>📍 Локализация ЦС:</h4>
            <ul>
              <li><strong>Однокорневые зубы (резцы, клыки, премоляры):</strong>
                <ul>
                  <li>На 1/3 расстояния от апекса корня до альвеолярного гребня</li>
                  <li>Примерно на уровне 4-5 мм от альвеолярного гребня (для стандартного корня 13 мм)</li>
                  <li>Находится ВНУТРИ альвеолярной кости</li>
                </ul>
              </li>
              <li><strong>Многокорневые зубы (моляры):</strong>
                <ul>
                  <li>В области бифуркации (раздвоения) корней</li>
                  <li>Примерно на уровне 1/2 длины корня</li>
                  <li>Обычно на 6-7 мм от альвеолярного гребня</li>
                </ul>
              </li>
              <li><strong>При резорбции кости (пародонтит, возрастные изменения):</strong>
                <ul>
                  <li>ЦС смещается апикально (ближе к верхушке корня)</li>
                  <li>Это затрудняет ортодонтическое лечение</li>
                  <li>Требуется пересчет биомеханических параметров</li>
                </ul>
              </li>
            </ul>
          </div>

          <div class="formula-box">
            <p><strong>📐 Формула расчета положения ЦС:</strong></p>
            <code>h<sub>ЦС</sub> = L / 3</code>
            <div class="formula-params">
              <div class="param-explain">
                <span class="param-letter-big">h<sub>ЦС</sub></span>
                <span class="param-desc">
                  <strong>Расстояние от альвеолярного гребня до ЦС</strong><br>
                  Измеряется в миллиметрах. Это вертикальное расстояние от края кости (там, где заканчивается десна и начинается зуб) до центра сопротивления.
                </span>
              </div>
              <div class="param-explain">
                <span class="param-letter-big">L</span>
                <span class="param-desc">
                  <strong>Длина корня зуба</strong><br>
                  Измеряется от апекса (верхушки корня) до альвеолярного гребня. Средние значения: резцы 12-13 мм, клыки 15-17 мм, премоляры 13-14 мм, моляры 12-13 мм.
                </span>
              </div>
            </div>
            <p class="formula-example"><strong>Пример расчета:</strong> Если длина корня L = 12 мм, то h<sub>ЦС</sub> = 12 / 3 = 4 мм от альвеолярного гребня.</p>
          </div>

          <div class="clinical-note-box">
            <h4>💡 Клиническое значение:</h4>
            <p><strong>Почему ЦС так важен?</strong> От положения ЦС зависит, КАК будет двигаться зуб:</p>
            <ul>
              <li><strong>Сила ЧЕРЕЗ ЦС</strong> → корпусное перемещение (коронка и корень двигаются одинаково)</li>
              <li><strong>Сила ВЫШЕ ЦС</strong> → наклон (коронка двигается больше, корень меньше)</li>
              <li><strong>Сила НИЖЕ ЦС</strong> → торк (корень двигается больше, коронка меньше)</li>
            </ul>
            <p>Поскольку брекет находится на коронке (намного выше ЦС), для корпусного перемещения нужен компенсирующий момент!</p>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'forces'" class="card theory-section">
        <h3>Система сил в ортодонтии</h3>
        <div class="content-block">
          <p><strong>Основа биомеханики:</strong> Любое ортодонтическое перемещение - это результат действия сил и моментов на зуб. Понимание системы сил - ключ к предсказуемому лечению.</p>

          <h4>⚡ Типы сил:</h4>

          <div class="force-types">
            <div class="force-card">
              <h5>🔵 Одиночная сила (F)</h5>
              <p><strong>Что это:</strong> Единственная сила, приложенная к зубу в одной точке (обычно на брекете)</p>
              <p><strong>Что происходит:</strong> Зуб наклоняется вокруг ЦС - коронка двигается больше, чем корень</p>
              <div class="formula-box">
                <code>F = m × a</code>
                <p class="formula-note"><strong>m</strong> - масса (вес зуба и окружающих тканей)<br><strong>a</strong> - ускорение перемещения</p>
              </div>
              <div class="clinical-note">
                <strong>Клинический пример:</strong> Съемная пластинка с пружиной на один зуб - создает одиночную силу, зуб наклоняется.
              </div>
            </div>

            <div class="force-card">
              <h5>🔄 Момент пары сил (M)</h5>
              <p><strong>Что это:</strong> Две равные противоположно направленные силы, приложенные на расстоянии друг от друга</p>
              <p><strong>Что происходит:</strong> Зуб вращается вокруг ЦС без линейного перемещения</p>
              <div class="formula-box">
                <code>M = F × d</code>
                <div class="formula-params">
                  <p class="formula-note">
                    <strong>M</strong> — момент силы (г·мм) - вращающий эффект<br>
                    <strong>F</strong> — величина каждой силы (г)<br>
                    <strong>d</strong> — плечо силы (мм) - расстояние между силами
                  </p>
                </div>
              </div>
              <div class="clinical-note">
                <strong>Клинический пример:</strong> Прямоугольная дуга в прямоугольном пазе брекета создает момент - зуб вращается на месте.
              </div>
            </div>

            <div class="force-card">
              <h5>⚖️ Комбинированная система (Сила + Момент)</h5>
              <p><strong>Что это:</strong> Одновременное действие силы и момента на зуб</p>
              <p><strong>Что происходит:</strong> Зависит от соотношения M/F - можем получить любой тип перемещения!</p>
              <div class="clinical-note">
                <strong>Это основа современной ортодонтии!</strong> Брекет-система создает и силу (от дуги), и момент (от взаимодействия дуги с пазом). Меняя M/F, мы контролируем тип перемещения.
              </div>
            </div>
          </div>

          <div class="highlight-box special">
            <h4>📊 Соотношение момент/сила (M/F) - САМОЕ ВАЖНОЕ!</h4>
            <p><strong>M/F определяет ТИП перемещения зуба:</strong></p>

            <div class="mf-ratio-explanation">
              <div class="mf-item">
                <div class="mf-value">M/F = 0</div>
                <div class="mf-type">Наклонно-вращательное (неконтролируемое наклонение)</div>
                <div class="mf-desc">
                  <strong>Что происходит:</strong> Только сила, без момента. Зуб наклоняется вокруг ЦС.<br>
                  <strong>Движение:</strong> Коронка >> Корень (коронка двигается в 3-4 раза больше)<br>
                  <strong>Когда используется:</strong> Съемные аппараты, начальное выравнивание<br>
                  <strong>Недостаток:</strong> Неконтролируемое положение корня
                </div>
              </div>

              <div class="mf-item optimal">
                <div class="mf-value">M/F = 7-8:1</div>
                <div class="mf-type">Корпусное перемещение (однокорневые зубы)</div>
                <div class="mf-desc">
                  <strong>Что происходит:</strong> Сила + компенсирующий момент = параллельное перемещение<br>
                  <strong>Движение:</strong> Коронка = Корень (двигаются одинаково)<br>
                  <strong>Когда используется:</strong> Закрытие промежутков, ретракция фронтальных<br>
                  <strong>Преимущество:</strong> Контролируемое перемещение всего зуба<br>
                  <strong>Как создать:</strong> Прямоугольная дуга 0.019x0.025" в пазе 0.022"
                </div>
              </div>

              <div class="mf-item">
                <div class="mf-value">M/F = 10-12:1</div>
                <div class="mf-type">Корневое перемещение (торк)</div>
                <div class="mf-desc">
                  <strong>Что происходит:</strong> Большой момент преодолевает силу - корень двигается больше<br>
                  <strong>Движение:</strong> Корень >> Коронка (корень двигается больше)<br>
                  <strong>Когда используется:</strong> Коррекция инклинации резцов, параллелизация корней<br>
                  <strong>Как создать:</strong> Торк в дуге, прямоугольная дуга с большим заполнением паза
                </div>
              </div>

              <div class="mf-item">
                <div class="mf-value">M/F = 5:1</div>
                <div class="mf-type">Контролируемый наклон</div>
                <div class="mf-desc">
                  <strong>Что происходит:</strong> Небольшой момент частично контролирует наклон<br>
                  <strong>Движение:</strong> Коронка > Корень (но меньше чем при M/F=0)<br>
                  <strong>Когда используется:</strong> Начальные этапы выравнивания
                </div>
              </div>
            </div>
          </div>

          <div class="clinical-note-box">
            <h4>💡 Практическое применение:</h4>
            <p><strong>Как врач контролирует M/F?</strong></p>
            <ol>
              <li><strong>Размер и форма дуги:</strong> Прямоугольная дуга создает больший момент, чем круглая</li>
              <li><strong>Заполнение паза:</strong> Чем плотнее дуга в пазу, тем больше момент</li>
              <li><strong>Материал дуги:</strong> Жесткие дуги (SS) создают больший момент</li>
              <li><strong>Торк в дуге:</strong> Изгибы в дуге увеличивают момент</li>
              <li><strong>Активация:</strong> Степень активации дуги влияет на соотношение M/F</li>
            </ol>
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
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .highlight-box {
  background: rgba(124, 143, 240, 0.15);
  border-left: 4px solid #7c8ff0;
}

.highlight-box.special {
  background: linear-gradient(135deg, #f0f4ff 0%, #fef0ff 100%);
  border-left: 4px solid #764ba2;
}

.dark-theme .highlight-box.special {
  background: linear-gradient(135deg, rgba(124, 143, 240, 0.2) 0%, rgba(142, 91, 184, 0.2) 100%);
  border-left: 4px solid #8e5bb8;
}

.highlight-box h4 {
  color: #667eea;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.dark-theme .highlight-box h4 {
  color: #9fa8da;
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
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .formula-box {
  background: rgba(255, 193, 7, 0.15);
  border-color: #ffb300;
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
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .force-card,
.dark-theme .movement-card {
  background: rgba(42, 42, 62, 0.6);
  border-left-color: #7c8ff0;
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
  transition: background 0.3s ease;
}

.dark-theme .comparison-table th {
  background: #7c8ff0;
}

.comparison-table tr:hover {
  background: #f8f9fa;
  transition: background 0.3s ease;
}

.dark-theme .comparison-table tr:hover {
  background: rgba(124, 143, 240, 0.1);
}

.dark-theme .comparison-table {
  color: var(--text-color);
}

.dark-theme .comparison-table td {
  border-bottom-color: var(--border-color);
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

/* Дополнительные стили для улучшенных объяснений */
.formula-params {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
}

.param-explain {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .param-explain {
  background: rgba(42, 42, 62, 0.6);
  border-left-color: #7c8ff0;
}

.param-letter-big {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  font-family: 'Times New Roman', serif;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.param-desc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.8;
  color: #2c3e50;
}

.param-desc strong {
  color: #667eea;
  margin-bottom: 0.5rem;
  display: block;
}

.formula-example {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 6px;
  color: #2e7d32;
  font-weight: 500;
}

.clinical-note-box {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 12px;
  border-left: 4px solid #ff9800;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark-theme .clinical-note-box {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.15) 100%);
  border-left-color: #ffb74d;
}

.clinical-note-box h4 {
  color: #e65100;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.dark-theme .clinical-note-box h4 {
  color: #ffb74d;
}

.clinical-note-box ul,
.clinical-note-box ol {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
}

.clinical-note-box li {
  margin: 0.75rem 0;
  line-height: 1.7;
}

.mf-ratio-explanation {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.mf-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 5px solid #667eea;
  transition: all 0.3s ease;
}

.dark-theme .mf-item {
  background: rgba(42, 42, 62, 0.6);
  border-left-color: #7c8ff0;
}

.mf-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.dark-theme .mf-item:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

.mf-item.optimal {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-left-color: #4caf50;
}

.dark-theme .mf-item.optimal {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.15) 100%);
  border-left-color: #66bb6a;
}

.mf-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.5rem;
}

.mf-item.optimal .mf-value {
  color: #2e7d32;
}

.mf-type {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e0e0e0;
}

.mf-desc {
  line-height: 1.9;
  color: #555;
}

.mf-desc strong {
  color: #1e40af;
  font-weight: 600;
}

/* Визуальные примеры с анимацией */
.visual-example {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.dark-theme .visual-example {
  background: rgba(42, 42, 62, 0.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 1rem;
}

.example-item {
  text-align: center;
}

.tooth-diagram {
  position: relative;
  height: 180px;
  background: linear-gradient(to bottom, #e3f2fd 0%, #f5deb3 50%);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tooth-diagram:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.tooth-body {
  position: relative;
  width: 40px;
  height: 120px;
  margin: 1rem auto;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tooth-diagram.tipping-above:hover .tooth-body {
  transform: rotate(-8deg);
  transform-origin: bottom center;
}

.tooth-diagram.bodily:hover .tooth-body {
  transform: translateX(15px);
}

.tooth-diagram.tipping-below:hover .tooth-body {
  transform: rotate(8deg);
  transform-origin: top center;
}

.crown {
  font-size: 2.5rem;
  line-height: 1;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
}

.root {
  width: 20px;
  height: 60px;
  background: linear-gradient(to bottom, #fff8dc, #daa520);
  margin: -5px auto 0;
  border-radius: 0 0 10px 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cr-dot {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #f44336;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.3), 0 0 8px rgba(244, 67, 54, 0.5);
  animation: pulse 2s infinite;
  z-index: 10;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.3), 0 0 8px rgba(244, 67, 54, 0.5);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(244, 67, 54, 0.2), 0 0 12px rgba(244, 67, 54, 0.6);
  }
}

.force-arrow {
  position: absolute;
  left: -30px;
  font-size: 2rem;
  color: #2196f3;
  font-weight: bold;
  animation: slideIn 1.5s ease-in-out infinite;
  text-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
}

.force-arrow.above {
  top: 10px;
}

.force-arrow.at-cr {
  top: 55%;
  transform: translateY(-50%);
}

.force-arrow.below {
  bottom: 10px;
}

@keyframes slideIn {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.7;
  }
  50% {
    transform: translateX(10px);
    opacity: 1;
  }
}

.movement-result {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.3rem;
  font-weight: bold;
  color: #4caf50;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
  animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.example-label {
  font-weight: 600;
  color: #2c3e50;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
}

@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>

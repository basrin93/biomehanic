// Биомеханические расчеты для ортодонтии

/**
 * Расчет положения центра сопротивления (ЦС)
 */
export function calculateCenterOfResistance(
  toothType: 'single' | 'multi',
  rootLength: number,
  boneResorption: number = 0
) {
  // Эффективная длина корня с учетом резорбции кости
  const effectiveLength = rootLength - boneResorption

  let distance: number
  let note: string

  if (toothType === 'single') {
    // Для однокорневых зубов ЦС на 1/3 от апекса
    distance = effectiveLength / 3
    note = 'Для однокорневых зубов ЦС расположен на 1/3 расстояния от апекса до альвеолярного гребня'
  } else {
    // Для многокорневых зубов ЦС в области бифуркации (примерно 1/2)
    distance = effectiveLength / 2
    note = 'Для многокорневых зубов ЦС расположен в области бифуркации корней'
  }

  if (boneResorption > 0) {
    note += `. При резорбции кости на ${boneResorption} мм ЦС смещается апикально.`
  }

  return {
    distance: distance,
    fromApex: effectiveLength - distance,
    effectiveLength: effectiveLength,
    note: note
  }
}

/**
 * Расчет момента на основе соотношения M/F
 */
export function calculateMomentForceRatio(
  force: number,
  ratio: number,
  movementType: 'tipping' | 'bodily' | 'root' | 'custom'
) {
  const moment = force * ratio

  let movementDescription: string

  switch (movementType) {
    case 'tipping':
      movementDescription = 'Наклонно-вращательное перемещение (коронка больше корня)'
      break
    case 'bodily':
      movementDescription = 'Корпусное перемещение (коронка и корень одинаково)'
      break
    case 'root':
      movementDescription = 'Корневое перемещение/торк (корень больше коронки)'
      break
    default:
      movementDescription = 'Пользовательский тип перемещения'
  }

  return {
    moment: moment,
    force: force,
    ratio: ratio,
    movementDescription: movementDescription
  }
}

/**
 * Модули упругости материалов (в ГПа)
 */
const ELASTIC_MODULUS = {
  ss: 200,    // Нержавеющая сталь
  niti: 70,   // Никель-титан
  tma: 65     // TMA (бета-титан)
}

/**
 * Расчет силы ортодонтической дуги
 * Формула: F = (3 × E × I × δ) / L³
 */
export function calculateArchwireForce(
  material: string,
  size: string,
  activeLength: number,
  deflection: number
) {
  const E = ELASTIC_MODULUS[material as keyof typeof ELASTIC_MODULUS]

  // Конвертация размера дуги из дюймов в мм
  let diameter: number
  let isRectangular = false
  let width = 0, height = 0

  if (size.includes('x')) {
    // Прямоугольная дуга
    isRectangular = true
    const [w, h] = size.split('x').map(s => parseFloat(s) * 25.4)
    width = w
    height = h
  } else {
    // Круглая дуга
    diameter = parseFloat(size) * 25.4 // перевод в мм
  }

  // Расчет момента инерции (I)
  let I: number
  if (isRectangular) {
    // Для прямоугольного сечения: I = (b × h³) / 12
    I = (width * Math.pow(height, 3)) / 12
  } else {
    // Для круглого сечения: I = (π × d⁴) / 64
    I = (Math.PI * Math.pow(diameter, 4)) / 64
  }

  // Расчет силы в Ньютонах
  const forceN = (3 * E * 1000 * I * deflection) / Math.pow(activeLength, 3)

  // Конвертация в граммы (1N ≈ 102g)
  const forceG = forceN * 102

  // Оценка силы
  let assessment: string
  let assessmentClass: string
  let note: string

  if (forceG < 25) {
    assessment = 'Очень легкая сила'
    assessmentClass = 'optimal'
    note = 'Подходит для начального выравнивания и легких перемещений'
  } else if (forceG < 150) {
    assessment = 'Оптимальная сила'
    assessmentClass = 'optimal'
    note = 'Физиологичная сила для большинства ортодонтических перемещений'
  } else if (forceG < 300) {
    assessment = 'Умеренная сила'
    assessmentClass = 'warning'
    note = 'Приемлемо для некоторых перемещений, но требует контроля'
  } else {
    assessment = 'Чрезмерная сила'
    assessmentClass = 'danger'
    note = 'Может вызвать резорбцию корня и дискомфорт. Рекомендуется уменьшить силу'
  }

  return {
    force: forceG,
    assessment: assessment,
    assessmentClass: assessmentClass,
    note: note
  }
}

/**
 * Расчет опорных зубов и анализ опоры
 */
export function calculateAnchorage(
  activeTeeth: number,
  anchorTeeth: number,
  activeForce: number
) {
  // Соотношение опоры
  const ratio = `${anchorTeeth}:${activeTeeth}`

  // Реактивная сила на опорные зубы
  const reactionForce = (activeForce * activeTeeth) / anchorTeeth

  // Оценка адекватности опоры
  let assessment: string
  let assessmentClass: string
  let recommendation: string

  const anchorRatio = anchorTeeth / activeTeeth

  if (anchorRatio >= 2) {
    assessment = 'Максимальная опора'
    assessmentClass = 'optimal'
    recommendation = 'Опорные зубы хорошо защищены от нежелательных перемещений'
  } else if (anchorRatio >= 1.5) {
    assessment = 'Умеренная опора'
    assessmentClass = 'optimal'
    recommendation = 'Опора адекватная, возможны минимальные перемещения опорных зубов'
  } else if (anchorRatio >= 1) {
    assessment = 'Минимальная опора'
    assessmentClass = 'warning'
    recommendation = 'Требуется усиление опоры (минивинты, лицевая дуга, небный бюгель)'
  } else {
    assessment = 'Недостаточная опора'
    assessmentClass = 'danger'
    recommendation = 'Критически важно усиление опоры дополнительными средствами'
  }

  return {
    ratio: ratio,
    reactionForce: reactionForce,
    forcePerAnchorTooth: reactionForce / anchorTeeth,
    assessment: assessment,
    assessmentClass: assessmentClass,
    recommendation: recommendation
  }
}

/**
 * Расчет оптимальной силы для перемещения зуба
 */
export function calculateOptimalForce(
  toothType: 'incisor' | 'canine' | 'premolar' | 'molar',
  movementType: 'tipping' | 'bodily' | 'root' | 'rotation' | 'extrusion' | 'intrusion'
): { min: number; max: number; optimal: number; note: string } {
  // Данные основаны на площади корня и типе перемещения
  const forceRanges: Record<string, Record<string, { min: number; max: number; optimal: number }>> = {
    incisor: {
      tipping: { min: 35, max: 60, optimal: 50 },
      bodily: { min: 50, max: 100, optimal: 75 },
      root: { min: 50, max: 100, optimal: 75 },
      rotation: { min: 35, max: 60, optimal: 50 },
      extrusion: { min: 35, max: 60, optimal: 50 },
      intrusion: { min: 10, max: 20, optimal: 15 }
    },
    canine: {
      tipping: { min: 50, max: 75, optimal: 60 },
      bodily: { min: 75, max: 150, optimal: 100 },
      root: { min: 75, max: 150, optimal: 100 },
      rotation: { min: 50, max: 75, optimal: 60 },
      extrusion: { min: 50, max: 75, optimal: 60 },
      intrusion: { min: 15, max: 25, optimal: 20 }
    },
    premolar: {
      tipping: { min: 50, max: 100, optimal: 70 },
      bodily: { min: 70, max: 120, optimal: 90 },
      root: { min: 70, max: 120, optimal: 90 },
      rotation: { min: 50, max: 100, optimal: 70 },
      extrusion: { min: 50, max: 100, optimal: 70 },
      intrusion: { min: 15, max: 30, optimal: 25 }
    },
    molar: {
      tipping: { min: 75, max: 150, optimal: 100 },
      bodily: { min: 100, max: 200, optimal: 150 },
      root: { min: 100, max: 200, optimal: 150 },
      rotation: { min: 75, max: 150, optimal: 100 },
      extrusion: { min: 75, max: 150, optimal: 100 },
      intrusion: { min: 20, max: 40, optimal: 30 }
    }
  }

  const forces = forceRanges[toothType][movementType]

  let note = `Оптимальная сила для ${toothType === 'incisor' ? 'резца' :
                                       toothType === 'canine' ? 'клыка' :
                                       toothType === 'premolar' ? 'премоляра' : 'моляра'} `

  note += `при ${movementType === 'tipping' ? 'наклоне' :
                  movementType === 'bodily' ? 'корпусном перемещении' :
                  movementType === 'root' ? 'корневом перемещении' :
                  movementType === 'rotation' ? 'ротации' :
                  movementType === 'extrusion' ? 'экструзии' : 'интрузии'}`

  return {
    ...forces,
    note: note
  }
}

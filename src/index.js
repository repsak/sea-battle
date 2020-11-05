const FIELD_SIZE = 10
const FIELD_LENGTH = Math.pow(FIELD_SIZE, 2)
let IS_GAME_STARTED = false

const SHIPS = {
  four: [1, 4],
  triple: [2, 3],
  double: [3, 2],
  single: [4, 1],
}

const shipsCount = Object.values(SHIPS).reduce((cur, [next]) => cur + next, 0)
const forRender = Object.values(SHIPS).reduce((cur, [shipCount, shipSize]) => cur.concat([...Array(shipCount)].fill(shipSize)), [])

function clearBattleField(field) {
  for(let x = 0; x < FIELD_SIZE; x++) {
    for(let y = 0; y < FIELD_SIZE; y++) {
      field[x][y] = 0
    }
  }

  return field
}

// !!! Алгоритм генерации бы пошел самому сильному в команде, либо тому кто силен в алгоритмах
function fillBattleField(field) {
  let x, y
  let direction
  let ships = 0

  const ipwd = new Map()

  while (ships < shipsCount) {
    [x, y, direction, position] = getRandomXYD(FIELD_LENGTH)

    if (!ipwd.has(direction)) {
      ipwd.set(direction, new Set())
    }

    if ([...ipwd.values()].every(set => set.size === FIELD_LENGTH)) {
      break
    }

    ipwd.set(direction, ipwd.get(direction).add(position))

    const tmpX = x
    const tmpY = y

    let isPossibleToRender = true

    const currentShipSize = forRender[ships]

    // проверка возможности отрисовки по направлению
    for (let i = 0; i < currentShipSize; i++) {
      if (x < 0 || y < 0 || x === FIELD_SIZE || y === FIELD_SIZE) {
        isPossibleToRender = false
        break
      }

      // условия игры
      if (
        field[x][y] === 1 ||
        field[x][y + 1] === 1 ||
        field[x][y - 1] === 1 ||
        (field[x + 1] && field[x + 1][y] === 1) ||
        (field[x + 1] && field[x + 1][y + 1] === 1) ||
        (field[x + 1] && field[x + 1][y - 1] === 1) ||
        (field[x - 1] && field[x - 1][y] === 1) ||
        (field[x - 1] && field[x - 1][y + 1] === 1) ||
        (field[x - 1] && field[x - 1][y - 1] === 1)
      ) {
        isPossibleToRender = false
        break
      }

      switch (direction) {
        case 0:
          x++
          break
        case 1:
          y++
          break
        case 2:
          x--
          break
        case 3:
          y--
          break
      }
    }

    if (isPossibleToRender) {
      x = tmpX
      y = tmpY
      // отрисовка корабля
      for (let i = 0; i < currentShipSize; i++) {
        field[x][y] = 1
        switch (direction) {
          case 0:
            x++
            break
          case 1:
            y++
            break
          case 2:
            x--
            break
          case 3:
            y--
            break
        }
      }
      ships++
    }
  }
  console.log(fieldToString(field))
  return field
}

/**
 * Получение случайного расположения в матрице
 * @param {number} max
 * @returns {(number)[]}
 */
function getRandomXYD(max) {
  const position = Math.floor(Math.random() * max)
  const x = Math.floor(position / FIELD_SIZE)
  const y = position % FIELD_SIZE

  const direction = Math.floor(Math.random() * 4)

  return [
    Number(x),
    Number(y),
    direction,
    position,
  ]
}

function initBattleField(parentId, field) {
  const parent = document.querySelector(`#${parentId}`)

  // !!! этим можно было рулить через redux/saga
  parent.addEventListener('click', function ({ target: { dataset: { x, y } } }) {
    if (field[x][y] === 1) {
      field[x][y] = 'x'
    } else if (field[x][y] !== 'x') {
      field[x][y] = '.'
    }

    renderField(parent, field)

    if (field.reduce((cur, next) => cur.concat(next), []).every(i => i !== 1)) {
      alert('game over')
    }
  })

  renderField(parent, field)
}

// !!! здесь мог бы быть реакт :-)
function renderField(element, field) {
  element.innerHTML = ''
  const cell = document.createElement('div')
  cell.classList.add('cell')

  for (let row in field) {
    for (let column in field[row]) {
      const clonedCell = cell.cloneNode()
      clonedCell.dataset.x = row
      clonedCell.dataset.y = column

      if (field[row][column] === 1) {
        clonedCell.classList.add('ship')
      }

      if (field[row][column] === '.') {
        clonedCell.classList.add('hit')
      }

      if (field[row][column] === 'x') {
        clonedCell.classList.add('boom')
      }

      element.appendChild(clonedCell)
    }
  }
}

function initGame() {
  const style = `repeat(${FIELD_SIZE}, 1fr)`
  const fields = document.querySelectorAll('.battlefield')

  const userStore = [...Array(FIELD_SIZE)].map(() => Array(FIELD_SIZE).fill(0))
  const computerStore = [...Array(FIELD_SIZE)].map(() => Array(FIELD_SIZE).fill(0))

  const userField = document.querySelector('#user')
  const computerField = document.querySelector('#computer')

  fields.forEach(field => {
    field.style.gridTemplateRows = style
    field.style.gridTemplateColumns = style
  })

  document
    .querySelector('#generateUserBattleField')
    .addEventListener('click', function() {
      clearBattleField(userStore)
      fillBattleField(userStore)
      renderField(userField, userStore)
    })

  document
    .querySelector('#clearUserBattleField')
    .addEventListener('click', function() {
      clearBattleField(userStore)
      renderField(userField, userStore)
    })

  renderField(userField, userStore)
  renderField(computerField, computerStore)
}

initGame()
initBattleField('computer')

function fieldToString(fieyd) {
  return field.reduce((cur, next) => cur += next.map(i => i ? 'x' : '.').join(' ') + '\n', '\n')
}

const FIELD_SIZE = 10

const SHIPS = {
  four: [1, 4],
  triple: [2, 3],
  double: [3, 2],
  single: [4, 1],
}

const shipsCount = Object.values(SHIPS).reduce((cur, [next]) => cur + next, 0)
const forRender = Object.values(SHIPS).reduce((cur, [shipCount, shipSize]) => cur.concat([...Array(shipCount)].fill(shipSize)), [])

// !!! Алгоритм генерации бы пошел самому сильному в команде, либо тому кто силен в алгоритмах
function generateBattleField() {
  const field = [...Array(FIELD_SIZE)].map(() => Array(FIELD_SIZE).fill(0))
  let x, y
  let direction
  let ships = 0

  while (ships < shipsCount) {

    x = getRandom(FIELD_SIZE)
    y = getRandom(FIELD_SIZE)

    const tmpX = x
    const tmpY = y

    direction = getRandom(4) // top, right, bottom, left

    let isPossibleToRender = true

    const currentShipSize = forRender[ships]

    // проверка возможности отрисовки по направлению
    for (let i = 0; i < currentShipSize; i++) {
      if (x <= 0 || y <= 0 || x >= FIELD_SIZE - 1 || y >= FIELD_SIZE) {
        isPossibleToRender = false
        break
      }

      // условия игры
      if (
        field[x][y] === 1 ||
        field[x][y + 1] === 1 ||
        field[x][y - 1] === 1 ||
        field[x + 1][y] === 1 ||
        field[x + 1][y + 1] === 1 ||
        field[x + 1][y - 1] === 1 ||
        field[x - 1][y] === 1 ||
        field[x - 1][y + 1] === 1 ||
        field[x - 1][y - 1] === 1
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

  return field
}

function getRandom(n) {
  return Math.floor(Math.random() * n)
}

function initBattleField(parentId) {
  const parent = document.querySelector(`#${parentId}`)
  const field = generateBattleField() // это могло бы быть в состоянии (redux)

  // !!! этим можно было рулить через redux/saga
  parent.addEventListener('click', function ({ target: { dataset: { x, y } } }) {
    if (field[x][y] === 1) {
      field[x][y] = 'x'
    } else {
      field[x][y] = '.'
    }

    parent.innerHTML = '' // этим бы занялся реакт :-)
    renderField(parent, field)

    if(field.reduce((cur, next) => cur.concat(next), []).every(i => i !== 1)) {
      alert('game over')
    }

  })

  renderField(parent, field)
}

// !!! здесь мог бы быть реакт :-)
function renderField(element, field) {
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

      if(field[row][column] === '.') {
        clonedCell.classList.add('hit')
      }

      if (field[row][column] === 'x') {
        clonedCell.classList.add('boom')
      }

      element.appendChild(clonedCell)
    }
  }
}

initBattleField('user')
initBattleField('computer')

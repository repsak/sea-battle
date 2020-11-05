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

  const ipwd = new Map()

  while (ships < shipsCount) {
    [x, y, direction, position] = getRandomXYD(FIELD_SIZE)

    if (!ipwd.has(direction)) {
      ipwd.set(direction, new Set())
    }

    if ([...ipwd.values()].every(set => set.size === 100)) {
      break
    }

    ipwd.set(direction, ipwd.get(direction).add(position))

    direction = getRandom(4)

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

  return field.reduce((cur, next) => cur += next.map(i => i ? 'x' : '.').join(' ') + '\n', '\n')
}

/**
 * Получение случайного расположения в матрице
 * @param {number} fieldSize
 * @returns {(number)[]}
 */
function getRandomXYD(fieldSize) {
  const size = Math.pow(fieldSize, 2)
  const position = Math.floor(Math.random() * size)
  const [x, y = 0] = String(position / 10).split('.')

  const direction = getRandom(4)

  return [
    Number(x),
    Number(y),
    direction,
    position,
  ]
}

function getRandom(n) {
  return Math.floor(Math.random() * n)
}

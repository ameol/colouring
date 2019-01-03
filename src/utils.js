export function isContinuity (arr, count) {
  const result = []
  if (!arr instanceof Array || arr.length === 0) {
    return result
  }
  let i = 0
  result[i] = [arr[0]];
  arr.reduce((prev, cur) => {
    cur-prev === 1 ? result[i].push(cur) : result[++i] = [cur]
    return cur
  })
  return result.filter((item) => item.length >= count)
}


function getRandom (num) {
  return Math.floor(Math.random() * num)
}

function checkList (x, y, blocks, size) {
  const xList = blocks.filter((item) => item.startsWith(`${x},`))
  const yList = blocks.filter((item) => item.endsWith(`,${y}`))
  if (xList.length >= size / 2 || yList.length >= size / 2) {
    return false
  } 
  const xs = xList.filter((item) => {
    const num = Number(item.split(',')[1])
    return Math.abs(y - num) === 1 || Math.abs(y - num) === 2
  })
  if (xs.length >= 2) {
    return false
  }
  const ys = yList.filter((item) => {
    const num = Number(item.split(',')[0])
    return Math.abs(x - num) === 1 || Math.abs(x - num) === 2
  })
  if (ys.length >= 2) {
    return false
  }
  return true
}
export function createRandomPoints (size, degree) {
  const randomBlocksCount = Math.floor(size * size * degree / 8)
  let blacksCount = getRandom(randomBlocksCount)
  let whitesCount = randomBlocksCount - blacksCount

  const blacks = []
  const whites = []
  
  while (blacksCount > 0) {
    const x = getRandom(size)
    const y = getRandom(size)
    const item = `${x},${y}`
    if (!blacks.includes(item) && !whites.includes(item) && checkList(x, y, blacks, size)) {
      blacks.push(item)
      blacksCount--
    }
  }
  while (whitesCount > 0) {
    const x = getRandom(size)
    const y = getRandom(size)
    const item = `${x},${y}`
    if (!blacks.includes(item) && !whites.includes(item) && checkList(x, y, whites, size)) {
      whites.push(item)
      whitesCount--
    }
  }
  return { blacks, whites }
}
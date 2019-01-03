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
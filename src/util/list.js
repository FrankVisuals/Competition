export const sortBy = (arr, field, order = 1) => {
  arr.sort((a, b) => (a[field] > b[field] ? -1 * order : 1 * order))
}

export const unifyIndex = (arr, field) => {
  arr.forEach((entry, index) => {
    entry[field] = index
  })
}

export const moveInIndex = (arr, from, delta) => {
  const element = arr[from]
  arr.splice(from, 1)
  arr.splice(from + delta, 0, element)
}

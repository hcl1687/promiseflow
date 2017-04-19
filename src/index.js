import type from './type'

function series (arr, Promise, inData) {
  if (type(arr) !== 'array') {
    return Promise.resolve(null)
  }

  if (arr.length === 0) {
    return Promise.resolve(null)
  }

  return arr.reduce((promise, item) => {
    if (type(item) === 'function') {
      return promise.then(item)
    } else if (item.then && type(item.then) === 'function') {
      return promise.then(() => {
        return item
      })
    } else if (type(item) === 'array') {
      return promise.then(data => {
        return series(item, data)
      })
    } else if (type(item) === 'object') {
      return promise.then(data => {
        return parallel(item, data)
      })
    }

    return Promise.resolve(null)
  }, Promise.resolve(inData))
}

function parallel (obj, Promise, inData) {
  if (type(obj) !== 'object') {
    return Promise.resolve(null)
  }

  const keys = Object.keys(obj)
  if (keys.length === 0) {
    return Promise.resolve(null)
  }

  const arr = keys.map(key => {
    const item = obj[key]
    if (type(item) === 'function') {
      return item(inData)
    } else if (item.then && type(item.then) === 'function') {
      return item
    } else if (type(item) === 'array') {
      return series(item, inData)
    } else if (type(item) === 'object') {
      return parallel(item, inData)
    }

    return Promise.resolve(null)
  })

  return Promise.all(arr)
    .then(data => {
      const ret = {}
      keys.forEach((key, i) => {
        ret[key] = data[i]
      })
      return ret
    })
}

export default function runFlow (flows, Promise, inData) {
  if (type(flows) === 'array') {
    return series(flows, Promise, inData)
  } else if (type(flows) === 'object') {
    return parallel(flows, Promise, inData)
  }

  return Promise.resolve(null)
}

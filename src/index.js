import type from './type'
import { reduce, map, forEach, keys as objKeys } from './utils'
let Promise = null

function handleData (data) {
  if (data !== undefined && data !== null && data.__flow__) {
    return runFlow(data.flows, data.inData)
  }
  return data
}

function series (arr, inData) {
  if (type(arr) !== 'array') {
    return Promise.resolve(null)
  }

  if (arr.length === 0) {
    return Promise.resolve(null)
  }

  return reduce(arr, (promise, item) => {
    promise = promise.then(handleData)

    if (type(item) === 'function') {
      return promise.then(item)
    } else if (item && item.then && type(item.then) === 'function') {
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

function parallel (obj, inData) {
  if (type(obj) !== 'object') {
    return Promise.resolve(null)
  }

  const keys = objKeys(obj)
  if (keys.length === 0) {
    return Promise.resolve(null)
  }

  const arr = map(keys, key => {
    const item = obj[key]
    if (type(item) === 'function') {
      return Promise.resolve(handleData(inData)).then(item).then(handleData)
    } else if (item && item.then && type(item.then) === 'function') {
      return item.then(handleData)
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
      forEach(keys, (key, i) => {
        ret[key] = data[i]
      })
      return ret
    })
}

function runFlow (flows, inData) {
  if (type(flows) === 'array') {
    return series(flows, inData)
  } else if (type(flows) === 'object') {
    return parallel(flows, inData)
  }

  return Promise.resolve(null)
}

export default function flowFactory (promise) {
  if (!promise) {
    throw new Error('should provied a Promise Object')
  }
  Promise = promise
  return runFlow
}

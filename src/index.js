import type from './type'
import { reduce, map, forEach, keys as objKeys } from './utils'
let Promise = null

function handleData (data) {
  if (data !== undefined && data !== null && data.__flow__) {
    return runFlow(data.flows, data.inData, data.callback)
  }
  return data
}

function series (arr, inData, callback) {
  inData = Promise.resolve(handleData(inData))

  if (type(arr) !== 'array') {
    return inData
  }

  if (arr.length === 0) {
    return inData
  }

  return reduce(arr, (promise, item, index) => {
    if (callback) {
      item = callback(item, index, arr)
    }
    if (type(item) === 'function') {
      return promise.then(item).then(handleData)
    } else if (item && item.then && type(item.then) === 'function') {
      return promise.then(() => {
        return item
      }).then(handleData)
    } else if (type(item) === 'array') {
      return promise.then(data => {
        return series(item, data, callback)
      })
    } else if (type(item) === 'object') {
      return promise.then(data => {
        return parallel(item, data, callback)
      })
    }

    return Promise.resolve(null)
  }, inData)
}

function parallel (obj, inData, callback) {
  const inDataPromise = Promise.resolve(handleData(inData))
  if (type(obj) !== 'object') {
    return inDataPromise
  }

  const keys = objKeys(obj)
  if (keys.length === 0) {
    return inDataPromise
  }

  return inDataPromise.then((plainData) => {
    const arr = map(keys, key => {
      let item = obj[key]
      if (callback) {
        item = callback(item, key, obj)
      }

      if (type(item) === 'function') {
        return Promise.resolve(plainData).then(item).then(handleData)
      } else if (item && item.then && type(item.then) === 'function') {
        return item.then(handleData)
      } else if (type(item) === 'array') {
        return series(item, plainData, callback)
      } else if (type(item) === 'object') {
        return parallel(item, plainData, callback)
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
  })
}

function runFlow (flows, inData, callback) {
  if (type(flows) === 'array') {
    return series(flows, inData, callback)
  } else if (type(flows) === 'object') {
    return parallel(flows, inData, callback)
  }

  return Promise.resolve(handleData(inData))
}

export default function flowFactory (promise) {
  if (!promise) {
    throw new Error('should provied a Promise Object')
  }
  Promise = promise
  return runFlow
}

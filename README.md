# promiseflow
  provides series and parallel flow control for promise.
  using Array to represent tasks in series.
  using Object to represent tasks in parallel.

  ![series_parallel_input](https://raw.githubusercontent.com/hcl1687/promiseflow/master/img/series_parallel_input.png)


## install
  npm install promiseflow

## Example

### series demo

![series](https://raw.githubusercontent.com/hcl1687/promiseflow/master/img/series.png)

```js
import flowFactory from 'promiseflow'
import Promise from 'es6-promise'
const runFlow = flowFactory(Promise)

const initData = 1
const fun1 = function (data) {
  // expect(data).to.be.equal(1)
  return data + 1
}
const fun2 = function (data) {
  // expect(data).to.be.equal(2)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + 2)
    }, 50)
  })
}
const arr = [fun1, fun2]
runFlow(arr, initData).then(data => {
  // expect(data).to.be.equal(4)
  done()
})
```

### parallel demo

![parallel](https://raw.githubusercontent.com/hcl1687/promiseflow/master/img/parallel.png)

```js
import flowFactory from 'promiseflow'
import Promise from 'es6-promise'
const runFlow = flowFactory(Promise)

const initData = 1
const fun1 = function (data) {
  // expect(data).to.be.equal(1)
  return data + 1
}
const fun2 = function (data) {
  // expect(data).to.be.equal(1)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + 2)
    }, 50)
  })
}
const fun3 = function (data) {
  // expect(data).to.be.equal(1)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + 3)
    }, 50)
  })
}
const obj = { fun1, fun2, fun3 }
let promise = runFlow(obj, initData)
promise.then(data => {
  // expect(data.fun1).to.be.equal(2)
  // expect(data.fun2).to.be.equal(3)
  // expect(data.fun3).to.be.equal(4)
  // done()
})
```

### series + parallel demo

![series_parallel](https://raw.githubusercontent.com/hcl1687/promiseflow/master/img/series_parallel.png)

```js
import flowFactory from 'promiseflow'
import Promise from 'es6-promise'
const runFlow = flowFactory(Promise)

const initData = 1
const fun1 = function (data) {
  // expect(data).to.be.equal(1)
  return data + 1
}
const fun2 = function (data) {
  // expect(data).to.be.equal(2)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + 2)
    }, 50)
  })
}
const fun3 = function (data) {
  // expect(data).to.be.equal(2)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + 3)
    }, 50)
  })
}
const fun4 = function (data) {
  // expect(data.fun2).to.be.equal(4)
  // expect(data.fun3).to.be.equal(5)
  return data.fun2 + data.fun3
}
const arr = [fun1, {
  fun2, fun3
}, fun4]
runFlow(arr, initData).then(data => {
  // expect(data).to.be.equal(9)
  // done()
})
```

### sub flows demo

![sub_flow](https://raw.githubusercontent.com/hcl1687/promiseflow/master/img/sub_flow.png)

```js
import flowFactory from 'promiseflow'
import Promise from 'es6-promise'
const runFlow = flowFactory(Promise)

const inData = 1
const subFlows = [{
  sub1: ret => {
    return ret + 1
  },
  sub2: ret => {
    return ret + 2
  }
}, ret => {
  return ret.sub1 + ret.sub2
}]
const fun1 = function (data) {
  // expect(data).to.be.equal(1)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        __flow__: true,
        flows: subFlows,
        inData: data + 1
      })
    }, 50)
  })
}
const fun2 = function (data) {
  // expect(data).to.be.equal(7)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + 2)
    }, 50)
  })
}
const arr = [fun1, fun2]
runFlow(arr, inData).then(data => {
  // expect(data).to.be.equal(9)
  // done()
})
```

## License
[MIT](https://opensource.org/licenses/mit-license.php)

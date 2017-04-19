#promiseflow

## install
  npm install promiseflow

### Example

## series demo

![series](https://raw.githubusercontent.com/hcl1687/promiseflow/master/img/series.png)

```js
import runFlow from '../src/index'
import Promise from 'nd-promise'

const fun1 = function (data) {
  expect(data).to.be.equal(1)
  return data + 1
}
const fun2 = function (data) {
  expect(data).to.be.equal(2)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + 2)
    }, 50)
  })
}
const arr = [fun1, fun2]
runFlow(arr, Promise, 1).then(data => {
  expect(data).to.be.equal(4)
  done()
})
```

### License
[MIT](https://opensource.org/licenses/mit-license.php)

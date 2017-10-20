import flowFactory from '../src/index'
import Promise from 'nd-promise'
const runFlow = flowFactory(Promise)

describe('test runFlow', function () {
  it('run arr functon immediately', () => {
    const fun1 = function (data) {
      expect(data).to.be.equal(1)
      return data + 1
    }
    const fun2 = function (data) {
      expect(data).to.be.equal(2)
      return data + 2
    }
    const arr = [fun1, fun2]
    runFlow(arr, 1)
  })

  it('run arr function deferred', done => {
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
    runFlow(arr, 1).then(data => {
      expect(data).to.be.equal(4)
      done()
    })
  })

  it('run arr promise deferred', done => {
    const promise1 = Promise.resolve(1)
    const promise2 = new Promise(resolve => {
      setTimeout(() => {
        resolve(2)
      }, 50)
    })
    const arr = [promise1, promise2]
    runFlow(arr, 1).then(data => {
      expect(data).to.be.equal(2)
      done()
    })
  })

  it('run arr arr deferred', done => {
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
    const fun3 = function (data) {
      expect(data).to.be.equal(4)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 3)
        }, 50)
      })
    }
    const arr = [fun1, [fun2, fun3]]
    runFlow(arr, 1).then(data => {
      expect(data).to.be.equal(7)
      done()
    })
  })

  it('run arr obj deferred', function (done) {
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
    const fun3 = function (data) {
      expect(data).to.be.equal(2)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 3)
        }, 50)
      })
    }
    const fun4 = function (data) {
      expect(data.fun2).to.be.equal(4)
      expect(data.fun3).to.be.equal(5)
      return data.fun2 + data.fun3
    }
    const arr = [fun1, {
      fun2, fun3
    }, fun4]
    runFlow(arr, 1).then(data => {
      expect(data).to.be.equal(9)
      done()
    })
  })

  it('run obj function deferred', function (done) {
    const fun1 = function (data) {
      expect(data).to.be.equal(1)
      return data + 1
    }
    const fun2 = function (data) {
      expect(data).to.be.equal(1)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 2)
        }, 50)
      })
    }
    const fun3 = function (data) {
      expect(data).to.be.equal(1)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 3)
        }, 50)
      })
    }
    const arr = {fun1, fun2, fun3}
    let promise = runFlow(arr, 1)
    promise.then(data => {
      expect(data.fun1).to.be.equal(2)
      expect(data.fun2).to.be.equal(3)
      expect(data.fun3).to.be.equal(4)
      done()
    })
  })

  it('run obj promise deferred', function (done) {
    const promise1 = Promise.resolve(1)
    const promise2 = new Promise(resolve => {
      setTimeout(() => {
        resolve(2)
      }, 50)
    })
    const arr = { promise1, promise2 }
    let promise = runFlow(arr, 1)
    promise.then(data => {
      expect(data.promise1).to.be.equal(1)
      expect(data.promise2).to.be.equal(2)
      done()
    })
  })

  it('run obj object deferred', function (done) {
    const fun1 = function (data) {
      expect(data).to.be.equal(1)
      return data + 1
    }
    const fun2 = function (data) {
      expect(data).to.be.equal(1)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 2)
        }, 50)
      })
    }
    const fun3 = function (data) {
      expect(data).to.be.equal(1)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 3)
        }, 50)
      })
    }
    const arr = {
      fun1,
      fun4: { fun2, fun3 }
    }
    let promise = runFlow(arr, 1)
    promise.then(data => {
      expect(data.fun1).to.be.equal(2)
      expect(data.fun4.fun2).to.be.equal(3)
      expect(data.fun4.fun3).to.be.equal(4)
      done()
    })
  })

  it('run obj arr deferred', function (done) {
    const fun1 = function (data) {
      expect(data).to.be.equal(1)
      return data + 1
    }
    const fun2 = function (data) {
      expect(data).to.be.equal(1)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 2)
        }, 50)
      })
    }
    const fun3 = function (data) {
      expect(data).to.be.equal(3)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 3)
        }, 50)
      })
    }
    const arr = {
      fun1,
      fun4: [fun2, fun3]
    }
    runFlow(arr, 1).then(data => {
      expect(data.fun1).to.be.equal(2)
      expect(data.fun4).to.be.equal(6)
      done()
    })
  })

  it('run null', function (done) {
    runFlow(null, 1).then(data => {
      expect(data).to.be.equal(null)
      done()
    })
  })

  it('run empty arr', function (done) {
    const arr = []
    runFlow(arr, 1).then(data => {
      expect(data).to.be.equal(null)
      done()
    })
  })

  it('run empty obj', function (done) {
    const arr = {}
    runFlow(arr, 1).then(data => {
      expect(data).to.be.equal(null)
      done()
    })
  })

  it('run arr item null', function (done) {
    const arr = [null]
    runFlow(arr, 1).then(data => {
      expect(data).to.be.equal(null)
      done()
    })
  })

  it('run obj item null', function (done) {
    const arr = {
      fun1: null
    }
    runFlow(arr, 1).then(data => {
      expect(data.fun1).to.be.equal(null)
      done()
    })
  })

  it('run innerFlow: inData+array', function (done) {
    const inData = {
      __flow__: true,
      flows: [function (data) {
        expect(data).to.be.equal(1)
        return data + 1
      }, function (data) {
        expect(data).to.be.equal(2)
        return data + 1
      }],
      inData: 1
    }
    const fun1 = function (data) {
      expect(data).to.be.equal(3)
      return data + 1
    }
    const fun2 = function (data) {
      expect(data).to.be.equal(4)
      return data + 2
    }
    const arr = [fun1, fun2]
    runFlow(arr, inData).then(data => {
      expect(data).to.be.equal(6)
      done()
    })
  })

  it('run innerFlow: array', function (done) {
    const inData = 1
    const fun1 = function (data) {
      expect(data).to.be.equal(1)
      return {
        __flow__: true,
        flows: [function (data) {
          expect(data).to.be.equal(2)
          return data + 1
        }, function (data) {
          expect(data).to.be.equal(3)
          return data + 1
        }],
        inData: data + 1
      }
    }
    const fun2 = function (data) {
      expect(data).to.be.equal(4)
      return data + 2
    }
    const arr = [fun1, fun2]
    runFlow(arr, inData).then(data => {
      expect(data).to.be.equal(6)
      done()
    })
  })

  it('run innerFlow: inData+object', function (done) {
    const inData = {
      __flow__: true,
      flows: {
        sub1: function (data) {
          expect(data).to.be.equal(1)
          return data + 1
        },
        sub2: function (data) {
          expect(data).to.be.equal(1)
          return data + 2
        }
      },
      inData: 1
    }
    const fun1 = function (data) {
      expect(data.sub1).to.be.equal(2)
      expect(data.sub2).to.be.equal(3)
      return data.sub1 + data.sub2 + 1
    }
    const fun2 = function (data) {
      expect(data).to.be.equal(6)
      return data + 2
    }
    const arr = [fun1, fun2]
    runFlow(arr, inData).then(data => {
      expect(data).to.be.equal(8)
      done()
    })
  })

  it('run innerFlow: array+object', function (done) {
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
      expect(data).to.be.equal(1)
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
      expect(data).to.be.equal(7)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 2)
        }, 50)
      })
    }
    const arr = [fun1, fun2]
    runFlow(arr, inData).then(data => {
      expect(data).to.be.equal(9)
      done()
    })
  })
})

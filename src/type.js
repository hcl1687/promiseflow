const types = 'Boolean Number String Function Array Date RegExp Object Error'.split(' ')
const class2type = {}
types.forEach(name => {
  class2type['[object ' + name + ']'] = name.toLowerCase()
})

export default function type (obj) {
  if (obj === null) {
    return obj + ''
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj
}

var EventEmitter = require('events').EventEmitter
var event = new EventEmitter()


module.exports = {
  emit: (eventName, data) => {
    // console.log('emit--->',eventName,data)
    event.emit(eventName, data)
  },
  on: (eventName, fn) => {
    // console.log('listen--->', eventName)
    event.on(eventName, fn)
  },
  getEvent: () => {
    return event
  }
}
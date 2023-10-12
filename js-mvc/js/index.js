class Subscribers extends Set {
  constructor() {
    super()
    this.topics = new Map()
  }

  setTopic(name, notifyFn) {
    if (this.topics.has(name)) {
      this.topics.get(name).add(notifyFn)
    } else {
      this.topics.set(name, new Set([notifyFn]))
    }
  }

  toJSON() {
    // root level
    let getNotifyFnName = fn => (fn.name || fn.toString()).concat('()')
    let fnNames = Array.from(this.keys()).map(getNotifyFnName)

    // topic level
    for (const [topic, subscribers] of this.topics) {
      subscribers.forEach(notify => fnNames.push(`${topic}:${getNotifyFnName(notify)}`))
    }

    return fnNames
  }
}

const State = {
  subscribers: new Subscribers(),
  subscribe(callbackFn, topics = []) {
    if (!topics.length) {
      this.subscribers.add(callbackFn)
    } else for (const topic of topics) { 
      this.subscribers.setTopic(topic, callbackFn)
    }
  },
  unsubscribe(callbackFn) {
    this.subscribers.delete(callbackFn)
    this.subscribers.topics.forEach(topic => {
      topic.delete(callbackFn)
    })
  },
  notify(target) { 
    // notify all
    this.subscribers.forEach(notify => notify())

    // notify topic subscribers
    if (target && this.subscribers.topics.has(target))  {
      this.subscribers.topics.get(target).forEach(notify => notify())
    }
  }
}

/* Simple hash function. */
function hash(object) {
  var string = JSON.stringify(object)
  var a = 1, c = 0, h, o

  if (string) {
    a = 0
    for (h = string.length - 1; h >= 0; h--) {
      o = string.charCodeAt(h)
      a = (a << 6 & 268435455) + o + (o << 14)
      c = a & 266338304
      a = c !== 0 ? a^c >> 21 : a
    }
  }
  return String(a)
}

function repository(collection, notify) {
  const genId = item => item.id || hash(item)

  // collection.add(target)(item)
  collection.add = function(target) {
    return function(item) {
      collection[target][genId(item)] = item
      notify(target)
    }
  }

  // collection.remove(target)(item)
  collection.remove = function(target) {
    return function(item) {
      delete collection[target][genId(item)]
      notify(target)
    }
  }

  // collection.target.add / remove
  for (const target of Object.keys(collection)) {
    collection[target].add = collection.add(target)
    collection[target].remove = collection.remove(target)
  }

  return collection
}

State.data = repository({
  foo: {},
  bar: {}
}, (target) => State.notify(target)) 

function renderA() {
  document
    .getElementById('foo')
    .innerHTML = (`<pre>${JSON.stringify(State.data.foo, null, 2)}</pre><hr/>`)
}

function renderB() {
  document
    .getElementById('bar')
    .innerHTML = (`<pre>${JSON.stringify(State.data.bar, null, 2)}</pre><hr/>`)
}

function debug(info) {
  document
    .getElementById('debug')
    .innerHTML = (`<pre>${JSON.stringify(info, null, 2)}</pre><hr/>`)
}

function debugState() {
  debug(State)
}

// subscribe first time
State.subscribe(debugState)
State.subscribe(renderA, ['a'])
State.subscribe(renderB, ['b'])
debugState()

document.getElementById('subscribe')
  .onclick = () => {
    State.subscribe(debugState)
    State.subscribe(renderA, ['a'])
    State.subscribe(renderB, ['b'])
    debugState()
  }

document.getElementById('unsubscribe')
  .onclick = () => {
    State.unsubscribe(debugState)
    State.unsubscribe(renderA)
    State.unsubscribe(renderB)
    debugState()
  }

let fooId = 1
document.getElementById('add-foo')
  .onclick = () => State.data.add('foo')({ name: 'foo_' + (fooId++) })

document.getElementById('remove-foo')
  .onclick = () => State.data.remove('foo')({ name: 'foo_' + (--fooId) })

let barId = 1
document.getElementById('add-bar')
  .onclick = () => State.data.add('bar')({ name: 'bar_' + (barId++) })

document.getElementById('remove-bar')
  .onclick = () => State.data.remove('bar')({ name: 'bar_' + (--barId) })

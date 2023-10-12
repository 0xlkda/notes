class Subscribers extends Set {
  constructor() {
    super()
    this.topics = new Map()
  }

  setTopic(topic, notifyFn) {
    if (this.topics.has(topic)) {
      this.topics.get(topic).add(notifyFn)
    } else {
      this.topics.set(topic, new Set([notifyFn]))
    }
  }

  toJSON() {
    // root level
    let getNotifyFnName = fn => (fn.name || fn.toString()).concat('()')
    let fnNames = Array.from(this.keys()).map(getNotifyFnName)

    // topics level
    for (const [topic, notifyFns] of this.topics) {
      notifyFns.forEach(notify => fnNames.push(`${topic}:${getNotifyFnName(notify)}`))
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
  notify(topic) { 
    // notify all
    this.subscribers.forEach(notify => notify())

    // notify topic subscribers
    if (topic && this.subscribers.topics.has(topic))  {
      this.subscribers.topics.get(topic).forEach(notify => notify())
    }
  }
}

function repository(topics, notify) {
  const genId = item => item.id || hash(item)

  // topics.add(topic)(item)
  topics.set = function(topic) {
    return function(item) {
      topics[topic][genId(item)] = item
      notify(topic)
    }
  }

  // topics.remove(topic)(item)
  topics.delete = function(topic) {
    return function(item) {
      delete topics[topic][genId(item)]
      notify(topic)
    }
  }

  // topics.topic.add / remove
  for (const topic of Object.keys(topics)) {
    topics[topic].set = topics.set(topic)
    topics[topic].delete = topics.delete(topic)
  }

  return topics
}

// setup State.data topics: foo, bar
State.data = repository({
  foo: {},
  bar: {}
}, (topic) => State.notify(topic)) 

// subscribe first time
State.subscribe(renderState)
State.subscribe(renderFoo, ['foo']) // renderFoo if topic: foo changed
State.subscribe(renderBar, ['bar']) // renderBar if topic: bar changed

// render initial state
renderState()
renderFoo()
renderBar()

//
// Everything below is helper functions
//

// Simple hash function
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

function renderFoo() {
  document
    .getElementById('foo')
    .innerHTML = (`<pre>${JSON.stringify(State.data.foo, null, 2)}</pre><hr/>`)
}

function renderBar() {
  document
    .getElementById('bar')
    .innerHTML = (`<pre>${JSON.stringify(State.data.bar, null, 2)}</pre><hr/>`)
}

function renderInfo(info) {
  document
    .getElementById('debug')
    .innerHTML = (`<pre>${JSON.stringify(info, null, 2)}</pre><hr/>`)
}

function renderState() {
  renderInfo(State)
}

document.getElementById('subscribe')
  .onclick = () => {
    State.subscribe(renderState)
    State.subscribe(renderFoo, ['foo'])
    State.subscribe(renderBar, ['bar'])

    document.getElementById('toggle-foo').checked = true
    document.getElementById('toggle-bar').checked = true

    // render latest state
    renderState()
    renderFoo()
    renderBar()
  }

document.getElementById('unsubscribe')
  .onclick = () => {
    State.unsubscribe(renderState)
    State.unsubscribe(renderFoo)
    State.unsubscribe(renderBar)

    document.getElementById('toggle-foo').checked = false
    document.getElementById('toggle-bar').checked = false

    // render latest state
    renderState()
    renderFoo()
    renderBar()
  }

let fooId = 1
let subscribedFoo = true
document.getElementById('toggle-foo')
  .onchange = (e) => {
    e.target.checked 
      ? State.subscribe(renderFoo, ['foo'])
      : State.unsubscribe(renderFoo)

    const text = e.target.checked 
      ? 'Unsubscribe Foo'
      : 'Subscribe Foo'

    document.getElementById('toggle-foo-label').innerText = text
    renderFoo()
  }

document.getElementById('set-foo')
  .onclick = () => State.data.foo.set({ name: 'foo_' + (fooId++) })

document.getElementById('delete-foo')
  .onclick = () => State.data.foo.delete({ name: 'foo_' + (--fooId) })

let barId = 1
let subscribedBar = true
document.getElementById('toggle-bar')
  .onchange = (e) => {
    e.target.checked 
      ? State.subscribe(renderBar, ['bar'])
      : State.unsubscribe(renderBar)

    const text = e.target.checked 
      ? 'Unsubscribe Bar'
      : 'Subscribe Bar'

    document.getElementById('toggle-bar-label').innerText = text
    renderBar()
  }

document.getElementById('set-bar')
  .onclick = () => State.data.bar.set({ name: 'bar_' + (barId++) })

document.getElementById('delete-bar')
  .onclick = () => State.data.bar.delete({ name: 'bar_' + (--barId) })

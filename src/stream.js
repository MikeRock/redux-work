import React, { Component, createContext } from 'react'
import { setObservableConfig, componentFromStream, compose, withProps, withContext, mapPropsStream } from 'recompose'
import config from 'recompose/rxjsObservableConfig'
import Rx from 'rxjs'

setObservableConfig(config)

const typewriter = (speed, sentence) => compose(withProps(baseProps => ({ sentence })),
  mapPropsStream(props$ => {
    const stream$ = Rx.Observable.from(sentence)
    return props$.combineLatest(stream$.zip(Rx.Observable.interval(speed), (letter) => letter).scan((acc, el) => acc + el, '').map(el => ({ sentence: el })), (props, letter) => ({ ...props, ...letter }))
  }
  ))
const count = (interval = 1000) => compose(withProps(baseProps => ({ count: [] })), mapPropsStream(props$ => {
  const buffer = Rx.Observable.interval(1000).bufferWhen((() => Rx.Observable.interval(5000)))
  return props$.combineLatest(buffer.map(item => ({ count: item })), (props, buffer) => ({ ...props, ...buffer }))
}))
const counter = speed => compose(withProps(baseProps => ({ counter: 0 })),
  mapPropsStream(props$ => {
    const stream$ = Rx.Observable.interval(speed)
    return props$.combineLatest(stream$.map(item => ({ counter: item })), (props, counter) => ({ ...props, ...counter }))
  })
)

const _withContext = (initialContext) => (_Component) => class Comp extends Component {
  constructor(...args) {
    super(...args)
    this.context = createContext(initialContext)
    this.state = {}
  }
  render() {
    const keys = Object.keys(initialContext)
    return
    <this.context.Provider value={{ test: 'test' }}>
      <this.context.Consumer>
        {({ test }) => <_Component test={test} />}
      </this.context.Consumer>
    </this.context.Provider>
  }
}
export default count(5000, 'TEST')(({ count }) => {
  return (<div>{count}</div>)
})




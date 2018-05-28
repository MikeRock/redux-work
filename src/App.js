import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import saga from './saga'
import Consumer from './components/Consumer'
import Counter from './stream'

const sagaMiddleware = createSagaMiddleware()
const reducer = (store = {}, action) => {
  if (action.type == 'DOUBLE_CLICK') {
    return { ...store, prop: action.payload }
  }
  return store;
}
const store = applyMiddleware(sagaMiddleware)(createStore)(reducer)
sagaMiddleware.run(saga)
class App extends Component {
  constructor(...args) {
    super(...args)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    store.dispatch({ type: "CLICK", payload: "TEST_CLICK" })
  }
  render() {
    console.log(store.getState())
    return (
      < Provider store={store} >
        <div className="App">
          <Counter test="TEST" />
          <button onClick={this.handleClick}>SAGA</button>
          <Consumer />
        </div>
      </Provider >
    );
  }
}

export default App;

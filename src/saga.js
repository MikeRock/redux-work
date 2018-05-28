import { call, put, race, all, takeEvery, takeLatest, take, fork, actionChannel } from 'redux-saga/effects'
import { delay, buffers, eventChannel } from 'redux-saga'
import { DOUBLE_CLICK, CLICK_START, CLICK_END, CLICK } from './actions'

const filters = {
  THROTTLE: '_THROTTLE',
  AUDIT: '_AUDIT',
  DEBOUNCE: '_DEBOUNCE',
}
// Detect multiple clicks
const multiple = times => (actionType, timeout = 300) => function* (action) {
  let [actions, out] = yield race([all(Array(times).fill().map(_ => take(actionType))), call(delay, timeout)])
  if (actions) {
    yield put({ type: `DOUBLE_CLICK`, payload: `Clicked ${actions.length} times` })
  }
}
const double = multiple(2)

export default function* rootSaga() {
  const chan = yield actionChannel('CLICK', buffers.sliding(3))
  while (true) {
    yield call(filter(1000), chan)
  }
}
const compose = (...args) => saga => args.reduce((f, g) => g(f), saga)

const lazy = (timeout = 1000) => saga => function* (action) {
  yield call(delay, timeout)
  yield fork(saga)
}

const watcher = (...sagas) => function* (action) {
  while (true) {
    yield all(sagas.forEach(saga => fork(saga)))
  }
}

const filter = (timeout = 1000, type = filters.THROTTLE) => function* (chan) {
  let action = yield take(chan)
  let start = Date.now()
  while (start + timeout > Date.now()) {
    if (type === filters.AUDIT) action = yield take(chan)
  }
  yield put({ type: 'FILTERED' })
}

const addEventChannel = (event, element = document) => {
  return eventChannel(emit => {
    const callback = e => {
      emit({ ...e, type: 'EVENT' })
    }
    element.addEventListener(event, callback)
    const unsubscribe = () => {
      element.removeEventListener(event, callback)
    }
    return unsubscribe
  })
}




import { all } from 'redux-saga/effects'

import videoRoomSaga from './videoRoom';

export default function* rootSaga() {
  yield all([
    videoRoomSaga()
  ])
}
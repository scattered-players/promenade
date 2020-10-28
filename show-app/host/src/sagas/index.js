import { all } from 'redux-saga/effects'

import audioBridgeSaga from './audioBridge';
import videoRoomSaga from './videoRoom';

export default function* rootSaga() {
  yield all([
    audioBridgeSaga(),
    videoRoomSaga()
  ])
}
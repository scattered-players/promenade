import { all } from 'redux-saga/effects'

import echoTestSaga from './echoTest';
import videoRoomSaga from './videoRoom';
import streamingSaga from './streaming';

export default function* rootSaga() {
  yield all([
    echoTestSaga(),
    videoRoomSaga(),
    streamingSaga()
  ])
}
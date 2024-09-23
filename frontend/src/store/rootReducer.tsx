import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorReducer from './errorReducer';
import sessionReducer from './sessionReducer';
import journalReducer from './journalReducer';

const rootReducer = combineReducers({
  user: userReducer,
  error: errorReducer,
  session: sessionReducer,
  journal: journalReducer,
});

export default rootReducer;
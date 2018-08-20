import { LOGIN_AUTH } from '../actions/types';

const initialState = {
  login:{}
};

export default function(state = initialState, action) {
    switch (action.type) {
      case LOGIN_AUTH:
      console.log('reducers',action.payload);
        return {
          ...state,
          login: action.payload
        };
      default:
        return state;
    }
  }
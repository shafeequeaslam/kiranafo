import { LOGIN_AUTH } from './types';

export const loginAuth = loginData => dispatch => {
  console.log(loginData)
    fetch('https://d2.kirana11.com/oauth2/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(res => res.json())
      .then(result =>
        // console.log(loginres),
        dispatch({
          type: LOGIN_AUTH,
          payload: result
        })
      );
  };
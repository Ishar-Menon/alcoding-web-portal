import { SET_CURRENT_USER } from '../actions/types';

import axios from 'axios';
import qs from 'qs';

export const loginUser = user => dispatch => {
    axios.post("/api/account/signin", qs.stringify(user))
        .then((response) => {
            console.log(response);
            
            if (response.data.success) {

                //save data into local storage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_id',response.data.user_id);

                //set current user
                dispatch(setCurrentUser(response.data.token));
            }

        })
        .catch(err =>
            alert('Invalid Login')
        );
};


// Set logged in user
export const setCurrentUser = token => {
    return {
        type: SET_CURRENT_USER,
        payload: token
    };
};

export const logoutUser = () => dispatch => {
    var userID = localStorage.getItem('user_id')
    var token = localStorage.getItem('token')
    axios.get('/api/account/'+ userID +'/logout',{
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        },
    })
    console.log(userID+" logged out.");
    //save data into local storage
    localStorage.removeItem('token', token);
    localStorage.removeItem('user_id', userID);
    dispatch(setCurrentUser({}))
}

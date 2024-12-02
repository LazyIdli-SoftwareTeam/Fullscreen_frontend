import { postRequest } from './axiosClient';


export const accessByEmployee = ({ token, type, success, failure }) => {
    console.log(failure);
    postRequest({
        endpoint: '/auth/verifytoken', 
        dispatch: null,
        controller: new AbortController(), 
        headers: {}, 
        data: { token: token, type: type } 
    })
    .then(response => {
        if (response.status === 200) {
            success(response);
        } else {
            failure(response);
        }
    })
    .catch(err =>  failure(err))
}
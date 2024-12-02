import { postRequest } from './axiosClient'; 


export const getOtp = async (number) => {
    try {
        let result = await postRequest({ 
            endpoint: '/auth/verificationcode', 
            headers: {}, 
            dispatch: null, 
            data: { phoneNumber: number }, 
            controller: new AbortController()
        }); 
        
        if (result.status == 200) {
            return { error: false, msg: { otp: result.msg.otp } }; 
        } else {
            return { error: true, msg: result.msg };  
        }
    } catch (e) {
        return { error: true, msg: e.toString() }; 
    }
    
}


export const sendOtp = async (phoneNumber) => {
    try {
      let result = await getOtp(phoneNumber);
      if (!result.error) return result.msg.otp;
      throw result;
    } catch (e) {
      throw e;
    }
  }
  
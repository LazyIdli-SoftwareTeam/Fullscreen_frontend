import RegisterSingle from "./RegisterSingle";
import RegiserMultiple from "./RegisterMultiple";
import { useContext, useEffect, useState } from "react";
import { OTP_STATUS, PAGE_STATE } from "../../../../utils/Constants";
import { Context  } from "../AuthState";
import RegisteredUser from "./RegisteredUser";
import { postRequest  } from "../../../../utils/axiosClient";
import { PageState  } from "../../../../pageState";
const constantRangeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 

const Register = ({ empPage=false, branchId }) => {
  const host = useContext(Context.HostInfo);
  const range = useContext(Context.Range);  
  const [rangeArray, setRangeArray] = useState(constantRangeArray);
  const [otp, setOtp] = useState(null)
  const [otpStatus, setOtpStatus] = useState(OTP_STATUS.UNVERIFIED); // unverified verified verifying 
  const [codeValue, setCodeValue] = useState('');
  const page = useContext(PageState.pageState);
  const { pageState, setPageState } = page; 


  useEffect(() => {
    console.log(pageState);
  }, [pageState])

  useEffect(() => {
    let token = localStorage.getItem('hostToken'); 
    if (token) {
      postRequest({
        endpoint: '/auth/verifytoken', 
        controller: new AbortController(), 
        data: { token: token, type: 'host' }, 
        headers: {}, 
        dispatch: null
      })
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            setPageState({ state: PAGE_STATE.VERIFIED, msg: 'OK' });
          } else {
            setPageState({ state: PAGE_STATE.UNVERIFIED, msg: 'unverified' });
          }
        })
        .catch(err => {            
          console.log(err);
          setPageState({ state: PAGE_STATE.UNVERIFIED, msg: 'Unverified' });      
        })
    } else {
      setPageState({ state: PAGE_STATE.UNVERIFIED, msg: 'unverified' });
    }
  }, [])

  useEffect(() => {
    setOtp(null); 
    setOtpStatus(OTP_STATUS.UNVERIFIED); 
    setCodeValue('');
  }, [range.rangeIndex])

  const state = {
    range: range, 
    host: host, 
    rangeArray: rangeArray, 
    setRangeArray: setRangeArray, 
    otp: otp, 
    setOtp: setOtp, 
    otpStatus: otpStatus, 
    setOtpStatus: setOtpStatus, 
    codeValue: codeValue, 
    setCodeValue: setCodeValue, 
  }

  if (empPage) {
    if (range.rangeIndex <= 1) {
      return <RegisterSingle state={state} empPage={empPage} branchId={branchId} pageState={pageState} setPageState={setPageState} />
    } 
    return  <RegiserMultiple state={state} empPage={empPage} branchId={branchId} pageState={pageState} setPageState={setPageState} />
  } else {
    if (pageState.state === PAGE_STATE.VERIFIED) {
      return <RegisteredUser state={state} branchId={branchId} pageState={pageState} setPageState={setPageState} />
    } else if (pageState.state === PAGE_STATE.UNVERIFIED) {
      if (range.rangeIndex <= 1) {
        return <RegisterSingle state={state} empPage={empPage} branchId={branchId} pageState={pageState} setPageState={setPageState} />
      } 
      return  <RegiserMultiple state={state} empPage={empPage} branchId={branchId} pageState={pageState} setPageState={setPageState} />
    } else {
      return (<h1>Loading</h1>);
    }
  } 
  
}

export default Register;


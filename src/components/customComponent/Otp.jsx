import { Alert, Button, FormControl, FormLabel, Select, Typography } from "@mui/material"
import styled from 'styled-components';
import { useState, useEffect, useRef, useContext } from 'react';
import { sendOtp } from '../../utils/otp';  
import { PageState  } from "../../pageState";
import { OTP_STATUS, OTP_TIMER } from "../../utils/Constants";

const Designs = {
  mobileOtpDesign:  { 
    color: 'rgba(0, 0, 0, 0.9)', 
    backgroundColor: 'transparent',  
    textTransform: 'none', 
    fontWeight: '600' 
  }, 
}



const Otp = ({ setOtpValue, otpValue, otpVerified, setOtpVerified, successValue=true, phoneNumber, emp=false }) => {
  const [enteredValue, setEnteredValue] = useState([]);
  const [timer, setTimer] = useState(OTP_TIMER);
  const boxOtp = useRef(0);
  const page = useContext(PageState.pageState); 
  const { pageState, setPageState } = page; 
  const [otpCount, setOtpCount] = useState(1);
  let location = window.location.href;

  setTimeout(() => {
    if (otpVerified === OTP_STATUS.VERIFYING) {
      window.location = location;
    }
  }, 180000)

  useEffect(() => {
    setEnteredValue([]);
    setTimer(OTP_TIMER);
  }, [])

  useEffect(() => {

    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
      if (timer === 0) return;
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, [timer]);


  const changeChildColor = (color) => {
    let childrens = Array.from(boxOtp.current.children); 
    for (const el of childrens) {
      el.style.border = '1px solid '+ color
    }
  }

  const keyHandle = (e) => {
    if (e.keyCode === 8 && parseInt(e.target.name) - 1 >= 0 && e.target.value.length === 0) {
      boxOtp.current.children[parseInt(e.target.name) - 1].focus();
    }
  }


  const handleChange = (e) => {
    if (e.target.value.length === 1) {
     if (parseInt(e.target.name) + 1 < 4) {
        boxOtp.current.children[parseInt(e.target.name) + 1].focus();
      }
    }
    enteredValue[e.target.name] = e.target.value; 
    setEnteredValue(prev => prev.map((pr, i) => {
      if (i == e.target.name) {
        return e.target.value
      } 
      return pr;
    }))
    if (enteredValue.length == 4 && parseInt(enteredValue.join("")) === parseInt(otpValue)) {
      setTimeout(() => {
        setOtpVerified(successValue);
      }, 1000);
      changeChildColor('green');
    } else if (enteredValue.length === 4) {
      changeChildColor('red')
    }  
  }

  return (
    <OtpStyle>
    <Button type='text' disableRipple 
    sx={{ color: emp ? 'white' : 'rgba(0, 0, 0, 0.9)', backgroundColor: 'transparent',  textTransform: 'none', fontWeight: '600',  }}>Verify Mobile - OTP</Button>
    <div className='OtpContainer'>
      <div className='BoxOtp' ref={boxOtp}>
        <input 
          component='input'  
          onKeyDown={keyHandle} 
          autoComplete='none' 
          name={0}
          maxLength='1'  
          value={enteredValue[0] ? enteredValue[0] : ''}
          onChange={handleChange} 
          type='number'
          style={{ textAlign: 'center', fontSize: '1.2rem', border: 'none', outline: 'none', width: '35px', height: '35px', backgroundColor: 'rgba(238, 238, 238, 1)', 
          borderRadius: '8px' 
        }}/>
        <input component='input'
          value={enteredValue[1] ? enteredValue[1] : ''}
          onKeyDown={keyHandle} 
          autoComplete='none' 
          name={1} 
          type='number'
          maxLength='1'  
          onChange={handleChange} 
          style={{ textAlign: 'center', fontSize: '1.2rem', border: 'none',  outline: 'none', width: '35px', height: '35px', backgroundColor: 'rgba(238, 238, 238, 1)', borderRadius: '8px'  }}/>
        <input component='input'  
          value={enteredValue[2] ? enteredValue[2] : ''}
          onKeyDown={keyHandle} 
          autoComplete='none' 
          name={2} 
          type='number'
          maxLength='1'  
          onChange={handleChange} 
          style={{ textAlign: 'center', fontSize: '1.2rem', border: 'none',  outline: 'none', width: '35px', height: '35px', backgroundColor: 'rgba(238, 238, 238, 1)', borderRadius: '8px' }}/>
        <input component='input'
          value={enteredValue[3] ? enteredValue[3] : ''}
          onKeyDown={keyHandle} 
          autoComplete='none' 
          name={3} 
          type='number'
          maxLength='1'  
          onChange={handleChange} 
          style={{ textAlign: 'center', fontSize: '1.2rem', border: 'none',  outline: 'none', width: '35px', height: '35px', backgroundColor: 'rgba(238, 238, 238, 1)', borderRadius: '8px' }}/>
      </div>
    <span>{timer}s</span>
    </div>
    <Button   
      type='text' 
      disableRipple 
      sx={{...Designs.mobileOtpDesign, color: emp ? 'rgba(255, 255, 255, 1)': 'rgba(0, 0, 0, 0.9)' }} 
      disabled={timer != 0 || otpCount > 3} 
      onClick={async() => {
        try {
          let otp = await sendOtp(phoneNumber); 
          if (otp) {
            if (otpCount > 3) return;
            setOtpValue(otp);
            setTimer(OTP_TIMER);
            setOtpCount(prev => prev + 1);
            setPageState({...pageState, otp: { error: true, msg: 'Otp Send!', type: 'otp' } });
          } else if (otp.error) {
            setPageState({...pageState, otp: { error: true, msg: otp.msg ? otp.msg : 'server error', type: 'otp' } });
          }
        } catch (e) {
          console.log(e);
          setPageState( {...pageState, otp: { error: true, msg: e.msg ? e.msg : 'server error', type: 'otp' } }); 
        }
    }}>Resend Code?</Button>
    </OtpStyle>
  )
}


export default Otp;


const OtpStyle = styled.div`
  .BoxOtp {
    display: inline-flex; 
    justify-content: center;
    align-items: center; 
    gap: 1.5rem;
    padding-top: 0.5rem;
    margin-left: auto
  }

  .OtpContainer {
    display: flex;
    align-items: center;
  }

  .OtpContainer  span {
    color: rgba(0, 135, 70, 1);
    padding-left: 1rem;
  }

  .error {
    border: 1px solid red;
  }

`
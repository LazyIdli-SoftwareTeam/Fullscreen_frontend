import { Button, FormControlLabel, Checkbox,  TextField } from "@mui/material"
import { RangeBoxWhole } from '../../../customComponent/RangeBox';
import styled from "@emotion/styled";
import { useEffect } from 'react';
import  Avatar  from '../../../customComponent/Avatar';
import PlayerInformation from "../playerInfo/PlayerInformationForm";
import  Otp from '../../../customComponent/Otp';
import { sendOtp } from '../../../../utils/otp';
import { OTP_STATUS, GlobalDesigns, Constants } from "../../../../utils/Constants";
import { postRequest  } from "../../../../utils/axiosClient";
import { Alert } from "@mui/material";


const Designs = {
  AvButtonDesign: {
    display: 'block', 
    color: 'rgba(0, 0, 0, 1)', 
    paddingTop: '0.7rem', 
    textTransform: 'none', 
    fontWeight: '400', 
    backgroundColor: 'transparent'
  }, 
  OtpButtonDesign: {
    marginTop: '1.5rem', 
    borderRadius: '21px', 
    backgroundColor: 'rgba(0, 0, 0, 1)', 
    textTransform: 'none', 
    width: '50%'
  }, 
  TosDesign: {
    padding: '0.5rem', 
    paddingLeft: '1rem' 
  }
}

  


const saveHost = async ({ hostInfo, setCodeValue, empInfo, branchId }) => {
  postRequest({
    endpoint: '/auth/registerHost', 
    headers: {},
    data: { hostInfo: hostInfo },  
    dispatch: null, 
    controller: new AbortController() 
  }).then((response) => {
    console.log(response.msg);
    let arr = [];
    arr.push(response.msg.host.players[0]['_id']);
    localStorage.setItem('playerIds', JSON.stringify(arr));
    localStorage.setItem('hostInfo', JSON.stringify({ hostName: hostInfo[0].name, hostNumber: hostInfo[0].phoneNumber }));
    localStorage.setItem('hostToken', response.msg.token.toString());
    if (response.status === 200) {
      setCodeValue(response.msg.host.players[0].code); 
      setTimeout(() => {
        if (empInfo) {
          window.location = '/empplayerinfo?branchid=' + branchId; 
        } else {
          window.location = '/playerinfo?branchid=' + branchId;        
        }
      }, 1000)
    }
  })
}

const disableOtpButton = (user, otpStatus, tos) => {
  console.log(user);
  let result =  (
    user && 
    (user.name && user.name.length > 1) &&
    (user.phoneNumber && user.phoneNumber.match(Constants.PHONE_NUMBER_REGEX)) &&
    (user.gender && user.gender.length > 1) && 
    (user.dateOfBirth && user.dateOfBirth.length > 1) &&
    tos &&
    otpStatus === OTP_STATUS.UNVERIFIED
  );
  return result ? false : true;  
}



const RegisterSingle = ({ state, empPage, branchId,  pageState, setPageState }) => {
  const { range, host, rangeArray, setRangeArray, otp, setOtp, otpStatus, setOtpStatus, codeValue, setCodeValue } = state;

  const generateCodeClick = async () => {
    try {
      if (otpStatus === OTP_STATUS. VERIFIED) return; 
      let otp = await sendOtp(host.hostInfo[0].phoneNumber);
      if (otp) {
        setOtpStatus(OTP_STATUS.VERIFYING);
        setOtp(otp); 
        setPageState({...pageState, others: { msg: 'Otp Send!', error: false } }); 
      } else  {
        setPageState({...pageState, others: { msg: otp.msg ? otp.msg : 'server error', error: true, type: 'otp' } }); 
      }
    } catch (e) {
      setPageState({...pageState, others: { msg: e.msg ? e.msg : 'server error', error: true, type: 'otp' } }); 
      return null;
    }
  }


  useEffect(() => {
    setPageState({...pageState, others: {} }); 
  }, [])


  useEffect(() => {
    if (otpStatus === OTP_STATUS.VERIFIED) {
      saveHost({ hostInfo: host.hostInfo, setCodeValue: setCodeValue, empInfo: empPage, branchId: branchId })
    }
  }, [otpStatus])
  
  return (
    <>
      <RegisterStyle>
        <div className={range.rangeIndex === 1 ? 'RegisterContainer' : 'hidden'}>
          <div className={empPage ? 'hidden' : 'range'}>
            <RangeBoxWhole 
              setRangeArray={setRangeArray} 
              rangeArray={rangeArray} 
            />
          </div>

          <div className='InformationForm'>
            <p>Enter data to get the pass code</p>
            <PlayerInformation pageIndex={0} setOtp={setOtp} />
            <Button 
              variant="text"
              sx={Designs.AvButtonDesign}
              disableRipple
            > Choose Avatar / Click Selfie </Button>
            
            <div className='Av'> 
              <Avatar 
                otpVerified={otpStatus}
                hostInfo={host.hostInfo} 
                setHostInfo={host.setHostInfo}  
                pageIndex={0} 
              />              
            </div>

            <div className={otpStatus != OTP_STATUS.VERIFYING ? 'hidden' : 'MobileOtp'}>
              <Otp  
                otpValue={otp}  
                otpVerified={otpStatus}
                successValue={OTP_STATUS.VERIFIED} 
                phoneNumber={host.hostInfo[0]?.phoneNumber } 
                setOtpValue={setOtp} 
                setOtpVerified={setOtpStatus} 
              />
            </div>
          </div>

          <div className={otpStatus === OTP_STATUS.UNVERIFIED ? 'tosForm' : 'hidden'} style={GlobalDesigns.TosDesign} > 
            <FormControlLabel
              label="I accept whatever happens during the game im totally responsible for the causes. lorem ipsum"
              control={<Checkbox  />}
              onChange={(e) => host.setHostInfo({...host.hostInfo, tos: e.target.checked})}
            />
          </div> 

          <div className={'GenerateOtp'}>
            <Button  
              variant='contained'
              sx={GlobalDesigns.OtpButtonDesign}
              size='large'
              className={otpStatus != OTP_STATUS.UNVERIFIED ? 'hidden' : null}
              disabled={disableOtpButton(host.hostInfo[0], otpStatus, host.hostInfo.tos)}
              onClick={generateCodeClick}
            > Verify </Button>

            <TextField
              name='code'
              size='medium'
              className={otpStatus != OTP_STATUS.VERIFIED ? 'hidden' : null}
              autoComplete='none'
              sx={{ paddingTop: '1.5rem' }}
              InputProps={{ disableUnderline: true  }}
              variant='filled'
              value={codeValue}
            />
          </div>

        </div>
      </RegisterStyle>

    </>
  )
}

  


export default RegisterSingle; 

const RegisterStyle = styled.div `
  .RegisterContainer {
    display: grid; 
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 0.7rem 1rem;
    padding-top: 1rem;
    overflow-y: scroll;
    text-align: center;

  }

  input[name="code"]{
    color: transparent;
    text-shadow: 0 0 0 #000;
  }


  input[name="code"]:focus{
    outline: none;
  }

  .hidden { 
    display: none;
  }

  .range {
    grid-column: 1 / -1;
  }

  .GenerateOtp, .GenerateOtpButton {
    grid-column: 1 / -1;
    text-align: center;
  }

  .InformationForm {
    grid-column: 2 / 8;
    display: flex;
    flex-direction: column;
  }
  
  .tosForm {
    grid-column: 1 / -1;
  }

  .hidden {
    display: none;
  }

  .Av {
    align-self: center;
  }

  .MobileOtp  {
    padding-top: 2rem;
    display: flex;
    justify-content: center;
  }

  .generateOtp Button {
    width: 100%;
  }

`
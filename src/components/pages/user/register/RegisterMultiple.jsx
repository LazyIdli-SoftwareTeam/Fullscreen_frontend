import { Button, FormLabel,  FormControlLabel, Checkbox } from "@mui/material"
import styled from "styled-components";
import { RangeBoxWhole } from '../../../customComponent/RangeBox';
import PlayerInformation  from '../playerInfo/PlayerInformationForm';
import { useState } from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Avatar from '../../../customComponent/Avatar';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import  Otp  from '../../../customComponent/Otp';
import { postRequest } from "../../../../utils/axiosClient";
import { Constants, OTP_STATUS, GlobalDesigns } from "../../../../utils/Constants";
import { sendOtp } from '../../../../utils/otp';
import { Alert } from "@mui/material";
import { useEffect  } from "react";



const DarkerDisabledTextField = withStyles({
  root: {
    marginRight: 8,
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.9)", // (default alpha is 0.38)
    }
  }
})(TextField);


const savePlayers = async (hostInfo, empInfo, branchId) => {
  let response = await postRequest({
    endpoint: '/auth/registerHost', 
    headers: {},
    data: { hostInfo: hostInfo },  
    dispatch: null, 
    controller: new AbortController() 
  }); 
  if (response.status && response.status == 200) {
    setTimeout(() => {
      if (!empInfo) {
        window.location = '/playerinfo?branchid=' +branchId        
      } else {
        window.location ='/empplayerinfo?branchid=' + branchId;
      }
    }, 1000)
    let playerId = response.msg.host.players.map(el => el._id);
    localStorage.setItem('playerIds', JSON.stringify(playerId));
    localStorage.setItem('hostInfo', JSON.stringify({ hostName: hostInfo.hostName, hostNumber: hostInfo.hostPhoneNumber }));
    localStorage.setItem('hostToken', response.msg.token.toString());
  } else {
    console.log(response);
    alert('some error occured check console');
  }
}

const Designs = {
  formLabelHost: {
    fontWeight: '500', 
    color: 'rgba(0, 0, 0, 0.8)', 
    paddingLeft: '0.3rem'
  },
  generateCode: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    color: 'rgba(255, 255, 255, 1)', 
    marginTop: '1rem', 
    padding: '0.5rem 2rem', 
    borderRadius: '21px' 
  },
  hostData(otpStatus, hostInfo, setHostInfo, type, key) {
    let options = { error: true, helperText: '', type: 'text' };

    if (type != 'name') {
      options.type = 'tel';
    }

    if (type === 'name') {
      options.error = hostInfo.hostName.length <= Constants.HOST_NAME_MAX_LENGTH;
    } else {
      options.error = !hostInfo.hostPhoneNumber.toString().match(Constants.PHONE_NUMBER_REGEX);
    }

    if (type === 'name') {
      options.helperText = 'Enter your name';
    } else {
      options.helperText = 'Invalid Phone number';
    }

    return (
      <DarkerDisabledTextField 
        id={key}
        name={key}
        size='small'
        variant='filled'
        type={options.type}
        autoComplete='none'
        error={options.error}
        value={hostInfo[key]}
        onChange={(e) => setHostInfo({...hostInfo, [key]: e.target.value })}
        InputProps={{ disableUnderline: true, style: { height: '38px', paddingBottom: '0.8rem', borderRadius: '8px', } }}
        sx={{ outline: 'none' }}
        disabled={otpStatus != OTP_STATUS.UNVERIFIED}
        fullWidth
        helperText={otpStatus === OTP_STATUS.UNVERIFIED ? options.helperText : null}
      />
    )
  }
}

const disableOtpButton = (hostInfo) => {
  let result = (
    hostInfo.hostName.length > Constants.HOST_NAME_MAX_LENGTH  && 
    hostInfo.hostPhoneNumber.length === 10 && 
    hostInfo.tos ) ? false : true; 
  return result;
}




const RegiserMultiple = ({ state, empPage, branchId, pageState, setPageState }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { range, host, rangeArray, setRangeArray, otp, setOtp, otpStatus, setOtpStatus, codeValue, setCodeValue  } = state;
  console.log(otpStatus);
  const generateCodeClick = async () => {
    try {
      if (otpStatus === OTP_STATUS.VERIFIED) return; 
      let otp = await sendOtp(host.hostInfo.hostPhoneNumber);
      if (otp) {
        setOtpStatus(OTP_STATUS.VERIFYING);
        setOtp(otp); 
        setPageState({...pageState, others: { msg:  'Otp Send!', error: false, type: 'otp' } });
      } else {
        setPageState({...pageState, others: { msg: otp.msg ? otp.msg : 'server error', error: true, type: 'otp' } });
      }
    } catch (e) {
      setPageState({...pageState, others: { msg: e.msg ? e.msg : 'server error', error: true, type: 'otp' } });
      return null;
    }
  }

  const handleNextClick = () => {
    return (
      currentPageIndex + 1 < range.rangeIndex && 
      host.hostInfo[currentPageIndex] && 
      Constants.verify(host.hostInfo[currentPageIndex]) ? 
      setCurrentPageIndex(currentPageIndex + 1) : null
    );
  }

  const handlePreviousClick = () => {
    return (
      currentPageIndex > 0 ? setCurrentPageIndex(currentPageIndex - 1) : null
    );
  }

  useEffect(() => {
    setPageState({...pageState, others: {} }); 
  }, [])



  return (
    <HostInfoStyle>
      <div className={'HostInfoContainer'}>
        <div className={empPage ? 'hidden' : 'range'}>
          <RangeBoxWhole 
            setRangeArray={setRangeArray} 
            rangeArray={rangeArray}
          />
        </div>
        <div className='HostInfoForm'>
          <div>
            <FormLabel 
              sx={Designs.formLabelHost} 
              htmlFor='hostName' 
              className={otpStatus != OTP_STATUS.UNVERIFIED ? 'hidden' : null}
            >Enter Host's Name Here</FormLabel>
            {Designs.hostData(otpStatus, host.hostInfo, host.setHostInfo, 'name', 'hostName')}
          </div>

          <div>
            <FormLabel 
              sx={Designs.formLabelHost} 
              htmlFor='hostNumber' 
              className={otpStatus != OTP_STATUS.UNVERIFIED ? 'hidden' : null}
            >Enter Host's Number Here</FormLabel>
            {Designs.hostData(otpStatus, host.hostInfo, host.setHostInfo, 'number', 'hostPhoneNumber')}
          </div>

          <Button  
            variant='contained'
            className={otpStatus != OTP_STATUS.UNVERIFIED ? 'hidden' : null}
            sx={GlobalDesigns.OtpButtonDesign}
            
            size='large'
            disabled={disableOtpButton(host.hostInfo)}
            onClick={generateCodeClick}
          >Verify </Button>

        </div>

        <div className={otpStatus === OTP_STATUS.UNVERIFIED ? 'tosForm' : 'hidden'}>
          <FormControlLabel
            label="I accept whatever happens during the game im totally responsible for the causes. lorem ipsum"
            control={<Checkbox  />}
            sx={{ ...GlobalDesigns.TosDesign, paddingTop: '0rem' }}
            onChange={(e) => host.setHostInfo({...host.hostInfo, tos: e.target.checked})}
          />
        </div>

        <div className={otpStatus === OTP_STATUS.VERIFYING ?  'MobileOtp' : 'MobileOtp hidden'}> 
          <Otp  
            otpVerified={otpStatus}
            otpValue={otp}  
            successValue={OTP_STATUS.VERIFIED} 
            phoneNumber={host.hostInfo.hostPhoneNumber } 
            setOtpValue={setOtp} 
            setOtpVerified={setOtpStatus} 
          />
        </div>
        
        <div className={otpStatus != OTP_STATUS.VERIFIED ? 'PlayerInformation hidden' : 'PlayerInformation'} >
          <Button 
            type='text'
            sx={{ color: 'rgba(0, 0, 0, 0.9)', backgroundColor: 'transparent' }}
            disableRipple
          >{`Player ${currentPageIndex + 1}/${range.rangeIndex}`} </Button>

          <PlayerInformation pageIndex={currentPageIndex}  otpVerified={otpStatus} />
          
          <div className='Navigation'>
              <span className='navigation__back'>
                <span><KeyboardArrowLeftIcon className='icon' onClick={handlePreviousClick } /></span>Back
              </span>
              <span className='navigation__next'>
                Next<KeyboardArrowRightIcon className='icon' onClick={handleNextClick} />
              </span>
          </div>

          <div className='Avatars'>
            <Avatar 
              hostInfo={host.hostInfo} 
              setHostInfo={host.setHostInfo} 
              pageIndex={currentPageIndex} 
              otpVerified={otpStatus}
            />
          </div>

          <Button 
            type='button'
            variant='contained'
            onClick={async (e) => await savePlayers(host.hostInfo, empPage, branchId)}
            sx={Designs.generateCode}
            disabled={
              currentPageIndex + 1 === range.rangeIndex &&  
              host.hostInfo[currentPageIndex] && 
              Constants.verify(host.hostInfo[currentPageIndex]) ? false : true }
          >Generate Code</Button> 
        </div>
      </div>
      
    </HostInfoStyle>
  )
}


export default RegiserMultiple;

const HostInfoStyle = styled.div`
  .HostInfoContainer {
    padding-top: 2rem;
    overflow: hidden;
    display: grid; 
    grid-template-columns: repeat(8, 1fr);
    overflow-y: scroll; 
    grid-gap: 3.5rem 1rem;
    text-align: center;
  }
  
  .range, .RangeHeading   {
    grid-column: 1 / -1;
  }

  .MobileOtp {
    grid-column: 2 / 8;
    display: flex; 
    justify-content: center;
  }
  
  .Navigation {
    padding-top: 1rem; 
  }

  .PlayerInformation {
    grid-column: 2 / 8;
  }

  .HostInfoForm {
    grid-column:  2 / 8;
    text-align: left;
    display: flex; 
    flex-direction: column; 
    align-items: center;
    flex-wrap: none;
    gap: 1rem;
  }

  .HostInfoForm div {
    line-height: 1.2;
  }

  .tosForm {
    grid-column: 1 / 9;
    width: 100%;
  }

  .hidden {
    display: none;
  }

  .Avatars {
    display: flex; 
    justify-content: center; 
    align-items: center;
    padding: 1rem 0rem;
  }


  .Navigation {
    display: flex;
  }

  .navigation__next {
    margin-left: auto;
  }


  .navigation__back .icon, .navigation__next .icon {
    font-weight: 400;
    float: right;
  }

  .navigation__back .icon {
    padding-bottom: 0.1rem;
  }
  
  .navigation__next .icon {
    padding-bottom: 0.1rem;
  }

  .navigation__back, .navigation__next {
    display: flex; 
    justify-content: center;
    align-items: center;
  }

  .text1 {
    color: rgba(0, 0, 0, 0.9) !important;
  }


`; 




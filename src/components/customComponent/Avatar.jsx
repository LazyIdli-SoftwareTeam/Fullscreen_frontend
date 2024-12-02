import styled from "@emotion/styled"
import { useState, useEffect } from "react"
import { OTP_STATUS } from "../../utils/Constants";

const constantAvatars = ['av1.png', 'av2.png', 'av3.png', 'av4.png', 'av5.png' ];


const Avatar = ({ hostInfo, setHostInfo, pageIndex, otpVerified }) => {
  console.log(otpVerified);
  const [key, setKey] = useState(0);
  const [avatars, setAvatars] = useState(constantAvatars);
  const clickHandler = (e, i) => {
    console.log(otpVerified);
    if (otpVerified === OTP_STATUS.UNVERIFIED || otpVerified === OTP_STATUS.VERIFIED) {
      setKey(i);
      setHostInfo({ ...hostInfo, [pageIndex]: {...hostInfo[pageIndex], 'avatar': avatars[key] } }) 
    }
  }

  useEffect(() => {
  }, [avatars])

  return (
    <AvStyle>
      <div className='avatars'>
        {avatars.map((av, i) => {
          return (
            <div key={i}  onClick={(e) => clickHandler(e, i)} className={key === i ? 'clicked AvImage': 'AvImage'} >
              <img src={av} className='av1.png' />
            </div>
          )        
        })}
      </div>
    </AvStyle>
  )
}

export default Avatar;


const AvStyle = styled.div`

  .avatars {
    display: flex; 
    flex-wrap: none; 
    overflow: hidden;
    gap: 0.5rem;
    padding: 1.5rem;
  }


  .clicked {
    box-shadow: 2px 2px 12px 2px rgba(9, 123, 62, 1), -2px -2px 12px 2px rgba(9, 123, 62, 1);
    background-color: red;
  }

  .AvImage {
    border-radius: 50%; 
    width: 60px; 
    height: 55px;
  }


  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
` 
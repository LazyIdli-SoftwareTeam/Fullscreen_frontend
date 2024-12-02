import styled from "styled-components";
import { Button, TextField, Alert, Box } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import {
  Constants,
  GlobalDesigns,
  OTP_STATUS,
} from "../../../../utils/Constants";
import { BUTTON_STATUS } from "../../../../utils/Constants";
import { postRequest } from "../../../../utils/axiosClient";
import Otp from "../../../customComponent/Otp";
import { sendOtp } from "../../../../utils/otp";
import { PageState } from "../../../../pageState";

const defaultStatus = {
  msg: "Enter your 4 digit passcode",
  type: BUTTON_STATUS.SHOW,
};

const getPlayerInfo = async (
  status,
  fieldValue,
  setRequestStatus,
  branchId,
  empPage
) => {
  let data = {};
  if (status.type === BUTTON_STATUS.SHOW) {
    data.code = fieldValue;
    data.playerNumber = null;
  } else {
    data.playerNumber = fieldValue;
    data.code = null;
  }

  console.log(data);

  try {
    let response = await postRequest({
      endpoint: "/auth/getplayercode",
      dispatch: null,
      controller: new AbortController(),
      headers: {},
      data: data,
    });
    if (response.status === 200) {
      if (data.playerNumber) {
        localStorage.setItem(
          "playerIds",
          JSON.stringify(response.msg["players"])
        );
        localStorage.setItem("hostInfo", JSON.stringify(response.msg));
      } else {
        localStorage.setItem(
          "playerIds",
          JSON.stringify([response.msg["_id"]])
        );
        localStorage.setItem("hostInfo", JSON.stringify(response.msg));
      }
      if (empPage) {
        window.location = "/empplayerinfo?branchid=" + branchId;
      } else {
        window.location = "/playerinfo?branchid=" + branchId;
      }
    } else if (response.status === 404) {
      setRequestStatus({ error: true, msg: "User not found" });
    } else {
      alert("error occured");
    }
  } catch (e) {
    alert("some error occured");
  }
};

const disableButton = (status, fieldValue) => {
  if (status.type === BUTTON_STATUS.SHOW && fieldValue.length != 4) {
    return true;
  } else if (
    status.type === BUTTON_STATUS.RETRIVE &&
    (fieldValue.length != 10 || !fieldValue.match(Constants.PHONE_NUMBER_REGEX))
  ) {
    return true;
  }
};

const RegisteredUser = ({ branchId, empPage = false }) => {
  const [status, setStatus] = useState(defaultStatus);
  const [fieldValue, setFieldValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState(false);
  const [requestStatus, setRequestStatus] = useState({ error: false, msg: "" });
  const page = useContext(PageState.pageState);
  const { pageState, setPageState } = page;

  const changeStatus = () => {
    setFieldValue("");
    if (status.type === BUTTON_STATUS.SHOW) {
      setStatus({
        msg: "Enter your phone number",
        type: BUTTON_STATUS.RETRIVE,
      });
    } else {
      setStatus({ ...defaultStatus });
    }
  };

  const handleSumbit = async () => {
    if (status.type === BUTTON_STATUS.RETRIVE) {
      try {
        let otp = await sendOtp(fieldValue);
        if (otp) {
          setOtp(otp);
          setOtpStatus(OTP_STATUS.VERIFYING);
          setPageState({
            ...pageState,
            others: { error: true, msg: "Otp Send!", type: "otp" },
          });
        } else {
          setPageState({
            ...pageState,
            others: {
              error: true,
              msg: otp.msg ? otp.msg : "server error",
              type: "otp",
            },
          });
        }
      } catch (e) {
        setPageState({
          ...pageState,
          others: {
            error: true,
            msg: e.msg ? e.msg : "server error",
            type: "otp",
          },
        });
        return null;
      }
    } else {
      getPlayerInfo(status, fieldValue, setRequestStatus, branchId, empPage);
    }
  };

  useEffect(() => {
    if (otpStatus === OTP_STATUS.VERIFIED) {
      getPlayerInfo(status, fieldValue, setRequestStatus, branchId, empPage);
    }
  }, [otpStatus]);

  useEffect(() => {
    setPageState({ ...pageState, others: {} });
  }, []);

  return (
    <RegisteredUserStyle>
      <div className="grid">
        <div className="PlayerInfo">
          <Button
            type='text'
            disableRipple
            disabled={otpStatus == OTP_STATUS.VERIFYING}
            sx={{  ...GlobalDesigns.muiButtonTextDesign, textTransform: 'uppercase' }}
          >{status.msg}</Button>

          <Box display="flex" alignItems="center" justifyContent="center">
            <TextField
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              type="tel"
              size="small"
              disabled={otpStatus == OTP_STATUS.VERIFYING}
              variant="filled"
              className={otpStatus === OTP_STATUS.VERIFYING ? "hidden" : null}
              InputProps={{ disableUnderline: true }}
              inputProps={{
                maxLength: status.type === BUTTON_STATUS.RETRIVE ? 10 : 4,
                style: { textAlign: "center", alignSelf: "center" },
              }}
              error={requestStatus.error}
              helperText={requestStatus.msg}
            />
          </Box>

          <Button
            disabled={disableButton(status, fieldValue)}
            hidden={otpStatus === OTP_STATUS.VERIFYING}
            sx={{
              ...GlobalDesigns.muiButtonTextDesign,
              backgroundColor: "rgba(0, 0, 0, 1)",
              color: "#ffff",
              padding: "0.5rem 1.2rem",
              borderRadius: "12px",
              marginTop: "0.5rem",
            }}
            className={otpStatus === OTP_STATUS.VERIFYING ? "hidden" : null}
            onClick={() => handleSumbit()}
            variant="contained"
          >
            {status.type === BUTTON_STATUS.SHOW ? "Show Data" : "Retrive code"}
          </Button>

          <Button
            type="text"
            disableRipple
            sx={{
              ...GlobalDesigns.muiButtonTextDesign,
              color: "rgba(154, 153, 153, 1)",
              fontWeight: "400",
            }}
            onClick={() => changeStatus()}
            className={otpStatus === OTP_STATUS.VERIFYING ? "hidden" : null}
          >
            {status.type === BUTTON_STATUS.SHOW ? "Retrive Code" : "Show Data"}
          </Button>

          <div
            className={
              otpStatus === OTP_STATUS.VERIFYING ? "MobileOtp" : "hidden"
            }
          >
            <Otp
              successValue={OTP_STATUS.VERIFIED}
              otpVerified={otpStatus}
              setOtpVerified={setOtpStatus}
              phoneNumber={fieldValue}
              otpValue={otp}
              setOtpValue={setOtp}
            />
          </div>
        </div>
      </div>
    </RegisteredUserStyle>
  );
};

export default RegisteredUser;

const RegisteredUserStyle = styled.div`
  .PlayerInfo {
    display: flex;
    flex-direction: column;
    grid-column: 1 / -1;
    justify-content: center;
    align-items: center;
    padding-top: 2rem;
    gap: 0.5rem;
    text-align: center;
  }

  .OtpContainer span {
    padding-left: 0.5rem;
  }

  .hidden {
    display: none;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
  }

  .MobileOtp {
    grid-colum: 2 / 8;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .css-c5v1qu-MuiInputBase-input-MuiFilledInput-input {
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;

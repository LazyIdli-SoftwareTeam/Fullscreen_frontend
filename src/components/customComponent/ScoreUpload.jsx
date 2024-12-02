import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { BiLoader } from 'react-icons/bi';
import styled from 'styled-components';
import { URL } from '../../utils/Constants';

export const checkUser = async (onAccept, onReject, phoneNumber) => {
  try {
    const response = await axios.post(URL + '/auth/playerInfoWithPhone', {
      phoneNumber: phoneNumber,
    });
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
};

const DEFAULT_EMP_ID = '643d5448696b68a932b50245';

export const publishScoreUser = async (onAccept, onReject, data) => {
  try {
    const response = await axios.post(URL + '/game/addScore', {
      ...data,
      employeeId: DEFAULT_EMP_ID,
    });
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
};

const ScoreUpload = ({
  scoreType,
  closePopup,
  filters,
  gameId,
  setFilters,
}) => {
  const [userInput, setUserInput] = useState({
    phoneNumber: '',
    userName: '',
    gender: 'male',
    score: '',
    userId: null,
  });
  const [userState, setUserState] = useState('UNKNOWN');
  const [checkState, setCheckState] = useState('UNKNOWN');
  const [publishState, setPublishState] = useState('UNKNOWN');
  const GetScore = () => {
    if (scoreType === 'time') {
      return <div></div>;
    } else {
      return (
        <TextField
          style={{ width: '100%' }}
          label="Score"
          value={userInput.score}
          onChange={(e) => {
            console.log();
            if (isNaN(parseInt(e.target.value))) return;
            setUserInput({ ...userInput, score: e.target.value });
          }}
          inputMode="decimal"
          size="small"
        />
      );
    }
  };

  const checkHandler = () => {
    if (userInput.phoneNumber.length < 10) return;
    setCheckState('LOADING');

    const onAccpet = (response) => {
      if (response.status === 200) {
        setCheckState('ACCEPTED');
        setUserState('FOUND');
        console.log(response.data); 
        setUserInput({
          userName: response.data.message.name,
          gender: response.data.message.gender,
          phoneNumber: response.data.message.phoneNumber,
          userId: response.data.message._id,
          score: '',
        });
      } else if (response.status === 404) {
        setUserState('NOTFOUND');
        enqueueSnackbar("User doesn't exists", {
          variant: 'default',
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar('Some error occurred. Try again later', {
          variant: 'error',
          autoHideDuration: 3000,
        });
        setCheckState('REJECTED');
      }
    };
    const onReject = () => {
      enqueueSnackbar('Some error occurred. Try again later', {
        variant: 'error',
        autoHideDuration: 3000,
      });
      setCheckState('REJECTED');
    };
    checkUser(onAccpet, onReject, userInput.phoneNumber);
  };

  const getCheckDisabled = () => {
    if (checkState === 'LOADING') return true;
    if (publishState === 'LOADING') return true;
    if (userInput.phoneNumber.length < 10) return true;
    return false;
  };

  const publishHandler = () => {
    if (userInput.score.length === 0) return;
    if (userInput.phoneNumber.length < 10) return;
    setPublishState('LOADING');

    const onAccept = (response) => {
      if (response.status === 200) {
        enqueueSnackbar('Done!', {
          variant: 'success',
          autoHideDuration: 3000,
        });
        setFilters({
          currentFilter: "Today's View",
          gameId: gameId,
          activePlayerEventId: null,
        });
        setPublishState('ACCEPTED');
      } else {
        enqueueSnackbar('Try again later!', {
          variant: 'error',
          autoHideDuration: 3000,
        });
        setPublishState('REJECTED');
      }
    };
    const onReject = (error) => {
      enqueueSnackbar('Try again later!', {
        variant: 'error',
        autoHideDuration: 3000,
      });
      setPublishState('REJECTED');
    };
    publishScoreUser(onAccept, onReject, {
      gameId: gameId,
      time: new Date().toString(),
      scoreDetails: [{ ...userInput }],
      filters: filters,
      scoreType: scoreType,
    });
  };

  const publishDisabled = () => {
    if (checkState === 'LOADING') return true;
    if (userInput.score.length === 0) return true;
    if (userInput.phoneNumber.length < 10) return true;
    return false;
  };

  const GetBtn = () => {
    if (userState === 'FOUND') {
      return null;
    }
    if (checkState === 'LOADING') {
      return (
        <div style={{ display: 'flex', alignSelf: 'center' }}>
          <BiLoader />
        </div>
      );
    }
    return (
      <span
        style={getCheckDisabled() ? { backgroundColor: 'grey' } : {}}
        onClick={checkHandler}
        className="--button"
      >
        Check
      </span>
    );
  };

  return (
    <ScoreUploadStyle>
      <div className="score-upload-overlay-container">
        <div className="score-upload-container">
          <div className="score-upload-top-container">
            <span className="--cross hidden">X</span>
            <span className="--head">Upload Score</span>
            <span onClick={closePopup} className="--cross">
              X
            </span>
          </div>
          <div className="user-input">
            <div className="--inputs">
              <TextField
                label="Phone Number"
                size="small"
                autoFocus
                disabled={userState === 'FOUND'}
                value={userInput.phoneNumber}
                onChange={(e) => {
                  if (isNaN(parseInt(e.target.value))) return;
                  if (e.target.value.length >= 11) return;
                  setUserInput({
                    ...userInput,
                    phoneNumber: e.target.value,
                  });
                }}
                style={{ width: '100%' }}
              />
            </div>
            <GetBtn />
          </div>

          <div className="user-input">
            <div className="--inputs">
              <TextField
                label="User Name"
                size="small"
                value={userInput.userName}
                disabled={userState === 'FOUND'}
                onChange={(e) =>
                  setUserInput({ ...userInput, userName: e.target.value })
                }
                style={{ width: '100%' }}
              />
            </div>
          </div>
{/* 
          <div className="user-input">
            <div className="--inputs">
              <TextField
                label="Gender"
                size="small"
                value={userInput.gender}
                disabled={userState === 'FOUND'}
                onChange={(e) =>
                  setUserInput({ ...userInput, gender: e.target.value })
                }
                style={{ width: '100%' }}
              />
            </div>
          </div> */}

          <div className="user-input">
            <div className="--inputs">{GetScore()}</div>
            {publishState === 'LOADING' ? (
              <div style={{ display: 'flex', alignSelf: 'center' }}>
                <BiLoader />
              </div>
            ) : (
              <div
                className="--button"
                onClick={publishHandler}
                style={publishDisabled() ? { backgroundColor: 'grey' } : {}}
              >
                Publish
              </div>
            )}
          </div>
        </div>
      </div>
    </ScoreUploadStyle>
  );
};

export default ScoreUpload;
const ScoreUploadStyle = styled.div`
  .score-upload-overlay-container {
    position: absolute;
    height: 100dvh;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .score-upload-container {
    background-color: white;
    color: black;
    height: 300px;
    width: 100%;
    z-index: 1000;
  }
  .score-upload-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    padding: 10px;
  }

  .user-input {
    display: flex;
    gap: 10px;
  }
  .user-input .--inputs {
    flex-grow: 1;
  }
  .user-input .--button {
    background-color: black;
    color: white;
    border-radius: 8px;
    display: flex;
    height: 70%;
    align-self: center;
    justify-content: center;
    align-items: center;
    padding: 0px 14px;
  }

  .score-upload-top-container {
    display: flex;
    justify-content: space-between;
  }

  .score-upload-top-container .hidden {
    visibility: hidden;
  }

  .score-upload-top-container .--cross {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    background-color: black;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  .score-upload-top-container .--head {
    font-size: 20px;
    font-weight: 600;
  }
`;

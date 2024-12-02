const { postRequest } = require("./axiosClient");

export const GAMES = {
  "643d08855731092343955149": "Bowling",
  "643d0c37573109234395514b": "Racing Simulator",
};

// export const URL = "https://lmsbackend.projectteho.com/api";
export const URL = "http://localhost:8000/api";



export const ScoreError = (value) => {
  let game = localStorage.getItem("gameId");
  if (this.GAMES[game] === "Bowling") {
    if (value > 300 || value < 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const OTP_TIMER = 30;

export const Constants = {
  HOST_NAME_MAX_LENGTH: 1,
  PHONE_NUMBER_REGEX:
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  DATE_REGEX: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
  verify(obj) {
    let FIELDS = ["name", "phoneNumber", "dateOfBirth", "gender"];
    let verified = true;
    for (const el of FIELDS) {
      if (!obj[el]) {
        verified = false;
        break;
      }
    }
    return verified;
  },

  RANGE_ARRAY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

export const OTP_STATUS = {
  UNVERIFIED: 0,
  VERIFYING: 1,
  VERIFIED: 2,
};

export const BUTTON_STATUS = {
  RETRIVE: 0,
  SHOW: 1,
};

export const PAGE_STATE = {
  UNVERIFIED: 0,
  VERIFIED: 1,
  NOTLOADED: 2,
};

export const CODE_STATUS = {
  SHOW: 0,
  PUBLISH: 1,
};

export const GlobalDesigns = {
  OtpButtonDesign: {
    marginTop: "1.5rem",
    borderRadius: "21px",
    backgroundColor: "rgba(0, 0, 0, 1)",
    textTransform: "none",
    width: "50%",
  },
  TosDesign: {
    padding: "1rem 0rem 0rem 1rem",
  },
  muiButtonTextDesign: {
    fontWeight: "600",
    color: "rgba(0, 0, 0, 1)",
    paddingLeft: "0.3rem",
    textTransform: "none",
  },
  BtnDesign: {
    color: "white",
    backgroundColor: "black",
    padding: "0.4rem 2.5rem",
    borderRadius: "12px",
  },
};

export const saveScore = (data, pageState, setPageState) => {
  const _Data = {
    time: Date.now(),
    scoreDetails: [],
    gameId: data.gameId,
    employeeId: data.employeeId,
  };
  for (const el in data) {
    if (!data[el]._id && !data[el].userId) continue;
    if (data.gameId === "643d0c37573109234395514b") {
      let a = data[el].score.split(":");
      console.log(a);
      var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      console.log(seconds);
      data[el].score = seconds.toString();
    }
    _Data.scoreDetails.push({
      userId: data[el]._id || data[el].userId,
      score: data[el].score,
    });
  }

  let location = window.location;

  postRequest({
    endpoint: "/game/addScore",
    data: _Data,
    dipatch: null,
    controller: new AbortController(),
    headers: {},
  })
    .then((response) => {
      if (response.status === 200) {
        setPageState({
          ...pageState,
          others: { error: false, msg: "Published", type: "score" },
        });
        setTimeout(() => (window.location = location), 2000);
      } else {
        setPageState({
          ...pageState,
          others: { error: true, msg: response.msg, type: "score" },
        });
      }
    })
    .catch((err) => {
      setPageState({
        ...pageState,
        others: { error: true, msg: "Server Error", type: "score" },
      });
    });
};

import styled from "styled-components";
import { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import axios from "axios";
import { Filter } from "@mui/icons-material";
import { URL } from "../../utils/Constants";
import io from "socket.io-client";

const Filters = [
  "Today's View",
  "Monthly View",
  "Play Add",
  "Stop Video",
  "All Time",
];
const games = {
  "643d08855731092343955149": "Bowling",
  "643d0c37573109234395514b": "Racing Simulator",
};

export const sendRequest = async (filter, scoreType) => {
  var str = "";
  let data = {};
  if (filter.currentFilter === Filters[0]) {
    str = URL + "/game/fetchByRank";
    data.dateTime = new Date();
  } else if (filter.currentFilter === Filters[4]) {
    //all time
    str = URL + "/game/allTimeRank";
  } else if (filter.currentFilter === Filters[1]) {
    //montly
    str = URL + "/game/fetchByMonth";
    data.dateTime = new Date();
    
  }

  data.gameId = filter.gameId;
  data.scoreType = scoreType;
  let response = await axios.post(str, data);
  return response;
};

export const EmpUpNav = ({ branchId }) => {
  let gameId = localStorage.getItem("gameId");
  let gameName = games[gameId];
  return (
    <EmpNavStyle>
      <div className="UpBar">
        <div className="UpBarLeft">
          <div
            className="UpbarIcon"
            onClick={(e) =>
              (window.location = "/empdashboard?branchid=" + branchId)
            }
          >
            <img src="home2.png" />
          </div>
          <span>{gameName || "Bowling"}</span>
        </div>
        <div className="UpBarRight">
          <span
            className="UpBarLogout"
            onClick={(e) => {
              localStorage.removeItem("empToken");
              window.location = "/emplogin?branchid=" + branchId;
            }}
          >
            Logout
          </span>
          <div className="UpbarRightIcon">
            <img src="logout.png" />
          </div>
        </div>
      </div>
    </EmpNavStyle>
  );
};

const EmpNav = ({ branchId, setLeaderboardView, filters, setFilters }) => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [Socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("https://backend.projectteho.com");
    socket.connect();
    socket.on("connect", () => console.log("connected"));
    setSocket(socket);
    localStorage.removeItem("activePlayerEvent");
  }, []);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const getHighlightUser = () => {
    let userId = localStorage.getItem("activePlayerId");
    let gameId = localStorage.getItem("gameId");
    let eventId = localStorage.getItem("activePlayerEvent");
    console.log(eventId);
    if (eventId) {
      setFilters({
        currentFilter: "Monthly View",
        userId: userId,
        gameId: gameId,
        activePlayerEventId: eventId,
      });
      Socket.emit("eswitch", {
        msg: "Monthly View",
        gameId: gameId || null,
        activePlayerEventId: eventId,
      });
      return;
    }
    axios
      .post(URL + "/game/getUserEvent", {
        playerId: userId,
        gameId: gameId,
      })
      .then((response) => {
        if (response.status === 200) {
          setFilters({
            currentFilter: "Monthly View",
            userId: userId,
            gameId: gameId,
            activePlayerEventId: response.data[0]._id,
          });
          Socket.emit("eswitch", {
            msg: "Monthly View",
            gameId: gameId || null,
            activePlayerEventId: response.data[0]._id,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let gameId = localStorage.getItem("gameId");
  let gameName = games[gameId];
  return (
    <EmpNavStyle>
      <div className="EmpNav">
        {/* <div className="TopNav">
          <span>Data Entry View </span>
          <Switch
            color="default"
            onChange={async (e) => {
              setLeaderboardView(e.target.checked);
            }}
          />
          <span>Leaderboard View</span>
        </div> */}
        <div className="BottomNav">
          {Filters.map((filter, i) => {
            return (
              <span
                key={i}
                onClick={(e) => {
                  setCurrentIndex(i);
                  console.log(i);
                  if (i == 1) {
                    getHighlightUser();
                  } else {
                    setFilters({ currentFilter: Filters[i], gameId: gameId });
                    if (!Socket) {
                      console.log("null");
                    }
                    Socket.emit("eswitch", {
                      msg:
                        Filters[i] == "Stop Video" ? "Intro Video" : Filters[i],
                      gameId: localStorage.getItem("gameId") || null,
                    });
                  }
                }}
                className={currentIndex === i ? "active" : null}
              >
                {filter}
              </span>
            );
          })}
        </div>
      </div>
    </EmpNavStyle>
  );
};

export default EmpNav;

const EmpNavStyle = styled.div`
  .UpBar {
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    color: white;
    height: 10%;
    background-color: black;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .UpBarLeft {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
  }

  .UpbarIcon {
    cursor: pointer;
    width: 25px;
  }

  .UpbarRightIcon {
    width: 20px;
    height: 15px;
    cursor: pointer;
    margin-bottom: 0.2rem;
  }

  .UpbarRightIcon img {
    width: 100%;
    align-self: center;
    self-align: center;
  }

  .UpBarRight {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .UpBarLogout {
    font-size: 1.2rem;
    align-self: center;
  }

  .EmpNav {
    background-color: rgba(27, 27, 27, 1);
    display: flex;
    gap: 0.5rem;
    color: white;
    flex-direction: column;
    height: 100% !important;
    width: 100%;
  }

  .TopNav {
    background: rgba(249, 173, 73, 1);
    padding: 0.5rem 0rem;
    display: flex;
    flex-direction: row;
    height: 10%;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
  }

  .active {
    background: rgba(249, 173, 73, 1);
  }

  .TopNav div {
    width: 25px;
    height: 15px;
  }

  img {
    height: 100%;
    margin-top: 0.2rem;
    width: 100%;
    object-fit: cover;
  }

  .BottomNav {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1rem 1rem;
    padding: 1.2rem;
    height: 80%;
    box-sizing: border-box;
  }

  .BottomNav span {
    border: 1px solid white;
    max-width: 150px;
    padding: 0.2rem 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    text-align: center;
    border-radius: 21px;
  }
`;

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { URL } from '../../utils/Constants';
import axios from 'axios';

let icons = [
  'contact-icon.svg',
  'all-icon.svg',
  'simu-icon.svg',
  'bowl-icon.svg',
];

const Navbar = ({
  style = false,
  playerId,
  setPlayerId,
  playerLeaderboardView,
  setLeaderboardView,
  setPlayerLeaderboardView,
  setFilters,
  filters,
  leaderboardView,
}) => {
  const [activePlayerIndex, setActivePlayerIndex] = useState(-1);
  const [active, setActive] = useState(0);
  const [filter, setActiveFilter] = useState(0);
  const [activePlayerId, setActivePlayerId] = useState(0);
  const players = JSON.parse(localStorage.getItem('playerIds'));

  const getGameId = () => {
    let gameId;
    if (active === 2) {
      gameId = '643d0c37573109234395514b';
    } else if (active == 3) {
      gameId = '643d08855731092343955149';
    }
    return gameId;
  };

  const addFilter = () => {
    let gameId = getGameId();
    let defFilter = { currentFilter: "Today's View", gameId };

    if (filter === 0) {
      defFilter.currentFilter = "Today's View";
    } else if (filter === 1) {
      defFilter.currentFilter = 'Monthly View';
    }
    setFilters(defFilter);
  };

  const getPlayerInfo = (id) => {
    if (active === 1 || active === 0) return;
    axios
      .post(URL + '/game/getUserEvent', {
        playerId: id,
        gameId: getGameId(),
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setFilters({ ...filters, activePlayerEventId: response.data[0]._id });
          localStorage.setItem('activePlayerId', id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!activePlayerId) return;
    getPlayerInfo(activePlayerId);
    setPlayerId(activePlayerId);
  }, [activePlayerId]);

  useEffect(() => {
    addFilter();
  }, [active, filter]);

  useEffect(() => {
    console.log(leaderboardView);
  }, [leaderboardView]);

  useEffect(() => {
    if (active == 1) {
      setPlayerLeaderboardView(true);
    }
  }, [activePlayerId]);

  const handleClick = (e, index) => {
    if (activePlayerIndex === index) {
      setActivePlayerIndex(-1);
      setActivePlayerId(null);
    } else {
      setActivePlayerIndex(index);
      setActivePlayerId(e.target.id);
    }
    if (active === 1) {
      setPlayerLeaderboardView(true);
    }
  };

  const handleParentNavClick = (i) => {
    console.log(i);
    setActive(i);
    if (i == 1) {
      setPlayerLeaderboardView(true);
    } else if (i == 0) {
      setLeaderboardView(false);
      setPlayerLeaderboardView(false);
    } else {
      setLeaderboardView(true);
      if (playerLeaderboardView) {
        setPlayerLeaderboardView(false);
      }
      setActivePlayerIndex(-1);
      setActivePlayerId(null);
    }
  };

  return (
    <NavStyle>
      <div className="parentNav" style={style ? style : null}>
        <div className="nav">
          {icons.map((icon, i) => {
            return (
              <>
                <div
                  key={i}
                  onClick={() => handleParentNavClick(i)}
                  className="navImage"
                >
                  <img
                    src={icon}
                    className={active === i ? 'black' : 'navImage'}
                  />
                </div>
                {i > 1 ? (
                  <div
                    key={i + 1}
                    className={i === active && i != 0 ? 'filters' : 'hidden'}
                  >
                    <div
                      onClick={() => {
                        setActiveFilter(0);
                      }}
                      className={filter === 0 ? 'activeFilter' : 'filter1'}
                    >
                      T
                    </div>
                    <div
                      onClick={() => {
                        setActiveFilter(1);
                      }}
                      className={filter === 1 ? 'activeFilter' : 'filter2'}
                    >
                      M
                    </div>
                  </div>
                ) : null}
              </>
            );
          })}
        </div>
        <div className="playerNav">
          {players.map((player, i) => {
            return (
              <div
                id={player}
                onClick={(e) => handleClick(e, i)}
                key={i}
                className={i ===activePlayerIndex ? 'player active' : 'player'}
              >
                P{i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </NavStyle>
  );
};

export default Navbar;

const NavStyle = styled.div`
  .nav {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
    padding: 0.5rem;
    background: rgba(248, 152, 28, 0.8);
    height: 100%;
  }

  .black {
    filter: invert(1);
  }

  .playerNav {
    text-align: center;
    height: 100%;
    background: black;
    padding: 0.5rem;
    width: 30px;
  }

  .nav div {
    cursor: pointer;
  }

  .navImage {
    width: 22px;
    margin: 0;
  }

  .navImage img {
    width: 100%;
    height: 100%;
  }

  .player {
    padding: 0.4rem;
    border: 1px solid white;
    color: white !important;
    border-radius: 50%;
    margin-top: 0.5rem;
    font-size: 0.7rem;
    cursor: pointer;
  }

  .active {
    background: rgba(248, 152, 28, 0.8);
  }

  .parentNav {
    height: 100vh;
    display: flex;
    flex-direction: row;
    z-index: 2;
  }

  .filters {
    display: flex;
    flex-direction: column;
    align-items: center;
    justiy-content: center;
    gap: 0.3rem;
  }

  .filters div {
    border: 1px solid white;
    border-radius: 50%;
    padding: 0.1rem 0.4rem;
    color: white;
  }

  .activeFilter {
    background-color: rgba(66, 93, 102, 1);
  }

  .hidden {
    display: none;
  }
`;

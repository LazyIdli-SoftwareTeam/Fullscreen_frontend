import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { BiSolidCricketBall } from 'react-icons/bi';
import { getPlayers } from './utils';
import Scroll from './Scroll';

const CricketTopNav = () => {
  return (
    <div className="cricket-top-nav-container">
      <div
        className="--img"
        style={{ display: 'flex', justifyContent: 'start' }}
      >
        <img src="cricket.svg" className="cricket" alt="cricket-logo" />
      </div>
      <span className="--lbd">CRICKET SIMULATOR LEADERBOARD</span>
      <div className="--img">
        <img src="logo.svg" className="logo" alt="logo" />
      </div>
    </div>
  );
};

const TableHeader = () => {
  return (
    <div className="cricket-table-header">
      <span className="--rank">RANK</span>
      <span className="--player-name">PLAYER</span>
      <span className="--level-played">LEVEL</span>
      <span className="--balls">BALLS</span>
      <span className="--runs">RUNS</span>
      <span className="--strike-rate">STRIKE/R</span>
    </div>
  );
};

const TableColumns = ({ index, user }) => {
  const getStyles = () => {
    if (index === 0) {
      return {
        border: 'none',
        color: 'black',
        background:
          'linear-gradient(90deg, #B8851B 0%, #D2A73E 8.33%, #D6AB42 17.19%, #F8DD7B 31.25%, #FDED99 48.96%, #FBEA92 66.15%, #F3D773 82.29%, #E2BD56 91.67%, #B58017 100%)',
      };
    } else if (index === 1) {
      return {
        border: 'none',
        color: 'black',
        background:
          'linear-gradient(90deg, #565656 0%, #D2D2D2 0%, #989898 9.67%, #FFFFFF 69.66%, #C0C0C0 82.12%, #757575 100%)',
      };
    } else if (index === 2) {
      return {
        border: 'none',
        background:
          'linear-gradient(90deg, #793515 0%, #893D14 11.5%, #B55E33 26.27%, #A04D27 40.88%, #C17651 55.66%, #993F0F 79.6%, #AC582F 89.16%, #863711 100%)          ',
      };
    } else return {};
  };

  const styles = getStyles();

  return (
    <>
      <div style={styles} className="cricket-table-column">
        <span className="--rank --index">{index + 1}</span>
        <span className="--column-player-name --player-name">
          {user.playerName}
        </span>
        <span className="--column-level-played --level-played">
          {user.gameLevel}
        </span>
        <span className="--column-balls --balls">{user.totalBall}</span>
        <span className="--column-runs --runs">{user.totalRun}</span>
        <span className="--column-strike-rate --strike-rate">
          {user.strikeRate}
        </span>
      </div>
      {index === 9 ? null : <div className="--line"></div>}
    </>
  );
};

const Cricket = () => {
  const videoRef = useRef(null); 
  const [players, setPlayers] = useState([
    {
      playerName: 'Adhi keshvan',
      gameLevel: 'Backyard',
      totalBall: 18,
      totalRun: 77,
      strikeRate: 427,
      rank: 1,
    },
    {
      playerName: 'Pravez',
      gameLevel: 'Local',
      totalBall: 18,
      totalRun: 69,
      strikeRate: 383,
      rank: 2,
    },
    {
      playerName: 'Nani',
      gameLevel: 'Local',
      totalBall: 18,
      totalRun: 69,
      strikeRate: 383,
      rank: 3,
    },
    {
      playerName: 'Dinkar',
      gameLevel: 'First Class',
      totalBall: 18,
      totalRun: 64,
      strikeRate: 356,
      rank: 4,
    },
    {
      playerName: 'Viswa',
      gameLevel: 'First Class',
      totalBall: 18,
      totalRun: 64,
      strikeRate: 356,
      rank: 5,
    },
    {
      playerName: 'Zeeshan',
      gameLevel: 'Local',
      totalBall: 18,
      totalRun: 63,
      strikeRate: 350,
      rank: 6,
    },
    {
      playerName: 'Naveen',
      gameLevel: 'First Class',
      totalBall: 6,
      totalRun: 20,
      strikeRate: 333,
      rank: 7,
    },
    {
      playerName: 'Naveen',
      gameLevel: 'First Class',
      totalBall: 12,
      totalRun: 38,
      strikeRate: 317,
      rank: 8,
    },
    {
      playerName: 'Ajith',
      gameLevel: 'Local',
      totalBall: 18,
      totalRun: 57,
      strikeRate: 317,
      rank: 9,
    },
    {
      playerName: 'Ayud',
      gameLevel: 'First Class',
      totalBall: 18,
      totalRun: 57,
      strikeRate: 317,
      rank: 10,
    },
  ]);
  const cricketVideoRef = useRef(null);
  const cricketTableColumns = useRef(null);
  // 180000
  const acceptGetPlayers = (response) => {
    console.log(response);
    if (response.status === 200) {
      setPlayers(response.data.responseBody.data);
    } else {
      console.log('error', response);
    }
  };
  const onReject = (error) => {
    console.log('error', error);
  };
  useEffect(() => {
    if (cricketVideoRef && cricketTableColumns) {
      const videoHeight = cricketVideoRef.current.clientHeight;
      console.log(videoHeight);
      cricketTableColumns.current.style.height = `calc(100vh - ${videoHeight}px  - 100px - 75px - 50px)`;
      console.log(cricketTableColumns.current.style.height);
    }
    getPlayers(acceptGetPlayers, onReject);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      getPlayers(acceptGetPlayers, onReject);
    }, 20000);
  }, [players]);

  return (
    <div className="cricket-leader-board-container">
      <CricketTopNav />
      <div className="cricket-leader-board-top-container">
        <span>TOP SC</span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BiSolidCricketBall size="28px" style={{ color: '#f5d65a' }} />
          RES
        </span>
      </div>
      <div className="cricket-table">
        <TableHeader />
        <div ref={cricketTableColumns} className="cricket-table-columns">
          {players.map((user, i) => (
            <TableColumns key={i} index={i} user={user} />
          ))}
        </div>
      </div>
      <div ref={cricketVideoRef} className="cricket-video">
        <video
          src="/Display Video.mp4"
          alt="cricket video"
          loop
          ref={videoRef}
          onLoad={() => {
            console.log('pladyingh');
            videoRef.current.play()
          }}
          autoPlay
          controls={false}
        />
      </div>
      <Scroll />
    </div>
  );
};

export default Cricket;

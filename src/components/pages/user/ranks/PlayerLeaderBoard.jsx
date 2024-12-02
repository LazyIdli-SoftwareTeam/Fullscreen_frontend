import { Button, TableBody, Table, TableContainer, TableHead, TableCell, TableRow } from '@mui/material';
import styled from 'styled-components';
import SportsRugbyIcon from '@mui/icons-material/SportsRugby';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../../../../utils/Constants';

const Players = [
  {
    gameName: 'Bowling', 
    score: '55', 
    rank: '22', 
    prize: '200 points', 
    icon() {
      return (
        <SportsRugbyIcon  sx={{ float: 'right' }} />
      )
    }
  }, 
  {
    gameName: 'Racing', 
    score: '52', 
    rank: '20', 
    prize: 'Next Time', 
    icon() {
      return (
        <SportsRugbyIcon sx={{ float: 'right' }} />
      )
    }
  }, 
  {
    gameName: 'Dancing', 
    score: '22', 
    rank: '44', 
    prize: 'Next Time', 
    icon() {
      return (
        <SportsRugbyIcon sx={{ float: 'right' }} />
      )
    }
  }, 
  {
    gameName: 'Dancing', 
    score: '22', 
    rank: '44', 
    prize: 'Next Time', 
    icon() {
      return (
        <SportsRugbyIcon sx={{ float: 'right' }} />
      )
    }
  }, 
  
  {
    gameName: 'Dancing', 
    score: '22', 
    rank: '44', 
    prize: 'Next Time', 
    icon() {
      return (
        <SportsRugbyIcon sx={{ float: 'right' }} />
      )
    }
  }, 
];

const LeaderBoard = ({ playerLeaderBoardView, playerId, setPlayerId }) => {
  const [players, setPlayers] = useState([]); 

  useEffect(() => {
    axios.post(URL + '/game/getUserRep',  {
      playerId: playerId
    })
    .then(response => {
      console.log(response);
      setPlayers([]);
    })
    .catch(err => {
      setPlayers([]); 
      console.log(err); 
    })
  }, [playerId])

  return (
    <LeaderBoardStyle>
      <div className={playerLeaderBoardView ? 'PlayerLeaderBoard' : 'hidden' }>
        <div className='top'>
          <h2>Hey Shimuli</h2>
          <Button type='text' disableRipple sx={{ backgroundColor: 'transparent', textTransform: 'none', color: 'rgba(255, 255, 255, 1)', 
          fontWeight: '600', paddingLeft: '1rem', margin: '0'  }}>
          Check out your overall performance and 
          discover which game you excelled at the 
          most. Prepare yourself to play once 
          more and reach your goals.
          </Button>
        </div>
        <div className='scores'>
          <TableContainer  sx={{ paddingTop: '0.5rem' }}>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell align='center' sx={{ fontWeight: '600', fontSize: '1.2rem', color: 'inherit' }}>Game</TableCell>
                  <TableCell align='center' sx={{ color: 'inherit'}} >Rank</TableCell>
                  <TableCell align='center' sx={{ color: 'inherit'}}>Score</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {players.map((row, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell  align='center' sx={{ fontWeight: '600', fontSize: '1.2rem', color: 'inherit' }}><div className='gameName'>{row.gameName}{row.icon()}</div></TableCell>
                      <TableCell align='center' sx={{ color: 'inherit'}}>{row.rank}</TableCell>
                      <TableCell align='center' sx={{ color: 'inherit'}}>{row.score}/100</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <div className='leaderboardText'>
            <p>Your Best Perfomed Game</p>
            <h4>BOWLING</h4>
            <div className='logo'>
              <img src='vector.png' />
            </div>
          </div>
            
        </div>
      </div>
    </LeaderBoardStyle>
  )
}

export default LeaderBoard; 


const LeaderBoardStyle = styled.div`


  .PlayerLeaderBoard {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    overflow: hidden;
  }

  .PlayerLeaderBoard .top {
    text-align: center;
    grid-column: span 8;
    background: url(bg.png);
    background-color: rgba(0, 0, 0, 1);
    box-shadow: inset 2px 2px 15px 105px rgba(0, 0, 0, 0.4);
    height: 200px;
    background-repeat: no-repeat;
    background-size: cover;
    backdrop-filter: opacity(50%);
  }

  .gameName {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
  }

  .hidden { 
    display: none;
  }

  h2 {
    background: linear-gradient(90deg, #F39A24 38.79%, #FFB74B 60.66%, #FFC737 87.12%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 1.8rem;
  }

  .scores {
    height: calc(100vh - 200px);
    background: url(Group.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-color: rgba(0, 0, 0, 1);
    grid-column: 1 / -1;
    color: rgba(255, 255, 255, 1) !important;
    overflow-y: scroll; 
    overflow-x: hidden;
  }

  .leaderboardText {
    display: flex;
    height: 60%; 
    flex-direction: column;
    color: rgba(255, 255, 255, 1) !important; 
    justify-content: center;
    align-items: center;
  }

  .leaderboardText p {
    font-size: 1.2rem;
    letter-spacing: 1.2px;
    font-weight: 400; 
    margin: 0;
    padding: 0.3rem; 
  }


  .leaderboardText  h4 {
    color: white !important;
    font-size: 2rem;
    margin: 0;
    padding: 0.5rem; 
  }

  .leaderboardText .logo {
    width: 40px;
  }

  .leaderboardText .logo img {
    width: 100%;
  }


`
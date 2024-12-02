import { useContext } from 'react';
import { PageState } from '../../pageState';
import { Button } from '@mui/material';
import { useState } from 'react';
import styled from 'styled-components';
const { getRequest }  = require('../../utils/axiosClient');
const  { PAGE_STATE } = require('../../utils/Constants');


const SelectGames = ({ hoverColor, setEmpInfo, empInfo,  games, activeIndex, setActiveIndex }) => {
  const page = useContext(PageState.pageState);
  console.log(games);

  useState(() => {
    setEmpInfo({ ...empInfo, loginFor: { _id: '643d08855731092343955149' }});
  }, [empInfo])

  const clickHandler = (value, i) => {
    setEmpInfo({ ...empInfo, loginFor: games[i] });
    setActiveIndex(i);
  } 
  
  if (page.pageState.state != PAGE_STATE.VERIFIED) {
    return (
      <h1>{page.pageState.msg}</h1>
    )
  } else {
    return (
      <GameSelectionStyle>
        <div className='games'>
          {games.map((game, i) => {
            return (
              <p key={i} className={i == activeIndex ? 'active' : null} onClick={(e) => clickHandler(game, i)}>{game.gameName}</p>
            )
          })}
        </div>  
      </GameSelectionStyle>
    )
  }
}


export default SelectGames;

const GameSelectionStyle = styled.div`
  .games {
    width: 100%;
    text-align: left;
  }
  .games  p  {
    background: rgba(0, 0, 0, 1);
    padding: 0.4rem 1.2rem;
    text-transform: none; 
    font-weight: 400;
  }

  .active {
    background-color: rgba(249, 173, 73, 1) !important;
  }
`
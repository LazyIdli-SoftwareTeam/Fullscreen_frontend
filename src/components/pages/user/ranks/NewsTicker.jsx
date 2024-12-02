import React from 'react';
import Ticker from 'react-ticker';
import './newsTick.css';
const MoveStuffAround = ({ rootContent }) => {
  const content =
    rootContent || 'Ask the operator to get YOU on the Leaderboard !';
  return (
    <>
      <div className="scrollEleSpec">
        <div className="loopEle primary">{content}</div>
        <div className="loopEle secondary">{content}</div>
      </div>
    </>
  );
};
export default MoveStuffAround;

import React from 'react';
import './scroll.css';
const Scroll = () => {
  const content = 'Get on the Leaderboard and win exciting Merchandise from Straight Drive!';
  return (
    <>
      <div style={{ background: '#0c2226' }} className="scrollEleSpec">
        <div style={{ color: '#f5d65a' }} className="loopEle primary1">{content}</div>
        {/* <div style={{ color: '#f5d65a', marginLeft: '300px' }} className="loopEle secondary2">{content}</div> */}
      </div>
    </>
  );
};
export default Scroll;

import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import svgTeho from '../../utils/Project Teho Logo - White.svg';
import playLogo from '../../utils/play_logo.jpg';
import torq from '../../utils/torq.webp';

const Topbar = ({ filters = false, header, logo }) => {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const queryParameters = new URLSearchParams(window.location.search);
  const branch = queryParameters.get('branchid');
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return (
    <TopbarStyle>
      <div className="Topbar">
        <div className="CompanyLogo">
          <img src={logo || playLogo} style={{ width: '6vh' }} />
        </div>
        <div
          style={{ marginLeft: '15px', fontWeight: '600', fontSize: '2vh' }}
        >
          <span>{header}</span>
        </div>

        <div className="SponserInfo">
          {/* <span style={{ fontSize: "2vh" }}>Powered By</span> */}
          <img
            src={svgTeho}
            style={{
              width: '8vh',
            }}
          />
        </div>
      </div>
    </TopbarStyle>
  );
};

export default Topbar;

const TopbarStyle = styled.div`
  .Topbar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.7rem 0.5rem 0.4rem 0.5rem;
    box-sizing: border-box;
    z-index: 3;
    font-family: Montserrat;
  }

  .CompanyLogo {
    display: inline;
  }

  .SponserInfo {
    display: inline-flex;
    float: right;
  }
`;

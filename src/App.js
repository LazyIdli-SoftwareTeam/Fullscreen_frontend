import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './index.css';
import { useState, useEffect } from 'react';
import LeaderBoardAll from './components/pages/user/ranks/LeaderBoardAll';
import { PAGE_STATE } from './utils/Constants';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
// import dbOperations from "./IndexDB";
import Topbar from './components/customComponent/Topbar';
import Cricket from './components/Cricket/Cricket';

//disble cursor in code box

function App() {
  const [pageState, setPageState] = useState({
    state: PAGE_STATE.NOTLOADED,
    msg: 'Loading...',
    others: {},
  });
  const [searchParam, setSearchParam] = useSearchParams();
  const [loader, setLoader] = useState(true);
  const [filters, setFilters] = useState({
    currentFilter: '',
    user_id: '',
    player_id: '',
  });
  const [kiosk, setKiosk] = useState({
    _id: '',
    mediaForTopAd: [],
    mediaForBottomOffers: [],
    footer: '',
    header: '',
    instructionVideo: [],
  });

  const [common, setCommon] = useState({
    footer: '',
    header: '',
  });



  useEffect(() => {
    if (window.location.pathname == '/cricket') return;
    const KioskId = searchParam.get('kioskId');
    if (window.location.pathname)
      if (!KioskId)
        return setPageState({ msg: 'No kiosk id found', state: 'error' });
    setPageState({ msg: 'loading', state: 'loading' });
    axios
      .get('http://localhost:3300/links')
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.data.kiosk.customId != KioskId) {
            return setPageState({
              msg: 'No kiosk with this id found',
              state: 'error',
            });
          }
          setKiosk(response.data.data.kiosk);
          setCommon(response.data.data.common);
          setPageState({ msg: 'loaded', state: 'done' });
        } else {
          setPageState({ msg: 'Some error occurred', state: 'error' });
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (pageState.state === 'error' && window.location.pathname != '/cricket') {
    return <span>{pageState.msg}</span>;
  }
  const branchId = kiosk.branchId;
  if (pageState.msg != 'loaded' && window.location.pathname != '/cricket') {
    return <span>Loading...</span>;
  } else {
    if (kiosk.archive) {
      return (
        <div className="leaderboard-archive">
          <div className="leaderboard-top-container">
            <img src="disabled.svg" />
          </div>
          <div className="leaderboard-bottom-text">
            <span>
              We are currently working to make your experience better!
            </span>
          </div>
        </div>
      );
    }
    const leaderboard = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Topbar
          filters={filters}
          header={kiosk.header}
          logo={common.logo ? common.logo.src : ''}
        />
        <LeaderBoardAll
          branchId={branchId}
          Kiosk={kiosk}
          common={common}
          mainPage={true}
          setFilters={setFilters}
          filters={filters}
        />
      </div>
    );
    return (
      <Routes>
        <Route path="/" element={leaderboard} />
        <Route path="/cricket" element={<Cricket />} />
      </Routes>
    );
  }
}

export default App;

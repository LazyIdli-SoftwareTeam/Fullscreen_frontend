import {  useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './leaderBoardAll.css';
import VideoSlider from './videoSlider';

const getMedia = (kiosk, key) => {
  const links = [];
  if (key === 'instructionVideo') {
    if (kiosk[key] && kiosk.instructionVideo[0]) {
      console.log(kiosk);
      return (
        'http://localhost:3300/' +
        kiosk.customId +
        '/' +
        key +
        '/' +
        kiosk.instructionVideo[0].fileName
      );
    } else {
      return '';
    }
  } else {
    for (const info of kiosk[key]) {
      links.push(
        'http://localhost:3300/' +
          kiosk.customId +
          '/' +
          key +
          '/' +
          info.fileName
      );
    }
  }
  return links;
};

const LeaderBoardAll = ({
  style = false,
  filters,
  setFilters,
  Kiosk,
  leaderboardView,
  common,
  mainPage,
}) => {
  const [display, setDisplay] = useState(getMedia(Kiosk, 'mediaForTopAd'));
  const [offerImages, setOfferImages] = useState(
    getMedia(Kiosk, 'mediaForBottomOffers')
  );
  const [instructionVideo, setInstructionVideo] = useState(
    getMedia(Kiosk, 'instructionVideo')
  );
  console.log('instructionVideo', instructionVideo);

  useEffect(() => {
    const id = setTimeout(() => {
      axios.get('http://localhost:3300/links').then((response) => {
        if (
          response.status === 200 &&
          response.data.data.kiosk.customId === Kiosk.customId
        ) {
          const display = getMedia(response.data.data.kiosk, 'mediaForTopAd');
          const offerImages = getMedia(
            response.data.data.kiosk,
            'mediaForBottomOffers'
          );
          const instructionVideo = getMedia(
            response.data.data.kiosk,
            'instructionVideo'
          );
          console.log(display);
          console.log(offerImages);
          setDisplay(display);
          setOfferImages(offerImages);
          setInstructionVideo(instructionVideo);
        } else {
          console.log(response);
        }
      });
    }, 20000);
    return () => clearTimeout(id);
  }, [display, offerImages, instructionVideo]);

  useEffect(() => {
    const socket = io('http://localhost:4700');
    socket.on('error', (e) => {
      console.log('socket error', e);
    });
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('reload', () => {
      window.location.reload();
    });
  }, []);

  return (
    <div
      style={{
        height: '100dvh', 
        position: 'absolute', 
        left: 0, 
        top: 0
      }}
    >
      <VideoSlider videos={[...display, ...instructionVideo]}  />
    </div>
  );
};

export default LeaderBoardAll;

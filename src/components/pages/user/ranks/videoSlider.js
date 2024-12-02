import { useState } from 'react';
import './leaderBoardAll.css';
import { useRef } from 'react';
import { useEffect } from 'react';
const VideoSlider = ({ videos }) => {
  const colors = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FFBB28',
    '#FFBB28',
    '#FFBB28',
  ];
  const vidRef1 = useRef(null);
  const vidRef2 = useRef(null);
  const vidRef3 = useRef(null);
  const vidRef4 = useRef(null);
  const vidRef5 = useRef(null);
  const vidRef6 = useRef(null);
  const refs = [vidRef1, vidRef2, vidRef3, vidRef4, vidRef5, vidRef6];
  const [index, setIndex] = useState(0);
  const handlePlayVideo = () => {
    refs[index].current.play();
  };
  useEffect(() => {
    console.log('index', index);
  }, [index]);
  const enedOfVideo = () => {
    if (videos.length == 1) {
      setIndex(0);
      refs[0].current.play();
    } else {
      setIndex(index + 1);
    }
  };
  useEffect(() => {
    console.log(videos);
  }, []);
  useEffect(() => {
    setTimeout(function () {
      //your code to be executed after 1 second
      handlePlayVideo();
    }, 1200);
  }, [index]);
  return (
    <div className="slideshow">
      <div className="slideshowSlider">
        {videos.map((x, i) => (
          <div
            className="slide"
            key={i}
            style={{
              backgroundColor: 'black',
              display: 'inline-block',
              width: `${index == i ? '100%' : '0%'}`,
              transition: 'width 1000ms',
            }}
          >
            <video
              ref={refs[i]}
              className="adds"
              src={x}
              autplay
              style={{ objectFit: 'fit', width: '100%', height: '100%' }}
              onEnded={() => {
                console.log('video ended');
                enedOfVideo();
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default VideoSlider;

import { Box } from "@mui/system";
import  styled  from 'styled-components';
import { useState  } from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Context } from "../pages/user/AuthState";
import { useContext, useEffect, useRef } from "react";


const constantRangeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


export const RangeBoxWhole = ({ otpVerified, setRangeArray, rangeArray }) => {
  const range = useContext(Context.Range); 


  const RangeBox = ({ range }) => {

    
    return (
      <BoxStyle>
      <div className='rangeBox'>
        {rangeArray.map((el , i) => {
          return (
            <Box component='span' key={i} sx={{ 
              padding: '0.5rem'
            }}
            className={el == range.rangeIndex ? 'boxActive firstChild' : null}
            >
              <span  onClick={(e) => {
                if (otpVerified === '2') return;
                range.setRangeIndex(el);
              }}>{el}</span>
            </Box>
          )
        })}
      </div>
      </BoxStyle>
    )
  };


  useEffect(() => {
    console.log(range.rangeIndex);
  }, [range.rangeIndex])


  const changeRange = (arrow) => {
    console.log(otpVerified);
    if (otpVerified === '2') return;
    if (arrow === 'left') {
      if (rangeArray[0] - 10 > 0) {
        setRangeArray(prevState => { 
          if (rangeArray[0] - 1 >= 1) {
            range.setRangeIndex(rangeArray[0] - 1);
          }
          return prevState.map(prev => prev - 10);
        })
      }
    } else if (arrow === 'right') {
      setRangeArray(prevState => {
        range.setRangeIndex(rangeArray[0] + 10);
        return prevState.map(prev => prev + 10)
      });
    }
  }


  return (
    <RangeBoxStyle>
      <span className='RangeHeading'>Choose number of people</span>
      <div className='RangeBox'>
        <KeyboardArrowLeftIcon onClick={() => changeRange('left')}/> 
        <RangeBox range={range} />
        <KeyboardArrowRightIcon onClick={() => changeRange('right')}/>
      </div>
    </RangeBoxStyle>
  )
}



const BoxStyle = styled.div`
  .boxActive {
    background-color: rgba(248, 152, 28, 1);
    padding: 0.5rem 0.4rem;
  }

  .rangeBox {
    border-radius: 8px;
    background-color: rgba(248, 152, 28, 0.8);
    padding: 0.5rem 0.3rem;

  }
`


const RangeBoxStyle = styled.div`
  .RangeHeading {
    grid-column: 1 / -1;
  }

  .RangeBox {
    margin-top: 0.8rem;
    display: flex; 
    flex-direction: row; 
    justify-content: center; 
    align-items: center; 
  }
`
import styled from 'styled-components';

const Alert = ({ message, showAlert }) => {
	return (
		<AlertStyle>
			<div className={showAlert ? 'Alert' : 'Alert invisible'} >
				<span> {message} </span>
			</div>
		</AlertStyle>
	)
}


export default Alert;

const AlertStyle = styled.div`

  .Alert {
    height: auto; 
    width: 80%;
    position: absolute;
    left: calc(10% - 0.8rem);
    padding: 0.8rem;
    border: 0.5px solid black;
    border-radius: 13px;
    animation-name: animate; 
    animation-duration: 5s; 
    opacity: 0;
  }
  
  
  @keyframes animate {
    10% { 
      transform: translateY(50vh); 
    }
  
    30% {
      transform: translateY(100vh); 
    }

    100% {
      opacity: 1;
    }

  }

`
import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .loader {
    width: 48px;
    height: 48px;
    margin: auto;
    position: relative;
  }

  .loader:before {
    content: '';
    width: 48px;
    height: 5px;
    background: #6d53f4;
    position: absolute;
    top: 60px;
    left: 0;
    border-radius: 50%;
    animation: shadow324 0.5s linear infinite;
  }

  .loader:after {
    content: '';
    width: 100%;
    height: 100%;
    background: #6d53f4;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    animation: jump7456 0.5s linear infinite;
  }

  @keyframes jump7456 {
    15% { border-bottom-right-radius: 3px; }
    25% { transform: translateY(9px) rotate(22.5deg); }
    50% { transform: translateY(18px) scale(1, .9) rotate(45deg); border-bottom-right-radius: 40px; }
    75% { transform: translateY(9px) rotate(67.5deg); }
    100% { transform: translateY(0) rotate(90deg); }
  }

  @keyframes shadow324 {
    0%, 100% { transform: scale(1, 1); }
    50% { transform: scale(1.2, 1); }
  }
`;

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
};

export default Loader;
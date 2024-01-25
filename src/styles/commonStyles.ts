import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
    width: 100%;
    margin: auto;
    padding: auto;
    box-sizing: border-box;
    overflow-y: auto;
`;

const commonStyles = {
    maxWidth: '600px',
    width: '100%',
    mx: 'auto',
    boxSizing: 'border-box', // 패딩과 보더를 너비에 포함
};


export { Wrapper, commonStyles };

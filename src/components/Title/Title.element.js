import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const TitleComp = styled.p`
  font-size: 27px;
  font-weight: 900;
  color: #61527f;
  @media screen and (max-width: 600px) {
    font-size: 24px;
    font-weight: 700;
    color: #61527f;
  }
`;

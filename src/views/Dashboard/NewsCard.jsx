import React from "react";
import styled from "styled-components";

export const NewsCard = ({ news }) => {
  return (
    <StyledLink target="_" href={news.news_url}>
      <Container>
        <Image src={news.image_url} />
        <TextWrapper>
          <Header>{news.title}</Header>
        </TextWrapper>
      </Container>
    </StyledLink>
  );
};

const StyledLink = styled.a`
  text-decoration: none;
  width: 90%;
`;

const TextWrapper = styled.div`
  text-align: left;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 40px;
  height: 44px;
`;

const Image = styled.img`
  min-width: 70px;
  min-height: 40px;
  width: 70px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
  margin-left: 15px;
`;

const Header = styled.div`
  margin: 0;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0.32px;
`;

const Container = styled.div`
  margin: 5px 0;
  height: 70px;
  max-height: 80px;

  width: 100%;
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  flex-direction: row;

  justify-content: flex-start;
  align-items: center;

  background-color: #1d1d21;
  border-bottom: solid 1px #2d2d34;
  border-radius: 5px;
`;

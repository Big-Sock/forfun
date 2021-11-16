import React from "react";
import styled from "styled-components";
import { NewsCard } from "./NewsCard";

export const News = ({ news }) => {
  return (
    <NewsContainer>
      {news.map((news) => (
        <NewsCard news={news} />
      ))}
    </NewsContainer>
  );
};

const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0;
  height: 80%;
  overflow-y: scroll;
  box-sizing: border-box;
  align-items: center;

  @media only screen and (max-width: 991px) {
    margin-left: 0;
    margin-top: 1%;
  }
`;

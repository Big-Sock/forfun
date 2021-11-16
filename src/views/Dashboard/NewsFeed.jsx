import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { News } from "./News";

export const NewsFeed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("api/stocks/stock-news").then((response) => {
      setNews(response.data.data);
    });
  }, []);

  return (
    <NewsFeedDiv>
      <Title>News</Title>
      <Divider />
      {news ? <News news={news} /> : <p>Unable to get news</p>}
    </NewsFeedDiv>
  );
};

const NewsFeedDiv = styled.div`
  height: 60%;
  padding: 0 0 30px;
  margin-left: 2%;
  margin-top: 2%;

  border-radius: 5px;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  box-sizing: border-box;
  overflow: hidden;

  @media only screen and (max-width: 991px) {
    height: 40vmax;
    margin-left: 0;
    margin-top: 10px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: left;
  margin-left: 5%;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #2d2d34;
  //margin-bottom: 10px;
`;

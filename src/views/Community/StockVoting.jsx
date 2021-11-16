import axios from "axios";
import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useWallet } from "use-wallet";
import { connectProvider } from "../../web3/utils";

const Stock = (props) => {
  const { account } = useWallet();

  const vote = async (e) => {
    e.preventDefault();
    let ticker = e.target.name;

    const { provider } = await connectProvider();
    const signer = provider.getSigner();
    const sig = await signer.signMessage(
      JSON.stringify({
        address: account,
        ticker,
      })
    );
    axios
      .post(`api/gov/stock-votes`, {
        address: account,
        ticker,
        sig,
      })
      .then((res) => {
        let voteIndex;
        let newStocks = [];
        const stockVotes = res.data;

        for (const stock of stockVotes) {
          stock.previouslyVoted = false;
          voteIndex = stock.votes.findIndex((vote) => vote.address === account);

          if (voteIndex !== -1) {
            stock.previouslyVoted = true;
          }
          newStocks.push(stock);
        }

        props.setStockVotes(newStocks);
        Swal.fire("Success", "Voting successful!", "success");
      })
      .catch((err) => {
        Swal.fire("Error", err.response.data, "error");
      });
  };

  return (
    <StockCard>
      <Info>
        <StockName>{props.ticker}</StockName>
        <StockDescription>{props.desc}</StockDescription>
        <Progress>{props.totalVotes} Votes</Progress>
        {/*<LinearProgress*/}
        {/*  style={{ marginTop: "10px",height: "10px" }}*/}
        {/*  variant="determinate"*/}
        {/*  value={(props.totalVotes/500) * 100} // in percent*/}
        {/*/>*/}
        <Button
          type="submit"
          name={props.ticker}
          onClick={(e) =>
            props.previouslyVoted
              ? Swal.fire(
                  "Already Voted!",
                  "You cannot vote for the same stock twice at this time, but you may switch your vote.",
                  "error"
                )
              : vote(e, 1)
          }
          previouslyVoted={props.previouslyVoted}
        >
          Vote for {props.ticker}
        </Button>
      </Info>
    </StockCard>
  );
};

export const StockVoting = ({ stockVotes, setStockVotes }) => {
  return (
    <StockContainer>
      <Wrapper>
        <Title>Stock Voting</Title>
      </Wrapper>
      <Divider />
      {stockVotes.map((stock) => {
        return (
          <Stock
            key={stock.ticker}
            ticker={stock.ticker}
            desc={stock.desc}
            totalVotes={stock.votes.length}
            setStockVotes={setStockVotes}
            previouslyVoted={stock.previouslyVoted}
          />
        );
      })}
    </StockContainer>
  );
};

const Title = styled.div`
  font-size: 25px;
  text-align: left;
  margin: 20px 0 15px 20px;
  font-family: "Sophia Nubian Bold", sans-serif;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #2d2d34;
  margin-bottom: 30px;
`;

const Info = styled.div`
  width: 90%;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Progress = styled.div`
  margin-top: 10px;
`;

const StockDescription = styled.div`
  color: #c1c1c1;
  text-align: center;
  font-size: 18px;
  margin-top: 5px;
  @media only screen and (max-width: 991px) {
    font-size: 20px;
  }
`;
const StockName = styled.div`
  font-size: 25px;
`;

const StockContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0 10px 10px;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  background-color: #1d1d21;
  color: white;
  font-size: 20px;
  @media only screen and (max-width: 991px) {
    width: 90%;
    margin: 10px 0;
  }
`;

const StockCard = styled.div`
  width: 90%;
  margin-bottom: 15px;
  color: white;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-size: 20px;
`;

const Button = styled.button`
  margin: 20px 0;
  cursor: pointer;
  display: flex;
  background-color: ${(props) => (props.previouslyVoted ? "grey" : "#3c5bd8")};
  opacity: ${(props) => (props.previouslyVoted ? "0.5" : "0.8")};
  border-radius: 5px;
  border: none;
  color: white;
  padding: 10px;
  font-size: 20px;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  align-items: center;
  justify-content: center;
  font-family: "Sophia Nubian Bold", sans-serif;

  &:hover {
    opacity: 1;
    color: white;
  }
`;

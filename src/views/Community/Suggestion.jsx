import AccountBoxIcon from "@material-ui/icons/AccountBox";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import { connectProvider } from "../../web3/utils";

export const Suggestion = ({ fetchSuggestions, suggestions, isDesktop }) => {
  const [votes, setVotes] = useState(0);
  const { account } = useWallet();

  useEffect(() => {
    setVotes(1);
  }, [account]);

  const newStyledSuggestions = suggestions.map((suggestion, index) => {
    let votesColor = "white";

    if (suggestion.upDooted) {
      votesColor = "#3c5bd8";
    } else if (suggestion.downDooted) {
      votesColor = "#de3a3a";
    }

    const castVote = async (voteAmount) => {
      const { provider } = await connectProvider();
      const signer = provider.getSigner();
      const sig = await signer.signMessage(
        JSON.stringify({
          address: account,
          suggestionId: suggestion._id,
          voteAmount,
        })
      );
      axios
        .post(`api/gov/vote`, {
          address: account,
          voteAmount,
          suggestionId: suggestion._id,
          sig,
        })
        .then((res) => {
          fetchSuggestions();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const upDoot = () => {
      if (suggestion.upDooted) return;
      castVote(votes);
    };
    const downDoot = () => {
      if (suggestion.downDooted) return;
      castVote(votes * -1);
    };
    return (
      <SuggestionCard key={index}>
        <UserVotes>
          <Upvote
            onClick={() => upDoot()}
            style={suggestion.upDooted ? { fill: "#3c5bd8" } : {}}
            viewBox="0 0 400 400"
            preserveAspectRatio="none"
          >
            <path strokeWidth="3" d="M 100 100 L 300 100 L 200 300 z" />
          </Upvote>
          <Votes>
            <ColorVotes style={{ color: votesColor }}>
              {suggestion.totalVotes.toLocaleString()}
            </ColorVotes>
          </Votes>
          <Downvote
            onClick={() => downDoot()}
            style={suggestion.downDooted ? { fill: "#de3a3a" } : {}}
            viewBox="0 0 400 400"
            preserveAspectRatio="none"
          >
            <path strokeWidth="3" d="M 100 100 L 300 100 L 200 300 z" />
          </Downvote>
        </UserVotes>
        <Information>
          <Header>
            <UserInfo>
              <AccountBoxIcon
                style={{ marginRight: "5px", marginLeft: "-3px" }}
              />
              <Address>
                {isDesktop
                  ? suggestion.address
                  : suggestion.address.substring(0, 6) +
                    "..." +
                    suggestion.address.substring(suggestion.address.length - 4)}
              </Address>
            </UserInfo>
            <Timestamp>{moment(suggestion.timestamp).fromNow()}</Timestamp>
          </Header>

          <SuggestionBody>{suggestion.message}</SuggestionBody>
        </Information>
      </SuggestionCard>
    );
  });
  return newStyledSuggestions;
};

const Upvote = styled.svg`
  width: 30px;
  height: 20px;
  stroke: white;
  fill: white;
  cursor: pointer;
  transition: all 0.2s linear;
  transform: scaleY(-1);
  &:hover {
    fill: #3c5bd8;
    stroke: #3c5bd8;
  }
`;
const Votes = styled.div`
  margin: 5px 0;
`;
const Downvote = styled.svg`
  width: 30px;
  height: 20px;
  stroke: white;
  fill: white;
  cursor: pointer;
  transition: all 0.2s linear;
  &:hover {
    fill: #3c5bd8;
    stroke: #3c5bd8;
  }
`;

const ColorVotes = styled.div`
  font-size: 15px;
  letter-spacing: 0.5px;
  line-height: 15px;
  display: flex;
  align-items: center;
  font-family: "Sophia Nubian Bold";
`;

const UserVotes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 15px;
  @media only screen and (max-width: 360px) {
    margin: 0 10px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Address = styled.div`
  font-size: 15px;
`;
const Timestamp = styled.div`
  font-size: 0.75em;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 18px;
  color: #c1c1c1;
  align-items: center;
`;

const SuggestionBody = styled.div`
  word-break: break-word;
  text-align: left;
  font-size: 16px;
`;

const Information = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const SuggestionCard = styled.div`
  width: 90%;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  background-color: #16161a;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
  box-sizing: border-box;
  font-size: 16px;
  color: white;
  padding: 10px 20px 13px 0;
`;

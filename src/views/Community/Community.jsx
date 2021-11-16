import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useWallet } from "use-wallet";
import isMobile from "../../utils/isMobile";
import { connectProvider } from "../../web3/utils";
import { BaseView } from "../BaseView";
import { StockVoting } from "./StockVoting";
import { Suggestion } from "./Suggestion";

export const Community = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [stockVotes, setStockVotes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [sort, setSort] = useState("new");
  const [userAlreadySuggested, setUserAlreadySuggested] = useState(false);
  const { account, connect } = useWallet();
  const [active, setActive] = useState({ top: false, new: true });
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1100);
  const [showConnect, setShowConnect] = useState(window.innerWidth > 990);

  const updateWindow = () => {
    setIsDesktop(window.innerWidth > 1100);
    setShowConnect(window.innerWidth > 990);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindow);
    return () => window.removeEventListener("resize", updateWindow);
  });

  useEffect(() => {
    axios
      .get(`/api/gov/stock-votes`)
      .then((res) => {

        let voteIndex;
        let newStocks = [];
        const stockVotes = res.data;

        for (const stock of stockVotes) {
          stock.previouslyVoted = false;
          voteIndex = stock.votes.findIndex((vote) => vote.address === account);

          if (voteIndex !== -1 ) {
            stock.previouslyVoted = true;
          }
          newStocks.push(stock)
        }
        setStockVotes(newStocks);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [account]);

  const unlock = () => {
    if (isMobile() && !window.ethereum) {
      Swal.fire("Mobile use requires MetaMask browser.");
      return;
    } else if (!window.ethereum) {
      Swal.fire(
        "Our site requires the MetaMask extension to function properly!"
      );
      return;
    }
    connect("injected");
  };

  const fetchSuggestions = useCallback(() => {
    axios
      .post(`/api/gov/get-suggestions`, {
        address: account,
        page,
        sort,
      })
      .then((res) => {
        setSuggestions(res.data.suggestions);
        setUserAlreadySuggested(res.data.userAlreadySuggested);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [account, page, sort]);

  useEffect(() => {
    if (account) {
      fetchSuggestions();
    }
  }, [page, sort, account, fetchSuggestions]);

  const handleChange = (e) => {
    if (e.target.value.length > 200) return;
    setNewSuggestion(e.target.value);
  };

  const submitSuggestion = async (e) => {
    e.preventDefault();
    if (!newSuggestion) {
      Swal.fire("You must write a suggestion");
      return;
    }

    const { provider } = await connectProvider();
    const signer = provider.getSigner();
    const sig = await signer.signMessage(
      JSON.stringify({
        address: account,
        suggestion: newSuggestion,
      })
    );
    axios
      .post(`/api/gov/suggestion`, {
        address: account,
        sig,
        suggestion: newSuggestion,
      })
      .then((res) => {
        setSort("new");
        setNewSuggestion("");
        fetchSuggestions();
      })
      .catch((err) => {
        console.log(err.response);
        Swal.fire({
          title: `Error: ${err.response ? err.response.status : 404}`,
          text: `${err.response ? err.response.data : "server error"}`,
          icon: "error",
        });
      });
  };

  const toggleSort = (newSort) => {
    setSort(newSort);
    setPage(0);
    if (newSort === "top") {
      setActive({ top: true, new: false });
    } else {
      setActive({ top: false, new: true });
    }
  };

  if (!account) {
    return (
      <BaseView>
        {showConnect ? (
          <Container>
            <ApproveContainer>
              <ApproveButton onClick={unlock}>Connect Wallet</ApproveButton>
            </ApproveContainer>
          </Container>
        ) : (
          <></>
        )}
      </BaseView>
    );
  }

  return (
    <BaseView>
      <Container>
        <Content>
          <GovContainer>
            <Header>
              <Title>Governance</Title>
              <SubTitle>Help suggest what we should do next</SubTitle>
              <SubTitle>You can make one suggestion every 24 hours</SubTitle>
            </Header>
            <SuggestionContainer>
              {newSuggestion && isDesktop && (
                <CharLimit
                  style={{
                    color: newSuggestion.length >= 200 ? "red" : "white",
                  }}
                >
                  {newSuggestion.length}/200
                </CharLimit>
              )}
              <Form>
                <Wrapper>
                  {newSuggestion && !isDesktop && (
                    <CharLimit
                      style={{
                        color: newSuggestion.length >= 200 ? "red" : "white",
                      }}
                    >
                      {newSuggestion.length}/200
                    </CharLimit>
                  )}
                  <InputWrapper>
                    <Input
                      maxlength="200"
                      placeholder="Type here..."
                      value={newSuggestion}
                      onChange={(e) => handleChange(e)}
                      isDesktop={isDesktop}
                    />
                  </InputWrapper>
                </Wrapper>
                <SubmitButton
                  disabled={userAlreadySuggested}
                  type="submit"
                  onClick={(e) => submitSuggestion(e)}
                >
                  Submit
                </SubmitButton>
              </Form>
            </SuggestionContainer>

            <Sorting>
              <OptionContainer>
                <Option
                  className={"top"}
                  onClick={() => toggleSort("top")}
                  active={active.top}
                >
                  Top
                </Option>
                <Option
                  className={"new"}
                  onClick={() => toggleSort("new")}
                  active={active.new}
                >
                  New
                </Option>
              </OptionContainer>
            </Sorting>

            {suggestions.length > 0 && (
              <Suggestion
                fetchSuggestions={() => fetchSuggestions()}
                suggestions={suggestions}
                isDesktop={isDesktop}
              />
            )}

            <Pagination>
              <ReactPaginate
                previousLabel={"◄"}
                nextLabel={"►"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={(data) => setPage(data.selected)}
                forcePage={page}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </Pagination>
          </GovContainer>
          <StockVoting
            stockVotes={stockVotes}
            setStockVotes={setStockVotes}
          />
        </Content>
      </Container>
    </BaseView>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 90%;

  @media only screen and (max-width: 991px) {
    flex-direction: column-reverse;
    align-items: center;
    width: 100%;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 15px;
  font-family: "Sophia Nubian Bold", sans-serif;
  @media only screen and (max-width: 470px) {
    margin-bottom: 5px;
  }
`;

const SubTitle = styled.div`
  margin: 0 5px;
  font-size: 20px;
  line-height: 27px;
  color: #c1c1c1;
  @media only screen and (max-width: 470px) {
    font-size: 15px;
  }
`;

const GovContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0 10px 10px;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  background-color: #1f1e21;
  color: white;
  padding: 20px 0;
  flex: 1;
  font-size: 20px;
  @media only screen and (max-width: 991px) {
    width: 90%;
    margin: 0 0 10px 0;
  }
`;

const SuggestionContainer = styled.div`
  width: 90%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 15px;
  @media only screen and (max-width: 991px) {
    margin-bottom: 5px;
  }
`;

const CharLimit = styled.div`
  font-size: 14px;
  padding: 5px;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  background-color: #1d1d21;
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  @media only screen and (max-width: 991px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
`;

const Input = styled.textarea`
  background: none;
  border: 0;
  width: 100%;
  font-size: 16px;
  flex: 1;
  color: white;
  margin: 10px 0 10px 0;
  padding: 0 5px 0 0;
  outline: none;
  resize: none;
  font-family: "Sophia Nubian Regular", sans-serif;

  ::placeholder {
    color: #c1c1c1;
    opacity: 1;
  }
`;

const InputWrapper = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  padding: 0 5px 0 15px;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  background-color: #16161a;
  color: white;
  flex: 1;
  box-sizing: border-box;
  @media only screen and (max-width: 991px) {
    margin-right: 0;
  }
`;

const SubmitButton = styled.button`
  cursor: pointer;
  display: flex;
  width: 150px;
  margin-left: 10px;
  background-color: #3c5bd8;
  border-radius: 5px;
  border: none;
  color: white;
  padding: 22px 34px 20px;
  font-size: 20px;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  align-items: center;
  justify-content: center;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    color: white;
  }

  @media only screen and (max-width: 991px) {
    width: 40%;
    max-width: 250px;
    padding: 10px 5px;
    margin: 0 0 15px 0;
  }
`;

const Sorting = styled.div`
  height: 45px;
  z-index: 20;
  width: 90%;
  display: flex;
  justify-content: center;
  font-size: 30px;
  align-items: center;
  line-height: 1;
`;
const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  @media only screen and (max-width: 991px) {
    justify-content: center;
  }
`;

const Option = styled.div`
  background-color: #1d1d21;
  border-radius: ${(props) =>
    props.className === "top" ? "5px 0 0 5px" : " 0 5px 5px 0"};
  border: 1px solid ${(props) => (props.active ? "#3c5bd8" : "#2d2d34")};
  font-size: 16px;
  padding: 5px 20px;
  opacity: 0.9;
  cursor: pointer;
  color: ${(props) => (props.active ? "white" : "#c1c1c1")};

  &:hover {
    opacity: 1;
  }
  @media only screen and (max-width: 991px) {
    font-size: 18px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  z-index: 20;
  margin-top: 20px;
`;

const ApproveButton = styled.button`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s linear;
  &:hover {
    background-color: #444;
    color: white;
    cursor: pointer;
  }
`;

const ApproveContainer = styled.div`
  max-width: 80vw;
  border: 2px solid rgba(256, 256, 256, 0.5);
  border-radius: 2px;
  background-color: rgba(256, 256, 256, 0.2);
  color: white;
  width: 400px;
  margin: 25vh 0 0 0;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Container = styled.div`
  width: 100%;
  margin: 5vh auto;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  font-size: 20px;
  color: white;
`;

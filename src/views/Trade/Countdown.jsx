import moment from "moment";
import React from "react";
import styled from "styled-components";

export class CountDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      inBetween: false,
      date: ""
    };
  }

  componentDidMount() {
    let endTime = this.props.endTime;
    let diffTime = moment.utc(endTime) - moment.utc();
    let duration = moment.duration(diffTime);

    setInterval(() => {
      duration = moment.duration(duration - 1000);
      this.setState({
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
        date: moment.utc().toDate()
      });
    }, 1000);
  }

  render() {
    return (
      <CountdownCard>
        <Wrapper>
          {this.props.open ?
            <MarketInfo>Market closes in: </MarketInfo> :
            <MarketInfo>Market opens in: </MarketInfo>
          }

          <Timer>
            <Countdown>
              {this.state.days > 0 && (
                <>
                  <Item>
                    {this.state.days.toLocaleString("en-US", {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                  </Item>
                  <div>:</div>
                </>
              )}
              <Item>
                {this.state.hours.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </Item>
              <div>:</div>
              <Item>
                {this.state.minutes.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </Item>
              <div>:</div>
              <Item>
                {this.state.seconds.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </Item>

            </Countdown>
            {/*<div>*/}
            {/*  {this.state.date.toLocaleString("en-US", {*/}
            {/*  minimumIntegerDigits: 2,*/}
            {/*  useGrouping: false,*/}
            {/*})}</div>*/}
          </Timer>
        </Wrapper>
      </CountdownCard>

    );
  }
}

const Wrapper = styled.div`
  margin: 23px 20px 20px;
`

const Item = styled.div`
  text-align: center;
`;

const Countdown = styled.div`
  display: flex;
  color: white;
  font-size: 36px;
  letter-spacing: 2px;
  align-items: center;
  margin-bottom: 10px;
  font-family: SophiaNubian-Bold, sans-serif;
  
`;

const MarketInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
  font-size: 16px;
  color: #c1c1c1;
`

const Timer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #c1c1c1;
`

const CountdownCard = styled.div`
  background-color: #17171a;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  box-sizing: border-box;
  
`


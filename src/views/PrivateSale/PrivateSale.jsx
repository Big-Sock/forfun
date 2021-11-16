import axios from 'axios';
import React, { useState } from "react";
import styled from "styled-components";
import useWallet from "use-wallet";
import loadingGif from "../../assets/img/loading.gif";
import isMobile from '../../utils/isMobile';
import { buyBetaPass, connectProvider, fetchRewardBalance } from '../../web3/utils';
import { BaseView } from "../BaseView";

const Disclaimer = () => {
  const { account, connect } = useWallet();
  const [val, setVal] = useState(0);
  const [amountBought, setAmountBought] = useState(0);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("")


  const sign = async () => {
    if (!name) {
      return
    }
    const { provider, walletAddress } = await connectProvider()
    const signer = provider.getSigner();
    signer.signMessage(JSON.stringify({ name, walletAddress })).then((authorization) => {
      setLoading(true);
      axios.post('/api/forms/disclaimer-signed', {
        name: name,
        address: walletAddress,
        sig: authorization
      }).then(res => {
        fetchRewardBalance((r) => {
          setAmountBought(r);
        })
        setSigned(true);
        setLoading(false);
      })
    })
  }

  const addStonk = async () => {
    const tokenAddress = '0x35b55c25731E9b05B1d8480ba39463d52C9D0211';
    const tokenSymbol = 'STONK';
    const tokenDecimals = 18;
    const tokenImage = 'https://www.stockswap.app/static/media/SVG_finalogo.cb92e2ef.svg';
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const buy = () => {
    buyBetaPass(val, (res) => {
      fetchRewardBalance((r) => {
        setAmountBought(r);
        console.log('bought!');
      })
    })
  }

  let pageContents = (
    <Container>
      <Title>
        Disclaimer
      </Title>
      <Divider />
      <BulletPoint>
        - I acknowledge that this token is a utility token, not an investment: it provides access to the wrapped stock system.
      </BulletPoint>
      <BulletPoint>
        - I acknowledge that I am buying the token for the ability to participate in this novel system, not as an investment.
      </BulletPoint>
      <BulletPoint>
        - I acknowledge that during phase 1 only Eligible Contract Participants - individuals with over $10 million net worth - will have access to the trading system.
        LEARN MORE: <a href="https://www.investopedia.com/terms/e/eligible_contract_participant.asp#:~:text=An%20eligible%20contract%20participant%20(ECP,total%20assets%20in%20the%20millions.">investopedia/ECP</a>
      </BulletPoint>
      <BulletPoint>
        - I acknowledge that if I am not an Eligible Contract Participant, I cannot participate in the initial trading phase of wrapped stocks.
      </BulletPoint>
      <SignatureContainer>
        I,
      <Signature onChange={(e) => setName(e.target.value)} />
         confirm that I have read and agree with the above statements.
      </SignatureContainer>
      <SignButton onClick={sign}>
        Sign With My Wallet Address
      </SignButton>
    </Container>)

  if (loading) {
    pageContents = <Loading src={loadingGif}></Loading>
  } else if (signed) {
    pageContents =
      <PrivateSaleContainer>
        <SaleContainer style={{ marginRight: "20px" }}>
          <Title>Utility </Title>
          <Divider />
          <BulletPoint>-Hold 200 $STONK and access phase 1 (if you qualify as an ecp)</BulletPoint>
          <BulletPoint>-Make and vote on proposals for new features or changes to StockSwap</BulletPoint>
          <BulletPoint>-$STONK is spent when you buy and sell wStock, these gas fees help us manage risk</BulletPoint>
          <StonkButton onClick={addStonk}>Add STONK to Metamask</StonkButton>
          <BulletPoint style={{marginTop: '30px'}}>If you would like to purchase manually to save on gas fees, please DM @bigsock on Telegram and send ETH here: 0x99E12094c228F550809F20Ba196DCc95E6b8faeA</BulletPoint>
        </SaleContainer>
        <div>
          <SaleContainer>
            <Title> Buy </Title>
            <BulletPoint>
              333 $STONK = 1 ETH (15ETH cap)
          </BulletPoint>
            <Divider />
            <Row>
              <PurchaseInput
                step="100"
                min="0"
                onChange={(e) => setVal(parseInt(e.target.value) > 6000 ? 6000 : e.target.value)}
                value={val}
                type="number"
              />
              <BuyButton onClick={buy}>buy</BuyButton>
            </Row>
          </SaleContainer>
          <SaleContainer style={{ marginTop: "20px" }}>
            <Title>Purchased </Title>
            <Divider />
            <BulletPoint>{parseFloat(amountBought).toFixed(2)} $STONK</BulletPoint>
          </SaleContainer>
        </div>
      </PrivateSaleContainer >
  }

  if (!account) {
    return (
      <BaseView>
        <WalletTitle>Please enter connect your wallet to purchase tokens</WalletTitle>
        <WalletButton onClick={() => connect('injected')}>Enter</WalletButton>
      </BaseView>
    )
  }
  return (
    <BaseView>
      {pageContents}
    </BaseView>
  );
};

const PrivateSaleContainer = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
` :
  styled.div`
display: flex;
flex-direction: column;
`

const Divider = styled.div`
height: 1px;
    width: calc(100% + 80px);
    background-color: rgba(256,256,256,0.6);
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    align-self: center;
    margin: 5px 0 20px 0;`

const SaleContainer = styled.div`
  margin-top: 20vh;
  width: 340px;
  border: 2px solid rgba(256, 256, 256, 0.5);
  border-radius: 2px;
  background-color: rgba(180, 180, 180, 0.3);
  background-color: rgba(0,0,0,0.3);

  color: white;
  padding: 20px 40px;
  align-items: center;
  position: relative;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StonkButton = styled.button`
width: 250px;
padding: 10px 0;
/* border: 2px solid white; */
border: none;
border-radius: 8px;
font-size: 16px;
transition: all 0.2s linear;
&:hover {
  background-color: #444;
  color: white;
  cursor: pointer;
}
`

const BuyButton = styled.button`
width: 100px;
padding: 10px 0;
/* border: 2px solid white; */
border: none;
border-radius: 8px;
font-size: 16px;
transition: all 0.2s linear;
&:hover {
  background-color: #444;
  color: white;
  cursor: pointer;
}
`

const WalletButton = styled.button`
width: 140px;
padding: 10px 0;
margin-top: 20px;
/* border: 2px solid white; */
border: none;
border-radius: 8px;
font-size: 16px;
transition: all 0.2s linear;
&:hover {
  background-color: #444;
  color: white;
  cursor: pointer;
}
`

const Row = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-between;
`

const PurchaseInput = styled.input`
background-color: rgba(0,0,0,0);
border: none;
border-bottom: 2px solid white;
color: white;
text-align: right;
margin: 0 8px;
height: 34px;
font-size: 24px;
padding-right: 60px;
width: 140px;
&:focus {
  outline: none;
  background-color: rgba(0,0,0,0.2);
}
`

const SignButton = styled.button`
margin: 20px auto 0 auto;
width: 80%;
padding: 10px 0;
/* border: 2px solid white; */
border: none;
border-radius: 8px;
font-size: 16px;
transition: all 0.2s linear;
&:hover {
  background-color: #444;
  color: white;
  cursor: pointer;
}
`

const SignatureContainer = styled.div`
display: flex;
flex-direction: row;
text-align: left;
display: inline;
`

const Signature = styled.input`
background-color: rgba(0,0,0,0);
border: none;
border-bottom: 2px solid white;
color: white;
text-align: center;
margin: 0 8px;
height: 24px;
font-size: 16px;
&:focus {
  outline: none;
  background-color: rgba(0,0,0,0.2);
}
`

const Loading = styled.img`
width: 100px;
height: 100px;
padding: 20px;
border: 2px solid rgba(256, 256, 256, 0.5);
  border-radius: 2px;
  background-color: rgba(180, 180, 180, 0.3);
  background-color: rgba(0,0,0,0.3);
  margin-top: calc(20vh + 200px);
`;

const BulletPoint = styled.span`
  margin-bottom: 10px;
  text-align: left;
  font-size: 16px;
`

const Title = styled.h1`
  margin: 0;
  margin-top: -12px;
`
const WalletTitle = styled(Title)`
margin-top: 200px;
margin-bottom: 20px;
`

const Container = !isMobile() ? styled.div`
  margin-top: 20vh;
  width: 540px;
  border: 2px solid rgba(256, 256, 256, 0.5);
  border-radius: 2px;
  background-color: rgba(180, 180, 180, 0.3);
  background-color: rgba(0,0,0,0.3);

  color: white;
  padding: 20px 40px;
  align-items: center;
  position: relative;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
` : 
styled.div`
  margin-top: 20px;
  width: 300px;
  border: 2px solid rgba(256, 256, 256, 0.5);
  border-radius: 2px;
  background-color: rgba(180, 180, 180, 0.3);
  background-color: rgba(0,0,0,0.3);

  color: white;
  padding: 20px 20px;
  align-items: center;
  position: relative;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default Disclaimer
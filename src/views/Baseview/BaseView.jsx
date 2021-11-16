import React from "react";
import styled from "styled-components";
import { Footer } from "./Footer/Footer";
import { PageDivider } from "../../components/PageDivider";
import TopBar from "./TopBar";
import AccountButton from "./TopBar/components/AccountButton";
import { Nav } from "./TopBar/components/Nav";
import Forest from '../../assets/img/forest.png'

const BaseView = (props) => {
  return (
    <StyledCanvas>
      <BackgroundOverlay />

      <ContentContainer>
        <StyledPage>
          <TopBarContainer>
            <TopBar />
          </TopBarContainer>
          {/* <MobileNav>
            <Nav />
            <AccountButton />
          </MobileNav> */}
          {props.children}
          {/* <Footer /> */}
        </StyledPage>
      </ContentContainer>
    </StyledCanvas >
  );
};


const TopBarContainer = styled.div`
margin-right: 10px;
margin-top: 10px;
position: absolute;
width: calc(100% - 20px);
`

const StyledPage = styled.div`
position: absolute;
height: 100vh;
width: 100vw;
overflow: hidden;
z-index: 0;
background-image: url(${Forest});
background-repeat: no-repeat;
background-size: cover;
padding: 0px;
box-shadow: rgb(255 255 255 / 20%) 0px 0px 200px 0.1px inset;
`;


const BackgroundOverlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: radial-gradient(rgba(4, 39, 135, 0.42), #0e0e10);
  position: fixed;

`;

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  background-color: rgba(18, 18, 21, 0.59);
`;

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
`;

export default BaseView;

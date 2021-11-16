import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Swal from "sweetalert2";
import { UseWalletProvider } from "use-wallet";

import ModalsProvider from "./contexts/Modals";
import isMobile from "./utils/isMobile";
import { NotFoundView } from "./views/404";

import Home from "./views/Home";

import { isProduction } from "./web3/constants";

const GlobalStyle = createGlobalStyle`

`;

const App = () => {
  if (isMobile()) {
    Swal.fire("Mobile support for MetaMask mobile only.");
  }

  return (
    <Providers>
      <StyledCanvas>
        <Router>
          <ModalsProvider>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="*">
                <NotFoundView />
              </Route>
            </Switch>
          </ModalsProvider>
        </Router>
      </StyledCanvas>
    </Providers>
  );
};

const Providers = ({ children }) => {
  // change the ChainId below here for the preffered network when testing, 1 main 3 ropsten 5 goerli 42 kovan
  return (
    <UseWalletProvider
      chainId={isProduction ? 1 : 5}
      connectors={{
        walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
      }}
    >
      <GlobalStyle />
      {children}
    </UseWalletProvider>
  );
};

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default App;

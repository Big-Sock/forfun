import React, { useState } from "react";
import styled from "styled-components";
import NFT1 from '../../assets/img/nft1.gif'
import NFT2 from '../../assets/img/nft2.jpg'
import NFT3 from '../../assets/img/nft3.jpg'
import Tile from './Tile'

const NFTs = [
  {
    image: NFT1,
    metadata: "bugs",
    x: 50,
    y: 100,
    z: 1,
    width: 250,
    height: 300,
    rotation: 80
  },
  {
    image: NFT2,
    metadata: "bugs",
    x: 150,
    y: 200,
    z: 3,
    width: 300,
    height: 400,
    rotation: 60
  },
  {
    image: NFT3,
    metadata: "bugs",
    x: 20,
    y: 160,
    z: 2,
    width: 250,
    height: 300,
    rotation: 30
  }
]



const Home = () => {
  const [maxZ, setMaxZ] = useState(0)

  const sanitizeNFTs = (nfts) => {
    // here's where we'll make sure the nfts always stay on the page and have acceptable values and stuff
    nfts.forEach(nft => {
      if (nft.z > maxZ)
        setMaxZ(nft.z)
    })
    return nfts
  }

  return (
    <LandingSection>
      {sanitizeNFTs(NFTs).map(nft => <Tile {...nft} maxZ={maxZ} setMaxZ={setMaxZ} />)}
    </LandingSection>
  );
};

const LandingSection = styled.div`
  width: 100%;
  height: 100%;
`;

export default Home;

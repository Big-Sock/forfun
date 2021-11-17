import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NFT from './NFT'

const Tile = (nft) => {
  // const {image, metadata, x, y, z, width, height, rotation, maxZ, setMaxZ} = nft
  const [image, setImage] = useState(nft.image)
  const [metadata, setMetadata] = useState(nft.metadata)
  const [z, setZ] = useState(nft.z)
  const [location, setLocation] = useState({ x: nft.x, y: nft.y })
  const [dimensions, setDimensions] = useState({ width: nft.width, height: nft.height })
  const [rotation, setRotation] = useState(nft.rotation)
  const [aspectRatio, setAspectRatio] = useState(1)

  const [edit, setEdit] = useState(false)
  const [drag, setDrag] = useState(false)
  const [resize, setResize] = useState(false)
  const [rotate, setRotate] = useState(false)

  useEffect(async () => {
    let { width, height } = await imageDimensions(nft.image)
    setDimensions({ width: dimensions.width, height: dimensions.width * height / width })
    setAspectRatio(height / width)
  }, [nft.image])

  const imageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img
        resolve({ width, height })
      }
      img.onerror = () => {
        reject('There was some problem with the image.')
      }
      img.src = file
    })
  }


  const increaseZ = () => {
    setZ(nft.maxZ + 1)
    nft.setMaxZ(nft.maxZ + 1)
  }

  const handleDrag = (e) => {
    // this fuckery is a result of needing to escape the restrictions of react, which creates a new variable every time setState is called. 
    // as a result, any attempt to store variables in state, to then call again later within the function, will return with their initial values.
    // this function runs with a static set of state variables (their initial values) used within it, although it updates state, which affects rendering.
    e.stopPropagation()
    increaseZ()
    setDrag(true)
    let xx = parseInt(e.clientX) - location.x // capture mouse location as offset from X value within drag handle
    let yy = parseInt(e.clientY) - location.y
    const performDrag = (event) => {
      let x = event.clientX - xx
      let y = event.clientY - yy
      if (event.clientX < 0) x = 0 - xx
      if (event.clientY < 0) y = 0 - yy
      if (event.clientX > window.innerWidth) x = window.innerWidth - xx
      if (event.clientY > window.innerHeight) y = window.innerHeight - yy
      setLocation({ x: x, y: y }) // as drag happens, capture change in mouse location from initial
    }
    window.addEventListener('mousemove', performDrag, true) // listen to mouse movements
    const endDrag = (e) => {
      setDrag(false)
      window.removeEventListener("mousemove", performDrag, true); // cleaning up
      window.removeEventListener('mouseup', endDrag, true)
    }
    window.addEventListener('mouseup', endDrag, true) // listen to mouse up
  }

  const handleResize = (e) => {
    // same
    e.stopPropagation()
    increaseZ()
    setResize(true)
    let xx = e.clientX - dimensions.width
    const performResize = (event) => {
      setResize(true)
      setDimensions({ width: event.clientX - xx, height: (event.clientX - xx) * aspectRatio })
    }
    window.addEventListener('mousemove', performResize, true)
    const endResize = (e) => {
      setResize(false)
      window.removeEventListener("mousemove", performResize, true);
      window.removeEventListener('mouseup', endResize, true)
    }
    window.addEventListener('mouseup', endResize, true)
  }

  const handleRotate = (e) => {
    // same
    e.stopPropagation()
    increaseZ()
    let xx = e.clientX
    let rotateRate = 10
    let currentRotation = rotation
    const performRotate = (event) => {
      setRotate(true)
      setRotation(currentRotation - (event.clientX - xx) / rotateRate)
    }
    window.addEventListener('mousemove', performRotate, true)
    const endRotate = (e) => {
      setRotate(false)
      window.removeEventListener("mousemove", performRotate, true);
      window.removeEventListener('mouseup', endRotate, true)
    }
    window.addEventListener('mouseup', endRotate, true)
  }

  return (
    <Container
      x={location.x}
      y={location.y}
      z={z}
      width={dimensions.width}
      height={dimensions.height}
      rotation={rotation}
      image={image}
      onMouseDown={increaseZ}
    >
      {edit && <DragHandle onMouseDown={handleDrag} active={drag} />}
      <EditHandle onClick={() => setEdit(!edit)} />
      <Content>
        <NFT metadata={metadata} />
      </Content>
      {edit &&
        <EditMenu>
          <RotateHandle onMouseDown={handleRotate} active={rotate} />
          <ResizeHandle onMouseDown={handleResize} active={resize} />
        </EditMenu>
      }
    </Container>
  );
};

const Content = styled.div`
width: 100%;
`

const EditMenu = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-between;
opacity: .7;
`

const EditHandle = styled.div`
position: absolute;
right: 0px;
top: 0px;
width: 20px;
height: 20px;
background-color: white;
opacity: .5;
border-radius: 10px;
cursor: pointer;
`

const ResizeHandle = styled.div`
width: 20px;
height: 20px;
opacity: .5;
background-color: white;
border-bottom-right-radius: 10px;
border-top-left-radius: 10px;
cursor: ${props => props.active ? 'nwse-resize' : 'nwse-resize'};
`

const RotateHandle = styled.div`
width: 20px;
background-color: gray;
border-bottom-left-radius: 10px;
border-top-right-radius: 10px;
cursor: ${props => props.active ? 'pointer' : 'ew-resize'};
`

const DragHandle = styled.div`
width: 100%;
height: 20px;
opacity: .7;
background-color: gray;
border-top-left-radius: 10px;
border-top-right-radius: 10px;
display: flex;
flex-direction: row;
justify-content: flex-end;
cursor: ${props => props.active ? 'grabbing' : 'grab'};
`

const Container = styled.div`
position: absolute;
width: ${props => props.width}px;
height: ${props => props.height}px;
will-change: transform;
transform: translate(${props => props.x}px, ${props => props.y}px) rotate(${props => props.rotation}deg);
z-index: ${props => props.z};
background-image: url(${props => props.image});
background-size: contain; 
background-repeat: no-repeat;

transition: all .05s linear;
user-select: none;
min-width: 50px;
min-height: 50px;
display: flex;
flex-direction: column;
justify-content: space-between;
background-color: white;
border-radius: 10px;
box-shadow: rgba(28, 15, 65, 0.06) 0px 4px 8px 0px, rgba(28, 15, 65, 0.06) 0px 6px 10px 0px, rgba(255, 255, 255, .3) 0px 0px 20px 0.1px inset;
&:hover {
  box-shadow: rgba(28, 15, 65, 0.1) 0px 4px 8px 0px, rgba(28, 15, 65, 0.1) 0px 6px 10px 0px, rgba(255, 255, 255, .3) 0px 0px 20px 0.1px inset;
}
`

export default Tile;

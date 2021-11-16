import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Tile = (nft) => {
  const [image, setImage] = useState(nft.image)
  const [metadata, setMetadata] = useState(nft.metadata)
  const [x, setX] = useState(nft.x)
  const [y, setY] = useState(nft.y)
  const [width, setWidth] = useState(nft.width)
  const [height, setHeight] = useState(nft.height)
  const [rotation, setRotation] = useState(nft.rotation)

  const [drag, setDrag] = useState(false)
  const [resize, setResize] = useState(false)
  const [rotate, setRotate] = useState(false)

  const [mouseOffset, setMouseOffset] = useState({ x: null, y: null })


  const handleDrag = (e) => {
    // this fuckery is a result of needing to escape the restrictions of react, which creates a new variable every time setState is called. 
    // as a result, any attempt to store variables in state, to then call again later within the function, will return with their initial values.
    // this function runs with a static set of state variables (their initial values) used within it, although it updates state, which affects rendering.

    setMouseOffset({ x: x, y: y }) // store current location as edit to display
    setDrag(true) // display edit 
    let xx = parseInt(e.clientX) - x // capture mouse location as offset from X value within drag handle
    let yy = parseInt(e.clientY) - y
    let xxx = x // store edited value within this function, initialized as starting value
    let yyy = y
    const performDrag = (event) => { 
      setMouseOffset({ x: event.clientX - xx, y: event.clientY - yy }) // as drag happens, capture change in mouse location from initial
      xxx = event.clientX - xx // store this value in this function
      yyy = event.clientY - yy
    }
    window.addEventListener('mousemove', performDrag, true) // listen to mouse movements
    const endDrag = (e) => {
      setDrag(false) // stop displaying edit
      setX(xxx) // set displayed location to edit
      setY(yyy)
      setMouseOffset({ x: null, y: null }) // reset display edit
      window.removeEventListener("mousemove", performDrag, true); // cleaning up
      window.removeEventListener('mouseup', endDrag, true)
    }
    window.addEventListener('mouseup', endDrag, true) // listen to mouse up
  }

  const handleResize = (e) => {
    // same
    setMouseOffset({ x: width, y: height})
    setResize(true)
    let xx = parseInt(e.clientX) - width
    let yy = parseInt(e.clientY) - height
    let xxx = width
    let yyy = height
    const performResize = (event) => {
      setResize(true)
      setMouseOffset({ x: event.clientX - xx, y: event.clientY - yy })
      xxx = event.clientX - xx
      yyy = event.clientY - yy
    }
    window.addEventListener('mousemove', performResize, true)
    const endResize = (e) => {
      setResize(false)
      setWidth(xxx)
      setHeight(yyy)
      setMouseOffset({ x: null, y: null })
      window.removeEventListener("mousemove", performResize, true);
      window.removeEventListener('mouseup', endResize, true)
    }
    window.addEventListener('mouseup', endResize, true)
  }

  const handleRotate = (e) => {
    // same
    e.stopPropagation()
    let xx = parseInt(e.clientX) - rotation
    let xxx = x
    const performRotate = (event) => {
      setRotate(true)
      setMouseOffset({ x: event.clientX - xx, y: null })
      xxx = event.clientX - xx
    }
    window.addEventListener('mousemove', performRotate, true)
    const endRotate = (e) => {
      setRotate(false)
      setRotation(xxx)
      setMouseOffset({ x: null, y: null })
      window.removeEventListener("mousemove", performRotate, true);
      window.removeEventListener('mouseup', endRotate, true)
    }
    window.addEventListener('mouseup', endRotate, true)
  }

  return (
    <Container
      x={drag ? mouseOffset.x : x} 
      y={drag ? mouseOffset.y : y}
      width={resize ? mouseOffset.x : width} 
      height={resize ? mouseOffset.y : height}
      rotation={rotate ? mouseOffset.x : rotation}
    >
      <DragHandle onMouseDown={handleDrag}>
        <RotateHandle onMouseDown={handleRotate} />
      </DragHandle>
      <Content>
        hi
      </Content>
      <ResizeHandle onMouseDown={handleResize} />
    </Container>
  );
};

const Content = styled.div`
width: 90%;
padding-left: 5%;
padding-right: 5%;
`

const ResizeHandle = styled.div`
width: 30px;
height: 30px;
background-color: black;
border-bottom-right-radius: 10px;
`

const RotateHandle = styled.div`
width: 30px;
background-color: black;
border-top-right-radius: 10px;
`

const DragHandle = styled.div`
width: 100%;
height: 30px;
background-color: gray;
border-top-left-radius: 10px;
border-top-right-radius: 10px;
display: flex;
flex-direction: row;
justify-content: flex-end;
`

const Container = styled.div`
position: absolute;
width: ${props => props.width}px;
height: ${props => props.height}px;
will-change: transform;
transform: translate(${props => props.x}px, ${props => props.y}px) rotate(${props => props.rotation}deg);


display: flex;
flex-direction: column;
justify-content: space-between;
align-items: end;
background-color: white;
border-radius: 10px;
box-shadow: rgba(28, 15, 65, 0.06) 0px 4px 8px 0px, rgba(28, 15, 65, 0.06) 0px 6px 10px 0px;
`

export default Tile;

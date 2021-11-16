import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const NavDrawer = () => {
  const [toggle, setToggle] = useState(false);
  const direction = "right";

  let paths = [
    "/",
    "/dashboard",
    "/trade",
    "/stake",
    "/community",
    "/verify-backing",
  ];
  let titles = [
    "Info",
    "Dashboard",
    "Trading",
    "Staking",
    "Governance",
    "Verification",
  ];

  const useStyles = makeStyles({
    list: {
      width: 240,
    },
    drawerPaper: {
      backgroundColor: "rgba(18,18,21)",
    },
    divider: {
      backgroundColor: "rgb(14, 14, 16)",
    },
    listItemText: {
      fontSize: "18px",
    },
  });

  const classes = useStyles();

  return (
    <>
      <Button onClick={() => setToggle(true)}>
        <Hamburger style={{ display: "inline", fontSize: "40px" }} />
      </Button>

      <Drawer
        anchor={direction}
        open={toggle}
        onClose={() => setToggle(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List className={classes.list}>
          {titles.map((text, index) => (
            <StyledLink to={paths[index]} key={text}>
              <ListItem button key={text}>
                <ListItemText
                  primary={text}
                  classes={{ primary: classes.listItemText }}
                />
              </ListItem>
            </StyledLink>
          ))}
        </List>
        <Divider className={classes.divider} />
      </Drawer>
    </>
  );
};

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: #3c5bd8;
  font-size: 35px;
`;

const Hamburger = styled(MenuRoundedIcon)`
  color: #3c5bd8;
  cursor: pointer;
`;

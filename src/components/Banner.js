import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiSearch, FiAlertTriangle, FiX } from "react-icons/fi";
import { IconContext } from "react-icons";
import useWindowDimensions from "./../hooks/useWindowDimensions";

import { COLORS } from "./../styles/colors";

function Banner() {
  const [closed, setClosed] = useState(false);
  console.log(process.env.REACT_APP_BANNER);
  if (process.env.REACT_APP_BANNER != "null" && closed == false) {
    return (
      <FootBar>
        <TextContainer>
          <IconContext.Provider
            value={{
              size: "1rem",
              style: {
                verticalAlign: "middle",
              },
            }}
          >
            <FiAlertTriangle /> {process.env.REACT_APP_BANNER}{" "}
            <a href="https://discord.gg/3KJrFatekv">
              Join the Discord for updates.
            </a>
            <Button
              onClick={() => {
                setClosed(true);
              }}
            >
              <FiX />
            </Button>
          </IconContext.Provider>
        </TextContainer>
      </FootBar>
    );
  } else return <> </>;
}

const TextContainer = styled.div`
  padding: 1%;
  font-size: 80%;
  @media screen and (max-width: 600px) {
    padding: 2%;
    font-size: 85%;
  }
`;

const FootBar = styled.section`
  text-align: center;
  width: 100%;
  background: ${COLORS.colorPopup};
  position: inherit;
`;

const Shadow = styled.div`
  z-index: 9;
  position: absolute;
  top: 0;
  height: 100vh;
  width: 98.6vw;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
`;

const Button = styled.button`
  margin-left: 1.5%;
  color: white;
  background-color: ${COLORS.colorPopupSecondary};
  outline: none;
  border: none;
  padding: 0.5% 1% 0.5% 1%;
  border-radius: 0.4rem;
  cursor: pointer;

  white-space: nowrap;
  @media screen and (max-width: 600px) {
    padding: 0.5rem;
  }
`;

export default Banner;

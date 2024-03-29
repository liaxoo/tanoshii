import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiSearch, FiUser } from "react-icons/fi";
import { IconContext } from "react-icons";
import Search from "./Search";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import NavAvatar from "../../components/Home/Dropdown";

import { COLORS } from "../../styles/colors";

function Footer() {
  const [isActive, setIsActive] = useState(false);
  const { height, width } = useWindowDimensions();

  function checkTokenSize() {
    let lsData = localStorage.getItem("anilistAccessToken");
    lsData = JSON.parse(lsData);
    if (lsData.length === 0) {
      return false;
    }
    return true;
  }

  return (
    <FootBar>
      <TextContainer>
        <h3> © 2023 tanoshii.live | Website Made by Liaxo</h3>
        <p>
          This site does not store any files on our server, it only links to
          media hosted by 3rd party services.
        </p>
        <a href="https://forms.gle/AauZGT3yQ1q5nui18">DMCA Takedown Request</a>
        <h4>Version: {localStorage.getItem("version")}</h4>
      </TextContainer>
    </FootBar>
  );
}

const TextContainer = styled.div`
  padding: 1%;
  font-size: 75%;
`;

const FootBar = styled.section`
  text-align: center;
  width: 100%;
  background: ${COLORS.colorPopup};
  margin-top: 7.5%;
  position: absolute;
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
  color: white;
  font-family: "Lexend", sans-serif;
  font-weight: 500;
  background-color: #7676ff;
  outline: none;
  border: none;
  padding: 0.7rem 1.6rem 0.7rem 1.6rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: 0.9rem;
  FiSearch {
    font-size: 1rem;
  }
  white-space: nowrap;
  @media screen and (max-width: 600px) {
    padding: 0.5rem;
    padding-right: 0;
    background-color: transparent;
  }
`;

export default Footer;

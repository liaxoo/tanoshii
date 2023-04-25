import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiSearch, FiUser } from "react-icons/fi";
import { IconContext } from "react-icons";
import Search from "./Search";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const NavRight = () => {
  const [isActive, setIsActive] = useState(false);
  const { height, width } = useWindowDimensions();

  return (
    <>
      {width > 600 && (
        <IconContext.Provider
          value={{
            size: "1rem",
            style: {
              verticalAlign: "middle",
              marginBottom: "0.2rem",
              marginRight: "0.3rem",
            },
          }}
        >
          <Button2 onClick={(e) => setIsActive(!isActive)}>
            <FiSearch />
            Search
          </Button2>
          {localStorage.getItem("anilistAccessToken") ? (
            <div></div>
          ) : (
            <Button>
              <Links to="/login/" style={{ margin: 0 }}>
                <FiUser />
                Log in
              </Links>
            </Button>
          )}
        </IconContext.Provider>
      )}

      {width <= 600 && (
        <IconContext.Provider
          value={{
            size: "1.5rem",
            style: {
              verticalAlign: "middle",
              marginBottom: "0.2rem",
              marginRight: "0.3rem",
            },
          }}
        >
          <div>
            <Button onClick={(e) => setIsActive(!isActive)}>
              <FiSearch />
            </Button>
            <Link to="/login/" style={{ color: "white", marginLeft: 10 }}>
              <FiUser />
            </Link>
          </div>
        </IconContext.Provider>
      )}

      {width > 600 ? <NavRight /> : <></>}
      {isActive && <Search isActive={isActive} setIsActive={setIsActive} />}
      {isActive && <Shadow></Shadow>}
    </>
  );
};
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

const Button2 = styled.button`
  color: white;
  font-family: "Lexend", sans-serif;
  font-weight: 500;
  padding: 0.7rem 1.6rem 0.7rem 1.6rem;
  cursor: pointer;
  border: none;

  font-size: 0.9rem;
  FiUser {
    font-size: 1rem;
  }
  white-space: nowrap;
  @media screen and (max-width: 600px) {
    padding: 0.5rem;
    padding-right: 0;
  }

  background: none;
  background-color: transparent;
`;

const Links = styled(Link)`
  color: white;
  font-weight: 400;
  text-decoration: none;
  margin: 0rem 1.3rem 0 1.3rem;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.8rem 5rem 0 5rem;
  @media screen and (max-width: 600px) {
    margin: 1rem 2rem;
    margin-top: 1rem;
    img {
      height: 1.7rem;
    }
    .nav-links {
      display: none;
    }
  }
`;

export default NavRight;

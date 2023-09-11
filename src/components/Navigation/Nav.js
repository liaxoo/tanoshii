import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiSearch, FiUser } from "react-icons/fi";
import { IconContext } from "react-icons";
import Search from "./Search";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import NavAvatar from "../../components/Home/Dropdown";

function Nav() {
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
    <div>
      <NavBar>
        <Link
          to="/"
          style={{
            width: "10%",
            height: "5%",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <img src="./assets/logo.svg" alt="Logo Here" />
        </Link>
        <div className="nav-links">
          <Links to="/trending/1">Trending</Links>
          <Links to="/popular/1">Popular</Links>
          <Links to="/movies">Top Movies</Links>
        </div>

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
              <NavAvatar />
            </div>
          </IconContext.Provider>
        )}
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
            <div>
              {localStorage.getItem("anilistAccessToken") ? (
                <Right>
                  <Button2 onClick={(e) => setIsActive(!isActive)}>
                    <FiSearch />
                    Search
                  </Button2>
                  <NavAvatar />
                </Right>
              ) : (
                <div>
                  <Button2 onClick={(e) => setIsActive(!isActive)}>
                    <FiSearch />
                    Search
                  </Button2>
                  <Button>
                    <Links to="/login/" style={{ margin: 0 }}>
                      <FiUser />
                      Log in
                    </Links>
                  </Button>
                </div>
              )}
            </div>
          </IconContext.Provider>
        )}
      </NavBar>
      {isActive && <Search isActive={isActive} setIsActive={setIsActive} />}
      {isActive && <Shadow></Shadow>}
    </div>
  );
}

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
  //padding: 0.7rem 1.6rem 0.7rem 1.6rem;
  padding-right: 1.6rem;
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
  width: 20%;
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

const Right = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: end;

  cursor: pointer;

  img {
    border-radius: 60%;
    /* Remove width and height properties */
    height: 35px;
  }
`;
export default Nav;

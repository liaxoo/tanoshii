import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import HomeSkeleton from "../components/skeletons/CarouselSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { FiArrowRight } from "react-icons/fi";
import { TrendingAnimeQuery } from "../hooks/searchQueryStrings";
import { IconContext } from "react-icons";

const CLIENT_ID = "12200";
const CLIENT_SECRET = "BCFhWkmKxjBjv6EhVbWgaSlxmQBdOJRHdHQBRaAH";
const REDIRECT_URI = "https://www.tanoshii.live/login/";

function Home() {
  const history = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    getImages();
  }, []);

  async function getImages() {
    window.scrollTo(0, 0);
    let result = await axios({
      url: process.env.REACT_APP_BASE_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        query: TrendingAnimeQuery,
        variables: {
          page: 1,
          perPage: 15,
        },
      },
    }).catch((err) => {
      console.log(err);
    });
    setImages(result.data.data.Page.media);
    setLoading(false);
    document.title = "Tanoshii - Login";
  }

  function AniListAuthButton() {
    const history = useNavigate();
    const [accessToken, setAccessToken] = useState(null);

    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = urlParams.get("access_token");
      if (accessToken) {
        console.log(accessToken);
        localStorage.setItem("anilistAccessToken", accessToken);
        GetThing();
        setAccessToken(accessToken);
        history("/"); // replace the URL so that it doesn't contain the access token
      } else {
        // handle the case where the access token is not present
        console.log("DID NOT GET");
      }
    };

    useEffect(() => {
      handleAuthCallback();
    }, []);

    const handleLogin = () => {
      const authorizeUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&redirect_url=${REDIRECT_URI}&response_type=token`;
      window.location.assign(authorizeUrl);
    };

    const handleLogout = () => {
      setAccessToken(null);
    };

    return (
      <div>
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
          <Button onClick={handleLogin}>
            <FiArrowRight />
            Log in with AniList
          </Button>
        </IconContext.Provider>
      </div>
    );
  }

  function GetThing() {
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("anilistAccessToken")}`,
      },
      body: JSON.stringify({
        query: `
          query {
            Viewer {
              id
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data.Viewer.id);
        localStorage.setItem("anilistClientId", data.data.Viewer.id);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        return "There was a problem authenticating your account. Please send an issue on GitHub.";
      });
  }

  return (
    <div>
      <HomeDiv>
        <HomeHeading>
          {localStorage.getItem("anilistAccessToken") ? (
            <span>Success!</span>
          ) : (
            <span>Login to Anilist</span>
          )}
        </HomeHeading>

        {localStorage.getItem("anilistAccessToken") ? (
          <Text>
            Your AniList account was successfully authenticated. If you do not
            see any changes, please refresh the browser.
          </Text>
        ) : (
          <Text>
            Login with AniList to sync your current episode to your AniList
            account. You will also be able to score the anime you watch! We
            currently only support AniList account integration, but we are
            looking to also add MyAnimeList integration in the future!
            <AniListAuthButton />
          </Text>
        )}
      </HomeDiv>
    </div>
  );
}
const Button = styled.button`
  color: white;
  font-family: "Lexend", sans-serif;
  font-weight: 500;
  background-color: #7676ff;
  outline: none;
  border: none;
  margin-top: 1rem;
  padding: 0.7rem 1.6rem 0.7rem 1.6rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: 0.9rem;
  FiSearch {
    font-size: 1rem;
  }
  white-space: nowrap;
`;

const Links = styled(Link)`
  color: white;
  font-weight: 400;
  text-decoration: none;
  margin: 0rem 1.3rem 0 1.3rem;
`;

const HomeDiv = styled.div`
  margin: 1.5rem 5rem 1rem 5rem;
  @media screen and (max-width: 600px) {
    margin: 1rem 1rem 0rem 1rem;
  }
`;

const HomeHeading = styled.p`
  font-size: 2.3rem;
  color: white;
  font-weight: 200;

  span {
    font-weight: 600;
  }
  margin-bottom: 1rem;

  @media screen and (max-width: 600px) {
    font-size: 1.7rem;
  }
`;

const Text = styled.p`
  margin-bottom: 1rem;
`;

export default Home;

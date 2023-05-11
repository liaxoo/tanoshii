import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import AnimeDetailsSkeleton from "../components/skeletons/AnimeDetailsSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { searchByIdQuery } from "../hooks/searchQueryStrings";
import { IconContext } from "react-icons";
import { Menu, Text } from "@mantine/core";

import { FiHeart, FiEdit } from "react-icons/fi";
import {
  MalToAniList,
  AnimeFavoriteStatus,
  Favorite,
  ChangeAnimeStatus,
  ChangeAnimeEpisode,
} from "../components/Home/AnimeFunctions";
import { COLORS } from "../styles/colors";
import { SignIn, Success, Error } from "../components/NotificationManager";
function MalAnimeDetails() {
  const id = useParams().id;
  const watching = false;
  const anilistMalToId = MalToAniList(id);

  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { width } = useWindowDimensions();
  const [anilistResponse, setAnilistResponse] = useState();
  const [malResponse, setMalResponse] = useState();
  const [expanded, setExpanded] = useState(false);
  const [dub, setDub] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);

  function ChangeStatus() {
    let convertedId = MalToAniList(id);
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <div>
            <IconContext.Provider value={{ style: { padding: "17.5%" } }}>
              <ButtonChange className="outline-favorite" onClick={() => {}}>
                <FiEdit color="white" size={"100%"} />
              </ButtonChange>
            </IconContext.Provider>
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={() =>
              ChangeAnimeStatus({ type: "COMPLETED", animeId: convertedId })
            }
          >
            Complete
          </Menu.Item>
          <Menu.Item
            onClick={() =>
              ChangeAnimeStatus({ type: "CURRENT", animeId: convertedId })
            }
          >
            Watching
          </Menu.Item>
          <Menu.Item
            onClick={() =>
              ChangeAnimeStatus({ type: "DROPPED", animeId: convertedId })
            }
          >
            Dropped
          </Menu.Item>
          <Menu.Item
            onClick={() =>
              ChangeAnimeStatus({ type: "PLANNING", animeId: convertedId })
            }
          >
            Planning
          </Menu.Item>
          <Menu.Item
            color="red"
            onClick={() =>
              ChangeAnimeStatus({ type: "DELETE", animeId: convertedId })
            }
          >
            Delete
          </Menu.Item>

          <Menu.Item color="red" onClick={() => ChangeAnimeEpisode()}>
            test
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  function Favorite() {
    return (
      <div>
        {isFavorite && (
          <IconContext.Provider value={{ style: { padding: "17.5%" } }}>
            <ButtonFavorited
              className="outline-favorite"
              onClick={() => toggleFavorite({ aniId: anilistMalToId })}
            >
              <FiHeart color="white" fill="white" size={"100%"} />
            </ButtonFavorited>
          </IconContext.Provider>
        )}
        {!isFavorite && (
          <IconContext.Provider value={{ style: { padding: "17.5%" } }}>
            <ButtonFavorite
              className="outline-favorite"
              onClick={() => {
                toggleFavorite({ aniId: anilistMalToId });
              }}
            >
              <FiHeart color="white" size={"100%"} />
            </ButtonFavorite>
          </IconContext.Provider>
        )}
      </div>
    );
  }
  useEffect(() => {
    getInfo();
    isFavorited();
  }, []);
  const isFavorited = async (props) => {
    let animeid = id;
    if (localStorage.getItem("anilistClientId")) {
      let response = await axios({
        url: process.env.REACT_APP_BASE_URL,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("anilistAccessToken")}`,
        },
        data: {
          query: `
                  query ($idMal: Int) {
                    Media(idMal: $idMal) {
                      isFavourite
                    }
                  }
                `,
          variables: { idMal: animeid },
        },
      })
        .then((data) => {
          setIsFavorite(data.data.data.Media.isFavourite);
        })
        .catch((error) => {
          console.error(error);
        });
    } else setIsFavorite(false);
  };
  function readMoreHandler() {
    setExpanded(!expanded);
  }
  async function toggleFavorite({ aniId }) {
    if (localStorage.getItem("anilistClientId")) {
      let response = await axios({
        url: process.env.REACT_APP_BASE_URL,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("anilistAccessToken")}`,
        },
        data: {
          query: `
          mutation($animeId: Int) {
        ToggleFavourite(animeId: $animeId) {
          anime {
            edges {
              id
            }
          }
        }
      }`,
          variables: { animeId: aniId },
        },
      })
        .catch((error) => {
          Error({ text: error });
        })
        .then((data) => {
          if (isFavorite == true) {
            setIsFavorite(!isFavorite);
            Success({ text: "Removed from AniList favorites!" });
          } else {
            setIsFavorite(!isFavorite);
            Success({ text: "Added to AniList favorites!" });
          }
        });
    } else Error({ text: "You must be logged in to use this feature." });
  }
  async function getInfo() {
    if (id === "null") {
      setNotAvailable(true);
      return;
    }

    let aniRes = await axios({
      url: process.env.REACT_APP_BASE_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        query: searchByIdQuery,
        variables: {
          id,
        },
      },
    }).catch((err) => {
      console.log(err);
    });

    let watchRes = null;
    if (anilistMalToId) {
      console.log(parseInt(anilistMalToId));
      watchRes = await axios({
        url: process.env.REACT_APP_BASE_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("anilistAccessToken")}`,
        },
        data: {
          query: `
            query ($mediaId: Int, $userId: Int) {
              MediaList(mediaId: $mediaId, userId: $userId) {
                id
                status
                media {
                  title {
                    english
                  }
                }
              }
            }
          `,
          variables: {
            mediaId: anilistMalToId, // Convert string to integer
            userId: 5600871,
          },
        },
      })
        .catch((err) => {
          console.log(err);
        })
        .then((data) => {
          console.log(data);
        });
    } else;

    // Set state based on both responses
    setAnilistResponse(aniRes.data.data.Media);
    console.log(aniRes.data.data.Media.id);

    /*
    let malRes = await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}api/getidinfo?malId=${id}`)
      .catch((err) => {
        setNotAvailable(true);
      });

https://api.consumet.org/meta/anilist/info/150075

    //malIdToGogoanimeId()
    console.log(malRes.data);

    /*
    let malRes2 = await axios.get(
      `https://api.consumet.org/anime/gogoanime/info/${sanitizedTitle}`
    );
    console.log(malRes2);
*/

    let malRes = await axios
      .get(
        `https://api.consumet.org/meta/anilist/info/${aniRes.data.data.Media.id}`
      )
      .catch((err) => {
        setNotAvailable(true);
      });

    console.log(malRes.data);
    setMalResponse(malRes.data);
    setLoading(false);
  }

  const getStreamingLink = (episodeNumber) => {
    const streamingLink = `https://api.consumet.org/meta/anilist/watch/spy-x-family-episode-${episodeNumber}`;
    // Add your logic to handle the streaming link
    // e.g., make an API call or perform any necessary processing
    return streamingLink;
  };

  return (
    <div>
      {notAvailable && (
        <NotAvailable>
          <img src="./assets/404.png" alt="404" />
          <h1>Oops! This anime isn't available.</h1>
        </NotAvailable>
      )}
      {loading && !notAvailable && <AnimeDetailsSkeleton />}
      {!loading && !notAvailable && (
        <Content>
          {anilistResponse !== undefined && (
            <div>
              <BannerContainer>
                <ButtonsContainer>
                  {localStorage.getItem("anilistClientId") && <Favorite />}
                  <ChangeStatus />
                </ButtonsContainer>
                <Banner
                  src={
                    anilistResponse.bannerImage !== null
                      ? anilistResponse.bannerImage
                      : "https://cdn.wallpapersafari.com/41/44/6Q9Nwh.jpg"
                  }
                  alt=""
                />
              </BannerContainer>

              <ContentWrapper>
                <Poster>
                  <img src={anilistResponse.coverImage.extraLarge} alt="" />
                  <Button to={`/play/${malResponse.subLink}/1`}>
                    Watch Sub
                  </Button>
                  {malResponse.isDub && (
                    <Button
                      className="outline"
                      to={`/play/${malResponse.dubLink}/1`}
                    >
                      Watch Dub
                    </Button>
                  )}
                </Poster>
                <div>
                  <h1>{anilistResponse.title.userPreferred}</h1>
                  {anilistResponse.title.english != null && (
                    <h3>{"English - " + anilistResponse.title.english}</h3>
                  )}
                  <p>
                    <span>Type: </span>
                    {anilistResponse.type}
                  </p>
                  {width <= 600 && expanded && (
                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: `<span>Plot Summery: </span>${anilistResponse.description}`,
                        }}
                      ></p>
                      <button onClick={() => readMoreHandler()}>
                        read less
                      </button>
                    </section>
                  )}

                  {width <= 600 && !expanded && (
                    <p>
                      <span>Plot Summery: </span>
                      {anilistResponse.description.substring(0, 200) + "... "}
                      <button onClick={() => readMoreHandler()}>
                        read more
                      </button>
                    </p>
                  )}
                  {width > 600 && (
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          "<span>Plot Summery: </span>" +
                          anilistResponse.description,
                      }}
                    ></p>
                  )}

                  <p>
                    <span>Genre: </span>
                    {anilistResponse.genres.toString()}
                  </p>
                  <p>
                    <span>Released: </span>
                    {anilistResponse.startDate.year}
                  </p>
                  <p>
                    <span>Status: </span>
                    {anilistResponse.status}
                  </p>
                  <p>
                    <span>Number of Episodes: </span>
                    {malResponse.totalEpisodes}
                  </p>
                  {malResponse.isDub && (
                    <p>
                      <span>Number of Dub Episodes: </span>
                      {malResponse.totalEpisodes}
                    </p>
                  )}
                </div>
              </ContentWrapper>
              <Episode>
                <DubContainer>
                  <h2>Episodes</h2>
                  {malResponse.isDub && (
                    <div class="switch">
                      <label for="switch">
                        <input
                          type="checkbox"
                          id="switch"
                          onChange={(e) => setDub(!dub)}
                        ></input>
                        <span class="indicator"></span>
                        <span class="label">{dub ? "Dub" : "Sub"}</span>
                      </label>
                    </div>
                  )}
                </DubContainer>
                {width > 600 && (
                  <Episodes>
                    {malResponse.isDub &&
                      dub &&
                      [...Array(malResponse.dubTotalEpisodes)].map((x, i) => (
                        <EpisodeLink
                          to={`/play/${malResponse.dubLink}/${parseInt(i) + 1}`}
                        >
                          Episode {i + 1}
                        </EpisodeLink>
                      ))}

                    {!dub &&
                      [...Array(malResponse.totalEpisodes)].map((x, i) => (
                        <EpisodeLink
                          to={`/play/spy-x-family/${parseInt(i) + 1}`}
                        >
                          Episode {i + 1}
                        </EpisodeLink>
                      ))}
                  </Episodes>
                )}
                {width <= 600 && (
                  <Episodes>
                    {malResponse.isDub &&
                      dub &&
                      [...Array(malResponse.dubTotalEpisodes)].map((x, i) => (
                        <EpisodeLink
                          to={`/play/${malResponse.dubLink}/${parseInt(i) + 1}`}
                        >
                          {i + 1}
                        </EpisodeLink>
                      ))}

                    {!dub &&
                      [...Array(malResponse.subTotalEpisodes)].map((x, i) => (
                        <EpisodeLink
                          to={`/play/${malResponse.subLink}/${parseInt(i) + 1}`}
                        >
                          {i + 1}
                        </EpisodeLink>
                      ))}
                  </Episodes>
                )}
              </Episode>
            </div>
          )}
        </Content>
      )}
    </div>
  );
}

const BannerContainer = styled.div`
  position: relative;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
`;

const ButtonChange = styled.button`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 0.4%;
  font-family: "Lexend", sans-serif;
  box-sizing: unset;
  color: white;

  background: transparent;
  border-color: ${COLORS.colorButton};
  border-radius: 0.4rem;
  border-style: solid;
  border-width: 2.5px;

  cursor: pointer;

  transition: ${COLORS.buttonTransition};

  :hover {
    background-color: ${COLORS.colorButton};
  }
  margin: 0;
  width: 35px;
  height: 35px;
  margin-left: 10px;
`;

const ButtonFavorite = styled.button`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  padding: 0.4%;

  box-sizing: unset;
  color: white;

  background: transparent;
  border-color: ${COLORS.colorRed};
  border-radius: 0.4rem;
  border-style: solid;
  border-width: 2.5px;

  cursor: pointer;

  transition: ${COLORS.buttonTransition};

  :hover {
    background-color: ${COLORS.colorRed};
  }
  margin: 0;
  width: 35px;
  height: 35px;
  margin-left: 10px;
`;

const ButtonFavorited = styled.button`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  padding: 0.4%;

  box-sizing: unset;
  color: white;

  background-color: ${COLORS.colorRed};
  border-color: ${COLORS.colorRed};
  border-radius: 0.4rem;
  border-style: solid;
  border-width: 2.5px;

  cursor: pointer;

  transition: ${COLORS.buttonTransition};

  :hover {
    background-color: ${COLORS.colorRed};
  }
  margin: 0;
  width: 35px;
  height: 35px;
  margin-left: 10px;
`;

const Banner = styled.img`
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-radius: 0.7rem;

  @media screen and (max-width: 600px) {
    height: 13rem;
    border-radius: 0.5rem;
  }
`;

const NotAvailable = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5rem;
  img {
    width: 30rem;
  }

  h1 {
    margin-top: -2rem;
    font-weight: normal;
    font-weight: 600;
  }

  @media screen and (max-width: 600px) {
    img {
      width: 18rem;
    }

    h1 {
      font-size: 1.3rem;
    }
  }
`;

const DubContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;

  .switch {
    position: relative;

    label {
      display: flex;
      align-items: center;
      font-family: "Lexend", sans-serif;
      font-weight: 400;
      cursor: pointer;
      margin-bottom: 0.3rem;
    }

    .label {
      margin-bottom: 0.7rem;
      font-weight: 500;
    }

    .indicator {
      position: relative;
      width: 60px;
      height: 30px;
      background: #242235;
      border: 2px solid #393653;
      display: block;
      border-radius: 30px;
      margin-right: 10px;
      margin-bottom: 10px;

      &:before {
        width: 22px;
        height: 22px;
        content: "";
        display: block;
        background: #7676ff;
        border-radius: 26px;
        transform: translate(2px, 2px);
        position: relative;
        z-index: 2;
        transition: all 0.5s;
      }
    }
    input {
      visibility: hidden;
      position: absolute;

      &:checked {
        & + .indicator {
          &:before {
            transform: translate(32px, 2px);
          }
          &:after {
            width: 54px;
          }
        }
      }
    }
  }
`;

const Episode = styled.div`
  margin: 0 4rem 0 4rem;
  padding: 2rem;
  outline: 2px solid #272639;
  border-radius: 0.5rem;
  color: white;

  h2 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  box-shadow: 0px 4.41109px 20.291px rgba(16, 16, 24, 0.81);

  @media screen and (max-width: 600px) {
    padding: 1rem;
    margin: 1rem;
  }
`;

const Episodes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-gap: 1rem;
  grid-row-gap: 1rem;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  }
`;

const EpisodeLink = styled(Link)`
  text-align: center;
  color: white;
  text-decoration: none;
  background-color: #242235;
  padding: 0.9rem 2rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid #393653;
  transition: 0.2s;

  :hover {
    background-color: #7676ff;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;
    border-radius: 0.3rem;
    font-weight: 500;
  }
`;

const Content = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  position: relative;

  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 3rem 0 3rem;
  display: flex;

  div > * {
    margin-bottom: 0.6rem;
  }

  div {
    margin: 1rem;
    font-size: 1rem;
    color: #b5c3de;
    span {
      font-weight: 700;
      color: white;
    }
    p {
      font-weight: 300;
      text-align: justify;
    }
    h1 {
      font-weight: 700;
      color: white;
    }
    h3 {
      font-weight: 500;
    }
    button {
      display: none;
    }
  }

  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column-reverse;
    padding: 0;
    div {
      margin: 1rem;
      margin-bottom: 0.2rem;
      h1 {
        font-size: 1.6rem;
      }
      p {
        font-size: 1rem;
      }
      button {
        display: inline;
        border: none;
        outline: none;
        background-color: transparent;
        text-decoration: underline;
        font-weight: 700;
        font-size: 1rem;
        color: white;
      }
    }
  }
`;

const Poster = styled.div`
  display: flex;
  flex-direction: column;
  img {
    width: 220px;
    height: 300px;
    border-radius: 0.5rem;
    margin-bottom: 2.3rem;
    position: relative;
    top: -20%;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
  }
  @media screen and (max-width: 600px) {
    img {
      display: none;
    }
  }

  .outline {
    background-color: transparent;
    border: 2px solid #9792cf;
  }

  .outline-favorite {
    background-color: transparent;
    border: 2px solid ${COLORS.colorRed};
  }
`;

const Button = styled(Link)`
  font-size: 1.2rem;
  padding: 1rem 3.4rem;
  text-align: center;
  text-decoration: none;
  color: white;
  background-color: #7676ff;
  font-weight: 700;
  border-radius: 0.4rem;
  position: relative;
  top: -25%;
  white-space: nowrap;

  @media screen and (max-width: 600px) {
    display: block;
    width: 100%;
  }
`;

export default MalAnimeDetails;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import AnimeDetailsSkeleton from "../components/skeletons/AnimeDetailsSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { searchByIdQuery } from "../hooks/searchQueryStrings";
import { IconContext } from "react-icons";
import { Menu, Text } from "@mantine/core";
import toast from "react-hot-toast";
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
import AnimeCards from "../components/Home/AnimeCards";
function MalAnimeDetails() {
  const id = useParams().id;
  const watching = false;
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { width } = useWindowDimensions();
  const [anilistResponse, setAnilistResponse] = useState();
  const [malResponse, setMalResponse] = useState();
  const [expanded, setExpanded] = useState(false);

  const [dub, setDub] = useState(false);
  const [toggleDub, setToggleDub] = useState(true);

  const [notAvailable, setNotAvailable] = useState(false);
  const [episode, setEpisode] = useState(null);
  async function checkForDub(episodess) {
    let modifiedSlug = episodess.slice(0, -3) + "dub";
    try {
      await axios.get(
        `https://tanoshii-backend.vercel.app/anime/zoro/watch?episodeId=${modifiedSlug}`
      );
      setDub(true);
    } catch (err) {
      console.log(err);
    }
  }
  function ChangeStatus() {
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
              ChangeAnimeStatus({ type: "COMPLETED", animeId: id })
            }
          >
            Complete
          </Menu.Item>
          <Menu.Item
            onClick={() => ChangeAnimeStatus({ type: "CURRENT", animeId: id })}
          >
            Watching
          </Menu.Item>
          <Menu.Item
            onClick={() => ChangeAnimeStatus({ type: "DROPPED", animeId: id })}
          >
            Dropped
          </Menu.Item>
          <Menu.Item
            onClick={() => ChangeAnimeStatus({ type: "PLANNING", animeId: id })}
          >
            Planning
          </Menu.Item>
          <Menu.Item
            color="red"
            onClick={() => ChangeAnimeStatus({ type: "DELETE", animeId: id })}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  function Favorite() {
    return (
      <div>
        {isFavorite && localStorage.getItem("anilistClientId") && (
          <IconContext.Provider value={{ style: { padding: "17.5%" } }}>
            <ButtonFavorited
              className="outline-favorite"
              onClick={() => toggleFavorite({ aniId: id })}
            >
              <FiHeart color="white" fill="white" size={"100%"} />
            </ButtonFavorited>
          </IconContext.Provider>
        )}
        {!isFavorite && localStorage.getItem("anilistClientId") && (
          <IconContext.Provider value={{ style: { padding: "17.5%" } }}>
            <ButtonFavorite
              className="outline-favorite"
              onClick={() => {
                toggleFavorite({ aniId: id });
              }}
            >
              <FiHeart color="white" size={"100%"} />
            </ButtonFavorite>
          </IconContext.Provider>
        )}
        {!localStorage.getItem("anilistClientId") && (
          <IconContext.Provider value={{ style: { padding: "17.5%" } }}>
            <ButtonFavorite
              className="outline-favorite"
              onClick={() => {
                SignIn();
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
    if (notAvailable == false) {
      let animeid = id;
      if (localStorage.getItem("anilistClientId")) {
        let response = await axios({
          url: process.env.REACT_APP_BASE_URL,
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "anilistAccessToken"
            )}`,
          },
          data: {
            query: `
                    query ($idMal: Int) {
                      Media(id: $idMal) {
                        isFavourite
                      }
                    }
                  `,
            variables: { idMal: id },
          },
        })
          .then((data) => {
            setIsFavorite(data.data.data.Media.isFavourite);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              // Handle the 404 error
              setNotAvailable(true);
            } else {
              // Handle other errors
              console.log("Error:", error.message);
            }
          });
      } else setIsFavorite(false);
    } else return;
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
        .catch((err) => {
          Error({ text: err });
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
    localStorage.setItem("dub", false);

    window.scrollTo(0, 0);
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
    }).catch((error) => {
      if (error.response && error.response.status === 404) {
        // Handle the 404 error
        setNotAvailable(true);
      } else {
        // Handle other errors
        console.log("Error:", error.message);
      }
    });
    let watchRes = null;

    setAnilistResponse(aniRes.data.data.Media);
    let anilistId = aniRes.data.data.Media.id;
    let malRes = await axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/info/${aniRes.data.data.Media.id}`
      )
      .catch((err) => {
        setNotAvailable(true);
      });
    await axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/episodes/${aniRes.data.data.Media.id}?provider=zoro`
      )
      .catch((err) => {
        //setNotAvailable(true);
      })
      .then((data) => {
        setEpisode(data.data);
        checkForDub(data.data[0].id);
      });

    setMalResponse(malRes.data);
    setLoading(false);
  }

  return (
    <div>
      {notAvailable && (
        <NotAvailable>
          <img src="./assets/404.png" alt="404" />
          <h1 style={{ paddingBottom: "22%" }}>
            Oops! This anime isn't available.
          </h1>
        </NotAvailable>
      )}
      {loading && !notAvailable && <AnimeDetailsSkeleton />}
      {!loading && !notAvailable && (
        <Content>
          {anilistResponse !== undefined && (
            <div>
              <BannerContainer>
                <ButtonsContainer>
                  <Favorite />
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
                  {dub && (
                    <div class="switch">
                      <label for="switch">
                        <input
                          type="checkbox"
                          id="switch"
                          onChange={(e) => {
                            setToggleDub(!toggleDub);
                            localStorage.setItem("dub", toggleDub);
                          }}
                        ></input>
                        <span class="indicator"></span>
                        <span class="label">{dub ? "Dub" : "Sub"}</span>
                      </label>
                    </div>
                  )}
                </DubContainer>
                {width > 600 && (
                  <Episodes>
                    {episode?.length > 0 &&
                      (toggleDub
                        ? [...episode].sort((a, b) => a.number - b.number)
                        : [...episode].sort((a, b) => a.number - b.number)
                      ).map((epi, index) => {
                        return (
                          <EpisodeLink
                            key={index}
                            to={`/play/${
                              toggleDub ? epi.id : epi.id.slice(0, -3) + "dub"
                            }/${id}/${epi.number}`}
                          >
                            Episode {epi.number}
                          </EpisodeLink>
                        );
                      })}
                    {episode?.length === 0 && (
                      <div>Sorry, no episodes found.</div>
                    )}
                  </Episodes>
                )}
                {width <= 600 && (
                  <Episodes>
                    {episode?.length > 0 &&
                      [...episode]
                        .sort((a, b) => a.number - b.number)
                        .map((epi, index) => {
                          return (
                            <EpisodeLink
                              key={index}
                              to={`/play/${epi.id}/${id}/${epi.number}`}
                            >
                              {epi.number}
                            </EpisodeLink>
                          );
                        })}
                  </Episodes>
                )}
              </Episode>
              <RecommendationsContainer>
                <RecommendationsText>Recommendations</RecommendationsText>
                {anilistResponse ? (
                  <AnimeCards
                    episodes={anilistResponse.recommendations.edges}
                  />
                ) : (
                  <></>
                )}
              </RecommendationsContainer>
            </div>
          )}
        </Content>
      )}
    </div>
  );
}

const RecommendationsContainer = styled.div`
  margin: 2rem;
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
`;

const RecommendationsText = styled.h1`
  font-weight: 700;
  color: white;

  padding-bottom: 1rem;
  padding-top: 1rem;
`;

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
const Button3 = styled(Link)`
  position: relative;
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
  @media screen and (min-width: 1200px) {
    position: relative;
  }
`;

export default MalAnimeDetails;

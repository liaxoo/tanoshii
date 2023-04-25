import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import AnimeCardsSkeleton from "../skeletons/AnimeCardsSkeleton";
import { IoClose } from "react-icons/io5";
import { IconContext } from "react-icons";
import { searchWatchedId } from "../../hooks/searchQueryStrings";

/*
Functions
*/
import GetAnimeEpisode from "../Home/GetAnimeEpisode";

import "swiper/css";
import "swiper/css/scrollbar";

function AniListWatchingEpisodes() {
  const [AniListWatchingEpisodesData, setAniListWatchingEpisodesData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);

  const userClientId = localStorage.getItem('anilistClientId')



  function GetAnimeOf() {
    const [loading, setLoading] = useState(true);
    const [AniListWatchingEpisodesData, setAniListWatchingEpisodesData] = useState([]);

    useEffect(() => {
      fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
        query ($clientId: Int!) {
          MediaListCollection(userId: $clientId, type: ANIME, status: CURRENT) {
            lists {
              entries {
                media {
                  id
                  idMal
                  title {
                    romaji
                    native
                    english
                  }
                  coverImage {
                    large
                  }
                }
              }
            }
          }
        }
      `,
          variables: {
            clientId: userClientId,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAniListWatchingEpisodesData(data);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }, []);

    if (loading) {
      return <AnimeCardsSkeleton />;
    }

    return loading ? (
      <AnimeCardsSkeleton />
    ) : (
      <Swiper
        slidesPerView={7}
        spaceBetween={35}
        scrollbar={{
          hide: false,
        }}
        breakpoints={{
          "@0.00": {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          "@0.75": {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          "@1.00": {
            slidesPerView: 4,
            spaceBetween: 35,
          },
          "@1.30": {
            slidesPerView: 5,
            spaceBetween: 35,
          },
          "@1.50": {
            slidesPerView: 7,
            spaceBetween: 35,
          },
        }}
        modules={[Scrollbar]}
        className="mySwiper"
      >
        <div>

          {AniListWatchingEpisodesData.data.MediaListCollection.lists[0].entries.map((item) => (
            <SwiperSlide>
              <Wrapper key={item.media.id}>
                <IconContext.Provider
                  value={{
                    size: "1.2rem",
                    color: "white",
                    style: {
                      verticalAlign: "middle",
                    },
                  }}
                >
                  <button className="closeButton" onClick={() => {}}>
                  <p>
                     <GetAnimeEpisode clientId={userClientId} animeId={item.media.id}/>
                  </p>
                  </button>
                </IconContext.Provider>

                <Link to={`id/${item.media.idMal}/`}>
                  <img src={item.media.coverImage.large} alt="" />
                </Link>
                <p>
                  {item.media.title.english !== null
                    ? item.media.title.english
                    : item.media.title.native}
                </p>
              </Wrapper>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    );
  }
  return (
    <div>
      <GetAnimeOf />
    </div>
  );
}

const Wrapper = styled.div`
  position: relative;

  .closeButton {
    position: absolute;
    cursor: pointer;
    outline: none;
    border: none;
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0.5rem 0 0.2rem 0;
  }
  img {
    width: 160px;
    height: 235px;
    border-radius: 0.5rem;
    margin-bottom: 0.3rem;
    object-fit: cover;
    @media screen and (max-width: 600px) {
      width: 120px;
      height: 180px;
    }
    @media screen and (max-width: 400px) {
      width: 100px;
      height: 160px;
    }
  }

  p {
    color: white;
    font-size: 1rem;
    font-weight: 400;
    @media screen and (max-width: 600px) {
      max-width: 120px;
    }
    @media screen and (max-width: 400px) {
      max-width: 100px;
    }

    Link {
      color: white;
      font-size: 1rem;
      font-weight: 400;
      @media screen and (max-width: 600px) {
        max-width: 120px;
      }
      @media screen and (max-width: 400px) {
        max-width: 100px;
      }
  }

  .episodeNumber {
    font-size: 0.9rem;
    font-weight: 300;
    color: #b5c3de;
  }
`;

export default AniListWatchingEpisodes;

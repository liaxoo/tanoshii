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

const GetAnimeEpisode = ({ clientId, animeId }) => {
  const [loading, setLoading] = useState(true);
  const [
    AniListWatchingEpisodesData,
    setAniListWatchingEpisodesData,
  ] = useState([]);

  useEffect(() => {
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
          query ($mediaId: Int!, $userId: Int!) {
            MediaList(mediaId: $mediaId, userId: $userId, type: ANIME) {
              progress
              media {
                title {
                  romaji
                }
                episodes
              }
            }
          }
        `,
        variables: {
          userId: clientId,
          mediaId: animeId,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setAniListWatchingEpisodesData(data);
      })
      .catch((error) => console.error(error));
  }, []);

  if (
    !AniListWatchingEpisodesData.data ||
    !AniListWatchingEpisodesData.data.MediaList
  ) {
    return;
  }

  const { progress, media } = AniListWatchingEpisodesData.data.MediaList;

  return (
    <ProgressText>
      {progress}/{media.episodes}
    </ProgressText>
  );
};

const ProgressText = styled.span`
  color: white;
  font-size: 1rem;
  font-weight: 400;
  font-family: "Lexend", sans-serif;
  @media screen and (max-width: 600px) {
    max-width: 120px;
  }
  @media screen and (max-width: 400px) {
    max-width: 100px;
  }
`;

export default GetAnimeEpisode;

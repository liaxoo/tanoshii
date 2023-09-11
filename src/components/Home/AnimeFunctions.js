import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

import { Error, Success, SignIn } from "../../components/NotificationManager";
import toast from "react-hot-toast";
import { ActionIcon } from "@mantine/core";
import { FiHeart } from "react-icons/fi";

const MalToAniList = (malID) => {
  const [data, setData] = useState();
  useEffect(() => {
    fetch(process.env.REACT_APP_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
        query($malId: Int!) {
        Media (idMal: $malId, type: ANIME) {
          id
          title {
            english
          }
        }
        }
    `,
        variables: {
          malId: malID,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data.data.Media.id);
        setData(data.data.Media.id);
      })
      .catch((error) => console.error(error));
  }, []);
  return data;
};

const AnimeFavoriteStatus = ({ animeId, accessToken }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const query = `
        query ($animeId: Int!) {
          Media (id: $animeId) {
            isFavourite
          }
        }
      `;

      const variables = {
        animeId: parseInt(animeId),
      };

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const endpoint = process.env.REACT_APP_BASE_URL;

      try {
        const response = await axios.post(
          endpoint,
          { query, variables },
          { headers }
        );

        if (response.data.errors) {
          console.error(response.data.errors);
          setIsFavorite(false);
        } else {
          setIsFavorite(response.data.data.Media.isFavourite);
        }
      } catch (error) {
        console.error(error);
        setIsFavorite(false);
      }
    };

    fetchFavoriteStatus();
  }, [animeId, accessToken]);

  return isFavorite;
};

export default AnimeFavoriteStatus;

async function ChangeAnimeStatus({ type, animeId }) {
  if (localStorage.getItem("anilistClientId")) {
    if (type != "DELETE") {
      await axios({
        url: process.env.REACT_APP_BASE_URL,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("anilistAccessToken")}`,
        },
        data: {
          query: `
        mutation($mediaId: Int, $status: MediaListStatus) {
          SaveMediaListEntry(mediaId: $mediaId, status: $status) {
            id
            status
          }
        }`,
          variables: { mediaId: animeId, status: type },
        },
      })
        .catch((error) => {
          Error({ text: error });
        })
        .then((data) => {
          Success({ text: `Changed status to ${type}.` });
        });
      return;
    } else {
      toast.error(
        `We are currently having issues with this feature. Please try again later.`,
        {
          position: "top-center",
        }
      );
      /*
      await axios({
        url: process.env.REACT_APP_BASE_URL,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("anilistAccessToken")}`,
        },
        data: {
          query: `
          query($userId: Int, $mediaId: Int) {
            MediaList(userId: $userId, mediaId: $mediaId) {
              id
            }
          }`,
          variables: {
            userId: 5600871,
            mediaId: 21,
          },
        },
      })
        .catch((error) => {
          Error({
            text:
              "This anime is currently not one your account. Please change the status.",
          });
        })
        .then((data) => {
          console.log(data.data.data.MediaList.id);
        });
        */
    }
  } else return SignIn();
}

async function ChangeAnimeEpisode({ animeId, progress }) {
  if (
    localStorage.getItem("anilistClientId") &&
    localStorage.getItem("sync") != "false"
  ) {
    await axios({
      url: process.env.REACT_APP_BASE_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("anilistAccessToken")}`,
      },
      data: {
        query: `
        mutation($mediaId: Int, $progress: Int) {
    SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
      id
    }
  }`,
        variables: { mediaId: animeId, progress: progress },
      },
    }).catch((error) => {
      Error({ text: `there was an error processing your request. ${error}` });
    });
  }
  return;
}

export {
  MalToAniList,
  AnimeFavoriteStatus,
  ChangeAnimeStatus,
  ChangeAnimeEpisode,
};

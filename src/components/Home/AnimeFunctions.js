import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

import { ActionIcon } from "@mantine/core";
import { FiHeart } from "react-icons/fi";

async function Favorite({ malId }) {
  let [data, setData] = useState();

  useEffect(() => {
    fetch("https://graphql.anilist.co", {
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
          malId: malId,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.data.Media.id);
      })
      .catch((error) => console.error(error));
  }, []);
  return data;
}

async function MalToAniList({ malId }) {
  let [data, setData] = useState();
  useEffect(() => {
    fetch("https://graphql.anilist.co", {
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
          malId: malId,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.data.Media.id);
      })
      .catch((error) => console.error(error));
  }, []);
  return data;
}

function AnimeFavoriteStatus({ animeId, accessToken }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchFavoriteStatus() {
      try {
        const response = await axios({
          url: process.env.REACT_APP_BASE_URL,
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            query: `
              query ($idMal: Int) {
                Media(id: $idMal) {
                  isFavourite
                }
              }
            `,
            variables: { idMal: animeId },
          },
        });
        setIsFavorite(response.data.data.Media.isFavourite);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFavoriteStatus();
  }, [animeId, accessToken]);

  return isFavorite;
}

export default AnimeFavoriteStatus;

export { MalToAniList, AnimeFavoriteStatus };

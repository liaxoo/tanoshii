import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

import { ActionIcon } from "@mantine/core";
import { FiHeart } from "react-icons/fi";

const MalToAniList = (malID) => {
  const [data, setData] = useState();
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
          malId: malID,
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

      const endpoint = "https://graphql.anilist.co";

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

export { MalToAniList, AnimeFavoriteStatus };

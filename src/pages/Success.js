import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import HomeSkeleton from "../components/skeletons/CarouselSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { FiArrowRight } from "react-icons/fi";
import { TrendingAnimeQuery } from "../hooks/searchQueryStrings";
import { IconContext } from "react-icons";

function Success() {
  const { height, width } = useWindowDimensions();

  return (
    <div>
      <HomeDiv>
        <HomeHeading>
          <span>Success!</span>
        </HomeHeading>
        <Text>Your AniList account was successfully authenticated.</Text>
      </HomeDiv>
    </div>
  );
}

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

export default Success;

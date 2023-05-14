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
          <span>Settings</span>
        </HomeHeading>

        <Text>
          If changes aren't being made when you save, refresh the browser.
        </Text>
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

const Switch = styled.div`
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
`;

export default Success;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import HomeSkeleton from "../components/skeletons/CarouselSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { FiArrowRight } from "react-icons/fi";
import { TrendingAnimeQuery } from "../hooks/searchQueryStrings";
import { IconContext } from "react-icons";

function About() {
  const { height, width } = useWindowDimensions();

  return (
    <div>
      <HomeDiv>
        <HomeHeading>
          <span>About</span>
        </HomeHeading>

        <Text>
          The idea of Tanoshii began 5 years ago when I watched my first anime,{" "}
          <Link to={`/id/16498`}>Attack on Titan</Link>. During that time, I
          began learning Web Development and began creating Tanoshii. The
          problem was I was extremely unexperienced and unprepared for the
          challenges of web development. I got burnt out, and quit. Fast forward
          3 years. During lockdown, I began to pursue my hobby of being a web
          developer, and began making Tanoshii again. The early days of Tanoshii
          was merely a search engine to see details of anime. I finally began
          making what you see here around 6 months ago. Tanoshii is made by a
          single developer. If you can, please consider donating via the donate
          button in the dropdown of your profile. If you would like to contact
          me, feel free to send me a PM on Twitter @Tanoshiiapp or DM me on
          Discord: Liaxo#4964. Your feedback means the world to me.
        </Text>
        <h2>Feature Requests</h2>
        <Text>
          Currently, Tanoshii is not accepting feature requests. I am still
          working on optimization. In the meantime, here is a tenative list of
          features that are in development:
          <li>Personalized Recommendations</li>
          <li>Light/Dark Mode</li>
          <li>Settings</li>
          <li>UI Revamp</li>
          <li>Reviews</li>
          <li>Optimizations</li>
          <li>Hosting own API</li>
          <li>Character Pages</li>
          <li>Server Options on Watch Page</li>
          <li>Discord Server</li>
          <li>Manga Integration</li>
          <li>Twitter/KoFi Pages</li>
        </Text>
        <h2>DMCA Takedown Request</h2>
        <Text>
          Tanoshii doesn't store any data in its servers, Tanoshii only links to
          the media which is hosted on 3rd party services. Regardless, we take
          DMCA Takedown Requests seriously, and have made a form to submit
          requests. Any response will be emailed within 48 business hours of the
          form completion. We cannot guarantee any takedown requests. You can
          locate the form{" "}
          <a href="https://forms.gle/AauZGT3yQ1q5nui18">here.</a>
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

export default About;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Carousel from "../components/Home/Carousel";
import axios from "axios";
import AnimeCards from "../components/Home/AnimeCards";
import HomeSkeleton from "../components/skeletons/CarouselSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import WatchingEpisodes from "../components/Home/WatchingEpisodes";
import { TrendingAnimeQuery } from "../hooks/searchQueryStrings";
import AniListWatchingEpisodes from "../components/Home/AniListWatchingEpisodes";
import { Menu } from "@headlessui/react";

function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    getImages();
  }, []);

  async function getImages() {
    window.scrollTo(0, 0);
    let result = await axios({
      url: process.env.REACT_APP_BASE_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        query: TrendingAnimeQuery,
        variables: {
          page: 1,
          perPage: 15,
        },
      },
    }).catch((err) => {
      console.log(err);
    });
    setImages(result.data.data.Page.media);
    setLoading(false);
    document.title = "Tanoshii - Watch anime for free, ad-free!";
  }

  function checkSize() {
    let lsData = localStorage.getItem("Watching");
    lsData = JSON.parse(lsData);
    if (lsData.length === 0) {
      return false;
    }
    return true;
  }

  return (
    <div>
      <HomeDiv>
        <HomeHeading>
          <span>Featured</span>
        </HomeHeading>
        {loading && <HomeSkeleton />}
        {!loading && <Carousel images={images} />}
        {localStorage.getItem("Watching") &&
          checkSize() &&
          !localStorage.getItem("anilistAccessToken") && (
            <div>
              <HeadingWrapper>
                <Heading>
                  <span>Continue Watching</span>
                </Heading>
              </HeadingWrapper>
              <WatchingEpisodes />
            </div>
          )}
        {localStorage.getItem("anilistAccessToken") && (
          <div>
            <HeadingWrapper>
              <Heading>
                <span>Continue Watching from AniList</span>
              </Heading>
            </HeadingWrapper>
            <AniListWatchingEpisodes />
          </div>
        )}
        <div>
          <HeadingWrapper>
            <Heading>
              <span>Trending</span>
            </Heading>
            <Links to="/trending/1">View All</Links>
          </HeadingWrapper>
          <AnimeCards count={width <= 600 ? 7 : 15} criteria="trending" />
        </div>
        <div>
          <HeadingWrapper>
            <Heading>
              <span>Popular</span>
            </Heading>
            <Links to="/popular/1">View All</Links>
          </HeadingWrapper>
          <AnimeCards count={width <= 600 ? 7 : 15} criteria="popular" />
        </div>
        <div>
          <HeadingWrapper>
            <Heading>
              <span>Top Rated</span>
            </Heading>
            <Links to="/top100/1">View All</Links>
          </HeadingWrapper>
          <AnimeCards count={width <= 600 ? 7 : 15} criteria="toprated" />
        </div>

        <div>
          <HeadingWrapper>
            <Heading>
              <span>Popular Movies</span>
            </Heading>
            <Links to="/movies">View All</Links>
          </HeadingWrapper>
          <AnimeCards count={width <= 600 ? 7 : 15} criteria="movie" />
        </div>
      </HomeDiv>
    </div>
  );
}

const Links = styled(Link)`
  color: white;
  font-size: 1.1rem;
  font-family: "Gilroy-Medium", sans-serif;
  @media screen and (max-width: 600px) {
    color: white;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
  }
`;

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

const Heading = styled.p`
  font-size: 1.8rem;
  color: white;
  font-weight: 200;
  margin-top: 1rem;
  span {
    font-weight: 600;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  @media screen and (max-width: 600px) {
    margin-top: 1rem;
  }
`;

export default Home;

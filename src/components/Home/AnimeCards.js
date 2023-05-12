import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import AnimeCardsSkeleton from "../../components/skeletons/AnimeCardsSkeleton";

import "swiper/css";
import "swiper/css/scrollbar";

import {
  PopularAnimeQuery,
  TrendingAnimeQuery,
  top100AnimeQuery,
} from "../../hooks/searchQueryStrings";

function AnimeCards(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    let res = null;

    if (props.criteria == "trending") {
      res = await axios({
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
            perPage: 7,
          },
        },
      })
        .catch((err) => {
          Error({ err });
        })
        .then((data) => {
          setLoading(false);
          setData(data.data.data.Page.media);
        });
    } else if (props.criteria == "popular") {
      res = await axios({
        url: process.env.REACT_APP_BASE_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          query: PopularAnimeQuery,
          variables: {
            page: 1,
            perPage: props.count,
            format: "TV",
          },
        },
      })
        .catch((err) => {
          Error({ err });
        })
        .then((data) => {
          setLoading(false);
          setData(data.data.data.Page.media);
        });
    } else if (props.criteria == "movie") {
      res = await axios({
        url: process.env.REACT_APP_BASE_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          query: PopularAnimeQuery,
          variables: {
            page: 1,
            perPage: props.count,
            format: "MOVIE",
          },
        },
      })
        .catch((err) => {
          Error({ err });
        })
        .then((data) => {
          setLoading(false);
          setData(data.data.data.Page.media);
        });
    } else if (props.criteria == "toprated") {
      res = await axios({
        url: process.env.REACT_APP_BASE_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          query: top100AnimeQuery,
          variables: {
            page: 1,
            perPage: props.count,
          },
        },
      })
        .catch((err) => {
          Error({ err });
        })
        .then((data) => {
          setLoading(false);
          setData(data.data.data.Page.media);
        });
    }
  }
  return (
    <div>
      {loading && <AnimeCardsSkeleton />}
      {!loading && (
        <Swiper
          slidesPerView={7}
          spaceBetween={35}
          scrollbar={{
            hide: true,
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
          {data.map((item, i) => (
            <SwiperSlide>
              <Wrapper>
                <Link to={"id/" + item.malId}>
                  <img src={item.coverImage.large} alt="" />
                </Link>
                <p>{item.title.english}</p>
              </Wrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

const Wrapper = styled.div`
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
  }
`;

export default AnimeCards;

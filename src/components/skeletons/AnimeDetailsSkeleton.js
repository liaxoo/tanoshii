import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";

import "swiper/css";
import "swiper/css/scrollbar";

function AnimeDetailsSkeleton() {
  const { width, height } = useWindowDimensions();

  return (
    <Content>
      <Skeleton
        height={width <= 600 ? "13rem" : "20rem"}
        baseColor={"#262539"}
        highlightColor={"#34324D"}
        style={{
          borderRadius: "0.7rem",
          marginBottom: width <= 600 ? "1rem" : "2rem",
        }}
      />
      <ContentWrapper>
        <Skeleton
          baseColor={"#262539"}
          highlightColor={"#34324D"}
          count={7}
          style={{
            marginBottom: "2rem",
          }}
        />
      </ContentWrapper>
      <ContentWrapper
        style={{
          marginBottom: "1rem",
        }}
      >
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
              slidesPerView: 3,
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
          {[...Array(8)].map((x, i) => (
            <SwiperSlide>
              <Skeleton
                width={
                  width <= 600 ? (width <= 400 ? "100px" : "120px") : "160px"
                }
                height={
                  width <= 600 ? (width <= 400 ? "160px" : "180px") : "235px"
                }
                borderRadius={"0.5rem"}
                baseColor={"#262539"}
                highlightColor={"#34324D"}
              />
              <Skeleton
                width={width <= 600 ? "120px" : "160px"}
                baseColor={"#262539"}
                highlightColor={"#34324D"}
                count={2}
                style={{
                  marginTop: "1rem",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </ContentWrapper>
    </Content>
  );
}

const ContentWrapper = styled.div`
  padding: 0 3rem 0 3rem;
  @media screen and (max-width: 600px) {
    padding: 1rem;
  }
`;

const Content = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  position: relative;
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

export default AnimeDetailsSkeleton;

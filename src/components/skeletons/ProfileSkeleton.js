import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function ProfileSkeleton() {
  const { height, width } = useWindowDimensions();

  return (
    <div
      style={{
        marginBottom: "2rem",
      }}
    >
      <Skeleton
        height={"35px"}
        width={"35px"}
        baseColor={"#262539"}
        highlightColor={"#34324D"}
        borderRadius={'60%'}
      />
    </div>
  );
}

export default ProfileSkeleton;

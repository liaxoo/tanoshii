import { Menu } from "@mantine/core";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiLogOut, FiSettings, FiInfo } from "react-icons/fi";

import ProfileSkeleton from "../skeletons/ProfileSkeleton";

function NavAvatar() {
  const [loading, setLoading] = useState(true);

  function Avatar() {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const userId = localStorage.getItem("anilistClientId"); // replace with the user ID

    useEffect(() => {
      async function fetchAvatar() {
        const response = await fetch(`https://graphql.anilist.co`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: `
            query ($userId: Int) {
              User(id: $userId) {
                avatar {
                  medium
                }
              }
            }
          `,
            variables: { userId },
          }),
        });

        setLoading(false);
        const { data } = await response.json();
        setAvatarUrl(data.User.avatar.medium);
      }

      fetchAvatar();
    }, [userId]);

    return loading ? <ProfileSkeleton /> : <img src={avatarUrl} />;
  }
  function logOut() {
    localStorage.setItem("anilistAccessToken", "");
    localStorage.setItem("anilistclientId", "");
    window.location.reload();
  }
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Right>
          <Avatar />
        </Right>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<FiSettings size={14} style={{ marginBottom: 0 }} />}>
          Settings
        </Menu.Item>
        <Menu.Item icon={<FiInfo size={14} style={{ marginBottom: 0 }} />}>
          About
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item
          onClick={logOut}
          color="red"
          icon={<FiLogOut size={14} style={{ marginBottom: 0 }} />}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

const Shadow = styled.div`
  z-index: 9;
  position: absolute;
  top: 0;
  height: 100vh;
  width: 98.6vw;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
`;

const Right = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: end;

  cursor: pointer;

  img {
    border-radius: 60%;
    /* Remove width and height properties */
    height: 35px;
  }
`;

export default NavAvatar;

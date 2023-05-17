import { Menu } from "@mantine/core";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiLogOut, FiSettings, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";

import ProfileSkeleton from "../skeletons/ProfileSkeleton";
import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiCoffee, FiUserPlus } from "react-icons/fi";
import { IconContext } from "react-icons";
import useWindowDimensions from "../../hooks/useWindowDimensions";

import { Error, Success } from "../../components/NotificationManager";

function NavAvatar() {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);

  function Avatar() {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const userId = localStorage.getItem("anilistClientId"); // replace with the user ID

    useEffect(() => {
      async function fetchAvatar() {
        if (!localStorage.getItem("clientAvatar")) {
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
                    large
                  }
                }
              }
            `,
              variables: { userId },
            }),
          }).catch((error) => {
            Error({ text: error });
          });

          const { data } = await response.json();
          localStorage.setItem("clientAvatar", data.User.avatar.large);
          setAvatarUrl(data.User.avatar.large);
        } else {
          setAvatarUrl(localStorage.getItem("clientAvatar"));
        }
        setLoading(false);
      }

      fetchAvatar();
    }, [userId]);

    return loading ? <ProfileSkeleton /> : <img src={avatarUrl} />;
  }
  function logOut() {
    localStorage.setItem("anilistAccessToken", "");
    localStorage.setItem("anilistClientId", "");
    localStorage.setItem("clientAvatar", "");
    window.location.reload();
  }

  function toasts() {
    toast.error(
      `We are currently having issues with this feature. Please try again later.`,
      {
        position: "top-center",
      }
    );
  }
  return (
    <Menu shadow="md" width={200}>
      {!localStorage.getItem("anilistClientId") && (
        <Link to={`/login`} style={{ textDecoration: "none" }}>
          <FiUserPlus style={{ color: "white", marginLeft: 10 }} />{" "}
        </Link>
      )}
      <Menu.Target>
        <Right>
          {width <= 600 && (
            <IconContext.Provider
              value={{
                size: "1.5rem",
                style: {
                  verticalAlign: "middle",
                  marginBottom: "0.2rem",
                  marginRight: "0.3rem",
                },
              }}
            >
              <div>
                {localStorage.getItem("anilistClientId") ? (
                  <FiUser style={{ color: "white", marginLeft: 10 }} />
                ) : (
                  <div></div>
                )}
              </div>
            </IconContext.Provider>
          )}
          {width >= 601 && <Avatar />}
        </Right>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={toasts}
          icon={<FiSettings size={14} style={{ marginBottom: 0 }} />}
        >
          Settings
        </Menu.Item>
        <Link to="/about/" style={{ margin: 0, textDecoration: "none" }}>
          <Menu.Item icon={<FiInfo size={14} style={{ marginBottom: 0 }} />}>
            About
          </Menu.Item>
        </Link>
        <Menu.Divider />

        <a
          href="https://ko-fi.com/tanoshii"
          style={{ margin: 0, textDecoration: "none" }}
        >
          <Menu.Item icon={<FiCoffee size={14} style={{ marginBottom: 0 }} />}>
            Donate
          </Menu.Item>
        </a>
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
  border-radius: 60%;
  /* Remove width and height properties */
  height: 35px;
`;

export default NavAvatar;

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { BiArrowToBottom, BiFullscreen } from "react-icons/bi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { BsSkipEnd, BsFillBadgeCcFill } from "react-icons/bs";
import {
  MdPlayDisabled,
  MdPlayArrow,
  MdSync,
  MdSyncDisabled,
  MdDownload,
} from "react-icons/md";
import { IconContext } from "react-icons";
import styled from "styled-components";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useNavigate, useParams } from "react-router-dom";
import Hls from "hls.js";
import plyr from "plyr";
import "plyr/dist/plyr.css";
import toast from "react-hot-toast";
import axios from "axios";

const VideoPlayer = ({ sources, type, title, subtitlesArray, totalEpisodes,
  currentEpisode, internalPlayer,
  setInternalPlayer, }) => {
  const videoRef = useRef();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const slug = useParams().slug;
  const episodeLink = useParams().episode;
  const episode = useParams().episode;
  const id = useParams().id;
  const number = useParams().number;
  const [selectedQuality, setSelectedQuality] = useState('auto');
  let src = sources;
  const [player, setPlayer] = useState(null);
  const [autoPlay, setAutoplay] = useState(false);
  const [sync, setSync] = useState(
    localStorage.getItem("sync")
      ? JSON.parse(localStorage.getItem("sync"))
      : false
  );
  const isDub = localStorage.getItem("dub") === "true";
  const opacityValue = isDub ? '25%' : '100%';
  // Language code mapping
  const languageCodes = useMemo(() => {
    return subtitlesArray.reduce((acc, subtitle) => {
      const languageCode = subtitle.lang.slice(0, 2).toLowerCase();
      acc[subtitle.lang] = languageCode;
      return acc;
    }, {});
  }, [subtitlesArray]);

  function updateAutoplay(data) {
    toast.success(`Autoplay ${data ? "Enabled" : "Disabled"}`, {
      position: "top-center",
    });
    localStorage.setItem("autoplay", data);
    setAutoplay(data);
  }

  function syncWithAniList(data) {
    toast.success(`Syncing with AniList ${data ? "Enabled" : "Disabled"}`, {
      position: "top-center",
    });
    localStorage.setItem("sync", data);
    setSync(data);
  }
  async function dubSwitch() {
    if (isDub) {
      toast.success("Finding sub episode...");
      let modifiedSlug = episodeLink.slice(0, -3) + "sub";

      try {
        await axios.get(
          `https://tanoshii-backend.vercel.app/anime/zoro/watch?episodeId=${modifiedSlug}`
        );
        localStorage.setItem("dub", false);
        toast.success("Sub found!");
        window.location.href = `/play/${modifiedSlug}/${id}/${number}`;
      } catch (err) {
        toast.error("Sub not available.");
      }
    }
    else {
      toast.success("Finding dub episode...");
      let modifiedSlug = episodeLink.slice(0, -3) + "dub";

      try {
        await axios.get(
          `https://tanoshii-backend.vercel.app/anime/zoro/watch?episodeId=${modifiedSlug}`
        );
        localStorage.setItem("dub", true);
        toast.success("Dub found!");
        window.location.href = `/play/${modifiedSlug}/${id}/${number}`;
      } catch (err) {
        toast.error("Dub not available.");
      }
    }

  }
  function skipIntro() {
    player.forward(85);
  }

  useEffect(() => {
    let flag = true;
    const defaultOptions = {
      captions: { active: true, language: 'English', update: false },
      settings: ['captions', 'quality'],
      controls:
        width > 600
          ? [
            "play-large",
            "rewind",
            "play",
            "fast-forward",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ]
          : [
            "play-large",
            "rewind",
            "play",
            "fast-forward",
            "progress",
            "current-time",
            "duration",
            "settings",
            "fullscreen",
          ],
    };
    if (!localStorage.getItem("autoplay")) {
      localStorage.setItem("autoplay", false);
    } else {
      setAutoplay(localStorage.getItem("autoplay") === "true");
    }
    const player = new plyr(videoRef.current, defaultOptions);

    // Check if the browser natively supports HLS playback
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(sources);
      hls.attachMedia(videoRef.current);

      var button = document.createElement("button");
      button.classList.add("skip-button");
      button.innerHTML = "Skip Intro";
      button.addEventListener("click", function () {
        player.forward(85);
      });

      player.on("enterfullscreen", (event) => {
        player.appendChild(button);
        window.screen.orientation.lock("landscape");
      });

      player.on("exitfullscreen", (event) => {
        document.querySelector(".skip-button").remove();
        window.screen.orientation.lock("portrait");
      });

      player.on("timeupdate", function (e) {
        var time = player.currentTime,
          lastTime = localStorage.getItem(title);
        if (time > lastTime) {
          localStorage.setItem(title, Math.round(player.currentTime));
        }
      });

      player.on("ended", function () {
        localStorage.removeItem(title);

        if (
          localStorage.getItem("autoplay") === "true" &&
          parseInt(currentEpisode) !== parseInt(totalEpisodes)
        ) {
          navigate(`/play/${slug}/${parseInt(episode) + 1}`);
        }
      });

      player.on("play", function (e) {
        if (flag) {
          var lastTime = localStorage.getItem(title);
          if (lastTime !== null && lastTime > player.currentTime) {
            player.forward(parseInt(lastTime));
          }
          flag = false;
        }
      });

      player.on("seeking", (event) => {
        localStorage.setItem(title, Math.round(player.currentTime));
      });

    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Fallback for browsers that don't support HLS.js
      videoRef.current.src = sources;
    }



    // Add subtitles tracks
    if (subtitlesArray && subtitlesArray.length > 0) {
      subtitlesArray.forEach((subtitles, index) => {
        if (subtitles.url && subtitles.lang) {
          const track = document.createElement('track');
          track.kind = 'captions';
          track.label = subtitles.lang;
          track.srclang = languageCodes[subtitles.lang] || 'en'; // Use the language code from the mapping or fallback to 'en'
          track.src = subtitles.url;
          track.default = index === 0; // Set the first track as default
          videoRef.current.appendChild(track);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      player.destroy();
    };
  }, [sources, subtitlesArray]);
  // Custom debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Debounce the window resize event
  useEffect(() => {
    const handleResize = debounce(() => {
      // You can do some additional logic here if needed
    }, 250);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        marginBottom: "1rem",
        "--plyr-color-main": "#7676FF",
      }}
    >
      <Conttainer>
        <IconContext.Provider
          value={{
            size: "1.5rem",
            color: "white",
            style: {
              verticalAlign: "middle",
            },
          }}
        >
          {internalPlayer && <p>Internal Player</p>}
          <div>
            {autoPlay && (
              <div className="tooltip">
                <button
                  title="Disable Autoplay"
                  onClick={() => updateAutoplay(false)}
                >
                  <MdPlayArrow />
                </button>
              </div>
            )}
            {!autoPlay && (
              <div className="tooltip">
                <button
                  title="Enable Autoplay"
                  onClick={() => updateAutoplay(true)}
                >
                  <MdPlayDisabled />
                </button>
              </div>
            )}
            {sync && (
              <div className="tooltip">
                <button
                  title="Disable sync to AniList"
                  onClick={() => syncWithAniList(false)}
                >
                  <MdSync />
                </button>
              </div>
            )}
            {!sync && (
              <div className="tooltip">
                <button
                  title="Enable sync to AniList"
                  onClick={() => syncWithAniList(true)}
                >
                  <MdSyncDisabled />
                </button>
              </div>
            )}
            <div className="tooltip">
              <button
                title="Change Server"
                onClick={() => {
                  toast.success("Swtitched to External Player", {
                    position: "top-center",
                  });
                  setInternalPlayer(!internalPlayer);
                }}
              >
                <HiOutlineSwitchHorizontal />
              </button>
            </div>
            <div className="tooltip">
              <button title="Toggle Dub" onClick={() => dubSwitch()}>
                <BsFillBadgeCcFill style={{ opacity: opacityValue }} />
              </button>
            </div>
          </div>
        </IconContext.Provider>
      </Conttainer>
      <video ref={videoRef} controls crossOrigin="anonymous">
        <source src={sources} type={`application/x-mpegURL`} />
      </video>
    </div>

  );
};

const Conttainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #242235;

  border-radius: 0.5rem 0.5rem 0.05rem 0rem;
  border: 1px solid #393653;
  margin-top: 1rem;
  border-bottom: none;
  font-weight: 400;
  p {
    color: white;
  }
  padding: 0.5rem 1rem 0.5rem 0;
  button,
  a {
    outline: none;
    border: none;
    background: transparent;
    margin-left: 1rem;
    cursor: pointer;
  }

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 5px;
    position: absolute;
    z-index: 1;
    bottom: 150%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
`;

export default VideoPlayer;

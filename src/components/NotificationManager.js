import { MantineProvider } from "@mantine/core";
import { FiAlertCircle } from "react-icons/fi";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";
import { Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import styled from "styled-components";

import { COLORS } from "../styles/colors";

function SignIn() {
  notifications.show({
    title: "Error",
    message: "Please sign in to use this feature.",
    autoClose: 2500,
    color: "red",
    icon: <FiAlertCircle />,
    styles: theme => ({
      root: {
        backgroundColor: COLORS.colorPopup
      },

      title: { color: "white" },
      description: { color: COLORS.textColorSecondary },
      closeButton: {
        color: "white",
        "&:hover": { backgroundColor: COLORS.colorPopupSecondary }
      }
    })
  });
}

function Success({ text }) {
  notifications.show({
    title: "Success",
    message: text,
    autoClose: 2500,
    color: "green",
    icon: <FiCheck />,
    styles: theme => ({
      root: {
        backgroundColor: COLORS.colorPopup
      },

      title: { color: "white" },
      description: { color: COLORS.textColorSecondary },
      closeButton: {
        color: "white",
        "&:hover": { backgroundColor: COLORS.colorPopupSecondary }
      }
    })
  });
}
function Error({ text }) {
  notifications.show({
    title: "Error",
    message: text,
    autoClose: 7500,
    color: "red",
    icon: <FiX />,
    styles: theme => ({
      root: {
        backgroundColor: COLORS.colorPopup
      },

      title: { color: "white" },
      description: { color: COLORS.textColorSecondary },
      closeButton: {
        color: "white",
        "&:hover": { backgroundColor: COLORS.colorPopupSecondary }
      }
    })
  });
}
  });
}

export default SignIn;
export { SignIn, Success, Error };

import { MantineProvider } from "@mantine/core";
import { FiAlertCircle } from "react-icons/fi";
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
    styles: (theme) => ({
      root: {
        backgroundColor: COLORS.colorPopup,
      },

      title: { color: "white" },
      description: { color: COLORS.textColorSecondary },
      closeButton: {
        color: "white",
        "&:hover": { backgroundColor: COLORS.colorPopupSecondary },
      },
    }),
  });
}

export default SignIn;

import { MantineProvider } from "@mantine/core";
import { FiAlertCircle } from "react-icons/fi";
import { Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

function SignIn() {
  notifications.show({
    title: "Error",
    autoClose: 5000,
    color: "red",
    message: "You need to sign in to use this feature. 🤥",
    icon: <FiAlertCircle />,
  });
}

export default SignIn;

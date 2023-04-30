import { MantineProvider } from "@mantine/core";

import { Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

function Demo() {
  return (
    <Group position="center">
      <Button
        variant="outline"
        onClick={() =>
          notifications.show({
            title: "Default notification",
            message: "Hey there, your code is awesome! 🤥",
          })
        }
      >
        Show notification
      </Button>
    </Group>
  );
}

export default { Demo };

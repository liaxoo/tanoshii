import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <MantineProvider
    theme={{
      colors: {
        "ocean-blue": ["#FFFFF"],
        "bright-pink": [
          "#F0BBDD",
          "#ED9BCF",
          "#EC7CC3",
          "#ED5DB8",
          "#F13EAF",
          "#F71FA7",
          "#FF00A1",
          "#E00890",
          "#C50E82",
          "#AD1374",
        ],
      },
    }}
  >
    <Notifications />
    <App />
  </MantineProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

import React from "react";
import ReactDOM from "react-dom";
import Router from "./route/route";
import reportWebVitals from "./reportWebVitals";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <React.StrictMode>
      <Router />,
    </React.StrictMode>
  </ConfigProvider>,
  document.getElementById("root")
);

reportWebVitals();

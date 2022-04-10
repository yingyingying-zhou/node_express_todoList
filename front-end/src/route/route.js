import React from "react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import List from "../page/List";

// 配置路由x
const router = () => (
  <BrowserRouter>
    {/* <Menus /> */}
    <Routes>
      {/* <Route element={<Home />} path="/home"></Route> */}
      <Route element={<List />} path="/list"></Route>
      {/* <Route element={<Layout />} path="/children">
        <Route element={<Child1 />} path="/children/child1"></Route>
        <Route element={<Child2 />} path="/children/child2"></Route>
      </Route> */}
    </Routes>
  </BrowserRouter>
);

export default router;

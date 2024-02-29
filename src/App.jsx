import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { HomePage, CreatePage } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/create" exact element={<CreatePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

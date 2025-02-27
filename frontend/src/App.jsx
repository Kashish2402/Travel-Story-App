import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Auth";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Home />}></Route>
          <Route path="/login" element={<Login auth="login" />}></Route>
          <Route path="/signup" element={<Login auth="signup" />}></Route>
        </Routes>
      </Router>
      <Toaster reverseOrder={false} />
    </>
  );
}

export default App;

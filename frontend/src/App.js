import React from 'react'; // Import React
import './App.css';
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import Login from "./components/Login"; // Import Login component
import Signup from "./components/Signup"; // Import Signup component
import Welcome from "./components/Welcome";

function App() {
  return (
    <React.Fragment>
    <header>
      <Header/>
    </header>
    <main>
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="user" element={<Welcome />} />
    </Routes>
    </main>
    </React.Fragment>
  );
}

export default App;

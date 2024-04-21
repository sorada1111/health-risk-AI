import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import Navbar from "../components/Navbar";
import PatientHome from "./PatientHome";
import NurseHome from "./NurseHome";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { user_id, role } = useContext(AuthContext);
  console.log(user_id, role);
  useEffect(() => {
    if (!user_id) {
      navigate("/login");
    }
  });
  return (
    <>
      <Navbar />
      {role === "Patient" ? <PatientHome /> : <NurseHome />}
    </>
  );
};

export default Home;

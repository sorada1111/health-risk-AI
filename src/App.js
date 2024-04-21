import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PatientDetails from "./pages/PatientDetails";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" exact element={<Register />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/" exact element={<Home />} />
          {/* <Route path="/games" exact element={<Games />} /> */}
          <Route path="patient/:patientId" exact element={<PatientDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

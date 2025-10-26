import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Assignments from "./pages/assignments/Assignments";
import Lectures from "./pages/lectures/Lectures";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RootLayout from "./Layout/RootLayout";
import Settings from "./pages/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* الصفحات الداخلية تحت RootLayout */}
        <Route element={<RootLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
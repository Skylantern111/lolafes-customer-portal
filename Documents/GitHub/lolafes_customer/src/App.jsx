import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PlaceOrder from "./pages/PlaceOrder";
import TrackOrder from "./pages/TrackOrder";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-4"> {/* Added padding so content isn't hidden under Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/track" element={<TrackOrder />} />
          {/* Fallback for broken links */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
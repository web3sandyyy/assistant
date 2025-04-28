import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Message from "./pages/Message";
import JobApplier from "./pages/jobApplier";
import Settings from "./pages/Settings";
import "./App.css";

function App() {
  return (
    <div className="h-screen w-full p-2">
      <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Message />} />
          <Route path="/job-applier" element={<JobApplier />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMap from "./components/Map.jsx";

import './App.css'
import Meetings from "./components/Meetings.jsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainMap />} />
                <Route path="/meeting" element={<Meetings/>} />
            </Routes>
        </Router>


    )
}

export default App
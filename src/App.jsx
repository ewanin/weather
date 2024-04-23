import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CityTable from './CityTable';
import WeatherDetailsPage from './WeatherDetailsPage';
import MapResult from './MapResult';

function App() {
  return (
    <div id='app' className='p-[2vw]'>
          <MapResult />
      <Router>
        <Routes>
          <Route path="/" element={<CityTable />} />
          <Route path="/coordinates/:city/:longitude/:latitude" element={<WeatherDetailsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

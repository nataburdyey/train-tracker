import { useState, useEffect } from 'react';

import { getLineColor, getDirection } from './utils';
import './App.css';

function App() {
  const [trainData, setTrainData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainPositions = async () => {
    const url =
      'https://api.wmata.com/TrainPositions/TrainPositions?contentType=json';
    const headers = {
      api_key: process.env.REACT_APP_PRIMARY_KEY,
    };

    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      setTrainData(data.TrainPositions);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTrainPositions();
  }, []);

  return (
    <main>
      {loading && <p>Loading...</p>}
      <h1>WMATA Train Positions</h1>
      {trainData && (
        <table>
          <thead>
            <tr>
              <th>Train Number</th>
              <th>Car Count</th>
              <th>Direction</th>
              <th>Circuit ID</th>
              <th>Destination Station Code</th>
              <th>Line Code</th>
              <th>Seconds at Location</th>
              <th>Service Type</th>
            </tr>
          </thead>
          <tbody>
            {trainData.map((train) => (
              <tr
                key={train.TrainId}
                style={{ backgroundColor: getLineColor(train.LineCode) }}
              >
                <td>{train.TrainNumber}</td>
                <td>{train.CarCount}</td>
                <td>{getDirection(train.DirectionNum)}</td>
                <td>{train.CircuitId}</td>
                <td>{train.DestinationStationCode}</td>
                <td>{train.LineCode}</td>
                <td>{train.SecondsAtLocation}</td>
                <td>{train.ServiceType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default App;

import { useState, useEffect } from 'react';

import { getLineColor, getAliases } from './utils/helpers';
import {
  SyncIcon,
  TrainCarPassenger,
  TrainCarContainer,
  TrainCarCenterbeam,
} from './components/icons';
import { useFilter } from './useFilter';

const CACHE_TIME = 1000 * 60 * 2; // 2 minutes
const AUTO_REFRESH_TIME = 1000 * 60 * 2; // 2 minutes

const App = () => {
  const [trainData, setTrainData] = useState({});
  const [loading, setLoading] = useState(true);
  const [colorFilter, ColorSelect] = useFilter(
    'LineCode',
    'Line Color',
    trainData.data
  );
  const [serviceTypeFilter, ServiceTypeSelect] = useFilter(
    'ServiceType',
    'Service Type',
    trainData.data
  );
  const [carCountFilter, CarCountSelect] = useFilter(
    'CarCount',
    'Car Count',
    trainData.data
  );

  const fetchTrainPositions = async (force = false) => {
    // check if data stored in the local storage
    const dataStr = localStorage.getItem('trainData');
    const data = dataStr && JSON.parse(dataStr);

    // check if data not expired
    if (!force && data && data.expires > Date.now()) {
      setTrainData(data);
      setLoading(false);
      return;
    } else {
      const url =
        'https://api.wmata.com/TrainPositions/TrainPositions?contentType=json';
      const headers = {
        api_key: process.env.REACT_APP_PRIMARY_KEY,
      };

      try {
        const response = await fetch(url, { headers });
        const json = await response.json();
        const data = {
          data: json.TrainPositions,
          expires: Date.now() + CACHE_TIME, // 10 minutes to avoid rate limiting issues
        };
        setTrainData(data);
        setLoading(false);
        localStorage.setItem('trainData', JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchTrainPositions();
    const interval = setInterval(() => {
      fetchTrainPositions();
    }, AUTO_REFRESH_TIME);
    return () => clearInterval(interval);
  }, []);

  const filterBy = (key, value, data) =>
    data.filter((train) => train[key] == value || value === 'all');

  let filtered = [];
  if (trainData.data) {
    filtered = filterBy('LineCode', colorFilter, trainData.data);
    filtered = filterBy('ServiceType', serviceTypeFilter, filtered);
    filtered = filterBy('CarCount', carCountFilter, filtered);
  }

  const renderTrainCars = (train) => {
    const cars = [];
    for (let i = 1; i <= train.CarCount; i++) {
      switch (train.ServiceType) {
        case 'Normal':
          cars.push(
            <TrainCarPassenger key={i} title={i} aria-label='Passenger car' />
          );
          break;
        case 'NoPassengers':
          cars.push(
            <TrainCarContainer
              key={i}
              title={i}
              aria-label='No passengers car'
            />
          );
          break;
        default:
          cars.push(
            <TrainCarCenterbeam key={i} title={i} aria-label='Unknown car' />
          );
      }
    }
    return cars;
  };

  if (loading) {
    return <div className='loading'></div>;
  }

  return (
    <main role='main'>
      <header>
        <h1 aria-label='WMATA Train Positions'>WMATA Train Positions</h1>
        <button
        className='btn-refresh'
          aria-label='Refresh Train Positions'
          onClick={() => fetchTrainPositions(true)}
        >
          <SyncIcon width='1.5em' height='1.5em' />
        </button>
        <span className='last-updated'>
          Last updated{' '}
          {new Date(trainData.expires - CACHE_TIME).toLocaleTimeString()}
        </span>
      </header>
      <div className='container'>
        {' '}
        <nav className='filters'>
          <form>
            <ColorSelect aria-label='Line Color' />
            <ServiceTypeSelect aria-label='Service Type' />
            <CarCountSelect aria-label='Car Count' />
            <button type='reset' className='btn-clear'>
              Clear Filters
            </button>
          </form>
        </nav>
        <section className='trainInfo'>
          {!loading && (
            <table>
              <thead>
                <tr>
                  <th>Train Number</th>
                  <th>Direction</th>
                  <th>Circuit ID</th>
                  <th>Destination</th>
                  <th>Line Color</th>
                  <th>Seconds at Location</th>
                  <th>Service Type</th>
                  <th>Car Count</th>
                  <th>Cars</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((train) => (
                  <tr
                    key={train.TrainId}
                    style={{ backgroundColor: getLineColor(train.LineCode) }}
                  >
                    <td>{train.TrainNumber}</td>
                    <td>{getAliases('DirectionNum', train.DirectionNum)}</td>
                    <td>{train.CircuitId}</td>
                    <td>{train.DestinationStationCode}</td>
                    <td>{getAliases('LineCode', train.LineCode)}</td>
                    <td>{train.SecondsAtLocation}</td>
                    <td>{getAliases('ServiceType', train.ServiceType)}</td>
                    <td>{train.CarCount}</td>
                    <td>{renderTrainCars(train)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

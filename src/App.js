import { Table } from './components/Table';
import { ThemeToggle } from './components/ThemeToggle';
import { useState, useEffect } from 'react';

import { useFilter } from './useFilter';
import { getInitialDarkMode } from './utils/helpers';
import { SyncIcon } from './components/icons';

const CACHE_TIME = 1000 * 60 * 2; // 2 minutes
const AUTO_REFRESH_TIME = 1000 * 60 * 2; // 2 minutes

console.log('initial', getInitialDarkMode());

const App = () => {
  const [trainData, setTrainData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(getInitialDarkMode());
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
  const [destinationFilter, DestinationSelect] = useFilter(
    'DestinationStationCode',
    'Destination',
    trainData.data
  );
  const [directionFilter, DirectionSelect] = useFilter(
    'DirectionNum',
    'Direction',
    trainData.data
  );

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    console.log('new', newDarkTheme);
    setIsDarkTheme(newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };

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
    document.body.classList.toggle('dark-theme', isDarkTheme);
    console.log(document.body.classList);
    console.log('useEffect', isDarkTheme);
    fetchTrainPositions();
    const interval = setInterval(() => {
      fetchTrainPositions();
    }, AUTO_REFRESH_TIME);
    return () => clearInterval(interval);
  }, [isDarkTheme]);

  const filterBy = (key, value, data) =>
    data.filter(
      (train) => (train[key] || '(blank)') == value || value === 'all'
    );

  let filtered = [];
  if (trainData.data) {
    filtered = filterBy('LineCode', colorFilter, trainData.data);
    filtered = filterBy('ServiceType', serviceTypeFilter, filtered);
    filtered = filterBy('CarCount', carCountFilter, filtered);
    filtered = filterBy('DestinationStationCode', destinationFilter, filtered);
    filtered = filterBy('DirectionNum', directionFilter, filtered);
  }

  if (loading) {
    return <div className='loading'></div>;
  }

  return (
    <main role='main'>
      <header>
        <ThemeToggle
          isDarkTheme={isDarkTheme}
          toggleDarkTheme={toggleDarkTheme}
        />
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
        <nav className='filters'>
          <form>
            <ColorSelect aria-label='Line Color' />
            <ServiceTypeSelect aria-label='Service Type' />
            <CarCountSelect aria-label='Car Count' />
            <DestinationSelect aria-label='Destination' />
            <DirectionSelect aria-label='Direction' />
            <button type='reset' className='btn-clear'>
              Clear Filters
            </button>
          </form>
        </nav>
        <section className='train-info'>
          {!loading && (
            <Table
              filtered={filtered}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

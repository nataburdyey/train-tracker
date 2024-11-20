import { useState, useEffect } from 'react';
import { TrainPositionsTable, ThemeToggle, FilterForm } from './components';
import { SyncIcon } from './components/icons';
import { useFilter } from './useFilter';
import { CACHE_TIME, AUTO_REFRESH_TIME } from './utils/constants';
import { getInitialDarkMode } from './utils/helpers';

const App = () => {
  const [trainData, setTrainData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(getInitialDarkMode());

  const initializeFilter = (key, label) =>
    useFilter(key, label, trainData.data);

  const [colorFilter, ColorSelect] = initializeFilter('LineCode', 'Line Color');
  const [serviceTypeFilter, ServiceTypeSelect] = initializeFilter(
    'ServiceType',
    'Service Type'
  );
  const [carCountFilter, CarCountSelect] = initializeFilter(
    'CarCount',
    'Car Count'
  );
  const [destinationFilter, DestinationSelect] = initializeFilter(
    'DestinationStationCode',
    'Destination'
  );
  const [directionFilter, DirectionSelect] = initializeFilter(
    'DirectionNum',
    'Direction'
  );

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    localStorage.setItem('darkTheme', JSON.stringify(newDarkTheme));
  };

  const fetchTrainPositions = async (force = false) => {
    const cachedData = localStorage.getItem('trainData');
    const parsedData = cachedData && JSON.parse(cachedData);

    if (!force && parsedData && parsedData.expires > Date.now()) {
      setTrainData(parsedData);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'https://api.wmata.com/TrainPositions/TrainPositions?contentType=json',
        { headers: { api_key: process.env.REACT_APP_PRIMARY_KEY } }
      );
      const json = await response.json();
      const newData = {
        data: json.TrainPositions,
        expires: Date.now() + CACHE_TIME,
      };
      setTrainData(newData);
      localStorage.setItem('trainData', JSON.stringify(newData));
    } catch (error) {
      console.error('Failed to fetch train positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    const filters = [
      { key: 'LineCode', value: colorFilter },
      { key: 'ServiceType', value: serviceTypeFilter },
      { key: 'CarCount', value: carCountFilter },
      { key: 'DestinationStationCode', value: destinationFilter },
      { key: 'DirectionNum', value: directionFilter },
    ];

    return filters.reduce(
      (filteredData, filter) =>
        filteredData.filter(
          (item) =>
            (item[filter.key] || '(blank)') === filter.value || filter.value === 'all'
        ),
      data
    );
  };

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkTheme);
  }, [isDarkTheme]);

  useEffect(() => {
    fetchTrainPositions();
    const refreshInterval = setInterval(fetchTrainPositions, AUTO_REFRESH_TIME);
    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return <div className="loading" data-testid="loading"></div>;
  }

  const filteredData = trainData.data ? applyFilters(trainData.data) : [];

  return (
    <main role="main">
      <header>
        <ThemeToggle
          isDarkTheme={isDarkTheme}
          toggleDarkTheme={toggleDarkTheme}
        />
        <h1 aria-label="WMATA Train Positions">WMATA Train Positions</h1>
        <button
          className="btn-refresh"
          aria-label="Refresh Train Positions"
          onClick={() => fetchTrainPositions(true)}
        >
          <SyncIcon width="1.5em" height="1.5em" />
        </button>
        <span className="last-updated">
          Last updated{' '}
          {new Date(trainData.expires - CACHE_TIME).toLocaleTimeString()}
        </span>
      </header>
      <div className="container">
        <nav className="filters">
          <FilterForm
            filters={[
              ColorSelect,
              ServiceTypeSelect,
              CarCountSelect,
              DestinationSelect,
              DirectionSelect,
            ]}
          />
        </nav>
        <section className="train-info">
          <TrainPositionsTable filtered={filteredData} />
        </section>
      </div>
    </main>
  );
};

export default App;

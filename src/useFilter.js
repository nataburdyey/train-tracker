import { useState, useEffect, useMemo, useRef } from 'react';
import { getUniqueValues } from './utils/helpers';
import SelectFilter from './components/SelectFilter';
import ColorFilter from './components/ColorFilter';

export const useFilter = (key, label, data) => {
  const [filter, setFilter] = useState('all');
  const filterOptions = useMemo(() => {
    return ['all', ...(data ? getUniqueValues(data, key) : [])];
  }, [key, data]);

  const FilterComponent = () => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.parentNode.addEventListener('reset', (e) => {
          setFilter('all');
        });
      }
    }, []);

    switch (key) {
      case 'LineCode':
        return (
          <ColorFilter
            innerRef={inputRef}
            name={key}
            label={label}
            value={filter}
            options={filterOptions}
            onChange={setFilter}
          />
        );
      default:
        return (
          <SelectFilter
            innerRef={inputRef}
            name={key}
            label={label}
            value={filter}
            options={filterOptions}
            onChange={setFilter}
          />
        );
    }
  };

  return [filter, FilterComponent];
};

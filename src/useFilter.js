import { useState, useEffect, useMemo } from 'react';
import { getUniqueValues } from './utils/helpers';
import SelectFilter from './components/SelectFilter';
import ColorFilter from './components/ColorFilter';

export const useFilter = (key, label, data) => {
  const [filter, setFilter] = useState('all');
  const filterOptions = useMemo(() => {
    return ['all', ...(data ? getUniqueValues(data, key) : [])];
  }, [key, data]);

  const FilterComponent = ({ formRef }) => {
    useEffect(() => {
      if (formRef.current) {
        formRef.current.addEventListener('reset', (e) => {
          setFilter('all');
        });
      }
    }, [formRef]);

    switch (key) {
      case 'LineCode':
        return (
          <ColorFilter
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

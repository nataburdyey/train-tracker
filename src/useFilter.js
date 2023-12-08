import { useState, useEffect } from 'react';
import { getUniqueValues, getAliases } from './utils/helpers';

export const useFilter = (key, label, data) => {
  const [filter, setFilter] = useState('all');
  const uniqueValues = data ? getUniqueValues(data, key) : [];

  const Select = () => {
    return (
      <div className='filter'>
        <label className='filter-label' htmlFor={key}>
          {label}
        </label>
        <select
          name={key}
          id={key}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='form-control'
        >
          {uniqueValues.map((item, index) => {
            return (
              <option key={index} value={item}>
                {getAliases(key, item)}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  return [filter, Select];
};

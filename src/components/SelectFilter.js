import { getAliases } from '../utils/helpers';
const SelectFilter = ({ name, label, value, options, onChange }) => {
  return (
    <div className='filter'>
      <label className='filter-label' htmlFor={name}>
        {label}
      </label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='select-filter'
      >
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {getAliases(name, option)}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectFilter;

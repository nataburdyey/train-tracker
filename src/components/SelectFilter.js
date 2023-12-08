import { getAliases } from '../utils/helpers';
const SelectFilter = ({name, innerRef, label, value, options, onChange}) => {
    return (
      <div className='filter' ref={innerRef}>
        <label className='filter-label' htmlFor={name}>
          {label}
        </label>
        <select
          name={name}
          id={name}
          value={value}
          onChange={(e) => {console.log('onchange', e);onChange(e.target.value)}}
          className='form-control'
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
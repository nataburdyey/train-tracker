import { CheckIcon } from './icons';
import { getLineColor } from '../utils/helpers';

const ColorFilter = ({ name, label, value, options, onChange }) => {
  return (
    <div className='filter'>
      <label className='filter-label' htmlFor={name}>
        {label}
      </label>
      <div className='colors'>
        {options.map((color, index) => {
          if (color === 'all') return null;

          return (
            <button
              key={index}
              name='color'
              style={{ background: getLineColor(color) }}
              className={`${value === color ? 'color-btn active' : 'color-btn'}`}
              onClick={(e) => {onChange(e.target.value || 'all')}}
              value={color}
            >
              {value === color ? <CheckIcon /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorFilter;

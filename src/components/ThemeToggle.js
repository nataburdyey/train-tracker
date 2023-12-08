import {
  MoonWaxingCrescentIcon,
  WhiteBalanceSunnyIcon,
} from '../components/icons';

const ThemeToggle = ({ isDarkTheme, toggleDarkTheme }) => {
  return (
    <section className='toggle-container'>
      <button className='dark-toggle'>
        {isDarkTheme ? (
          <button className='toggle-icon' onClick={toggleDarkTheme}>
            <WhiteBalanceSunnyIcon />
          </button>
        ) : (
          <button className='toggle-icon' onClick={toggleDarkTheme}>
            <MoonWaxingCrescentIcon />
          </button>
        )}
      </button>
    </section>
  );
};

export default ThemeToggle;

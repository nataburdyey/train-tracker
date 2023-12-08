import {
  MoonWaxingCrescentIcon,
  WhiteBalanceSunnyIcon,
} from '../components/icons';

const ThemeToggle = ({ isDarkTheme, toggleDarkTheme }) => {
  return (
    <section className='toggle-container'>
      <div className='dark-toggle'>
        {isDarkTheme ? (
          <button className='toggle-icon' data-testid='toggle-icon' onClick={toggleDarkTheme}>
            <WhiteBalanceSunnyIcon />
          </button>
        ) : (
          <button className='toggle-icon' data-testid='toggle-icon' onClick={toggleDarkTheme}>
            <MoonWaxingCrescentIcon />
          </button>
        )}
      </div>
    </section>
  );
};

export default ThemeToggle;

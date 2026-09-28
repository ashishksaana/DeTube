import { useState, useEffect } from 'react'
import './Navbar.css'
// import menu_icon from '../../assets/menu.png'
import logoLight from '../../assets/DeTubeAA.png'
import logoDark from '../../assets/DeTubeDark.png'
import search_icon from '../../assets/search.png'
import upload_icon from '../../assets/upload.png'
import more_icon from '../../assets/more.png'
import notification_icon from '../../assets/notification.png'
import profile_icon from '../../assets/jack.png'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ setSidebar }) => {

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'system');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        setIsDarkMode(true);
      } else if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        setIsDarkMode(false);
      } else {
        if (mediaQuery.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
          setIsDarkMode(true);
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          setIsDarkMode(false);
        }
      }
    };

    updateTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', updateTheme);
    }
    
    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, [theme]);

  const handleSearch = (e) => {
    e.preventDefault();
    if(input) {
      navigate(`/search/${input}`);
    }
  }

  return (
    <nav className='flex-div'>
        <div className='nav-left flex-div'>
            {/* <img className = 'menu-icon' onClick={() => setSidebar(prev => !prev)} src={menu_icon} alt="menu icon for app" /> */}
            <Link to="/">
              <img className = 'logo' src={isDarkMode ? logoDark : logoLight} alt="logo for app" />
            </Link>
        </div>

        <div className = "nav-middle flex-div">
            <form className='search-box flex-div' onSubmit={handleSearch}>
                <input type="text" placeholder='Search' value={input} onChange={(e) => setInput(e.target.value)} />
                <button type="submit" style={{background: 'transparent', border: 'none', cursor: 'pointer'}}>
                  <img className = 'search-button' src={search_icon} alt="Search Button" />
                </button>
            </form>
        </div>

        <div className="nav-right">
            <select className="theme-selector" value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="system">System</option>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
            </select>
        </div>
    </nav>
  )
}

export default Navbar

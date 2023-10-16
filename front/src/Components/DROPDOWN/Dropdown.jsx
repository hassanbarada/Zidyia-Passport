import React,{ useState } from 'react';
import './Dropdown.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaUniversity, FaBuilding  } from 'react-icons/fa';


const DropDown = ({ closeMenu,className }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
    
    const institutionLogin = () => {
      navigate('/Institutionlogin')
      toggleDropdown();
      if (typeof closeMenu === 'function') {
        closeMenu(); 
      }
    }

    const userLogin = () => {
      navigate('/login')
      toggleDropdown();
      if (typeof closeMenu === 'function') {
        closeMenu();
      }
    }

    const SubscriptionLogin =() => {
      navigate('/SubscriptionLogin')
      toggleDropdown();
      if (typeof closeMenu === 'function') {
        closeMenu(); 
      }
    }

   
  return (
    <>
      <label
        className={`popup ${isOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsOpen(true)} // Open on hover
        onMouseLeave={() => setIsOpen(false)} // Close on mouse leave
      >
        <input type="checkbox" checked={isOpen} onChange={toggleDropdown} />
        <div className={`burger ${className}`} tabIndex="0">
            Login
        </div>
        <nav className='popup-window'>
          <ul>
          
            <li>
              <button onClick={institutionLogin}>
              <FaUniversity />
                <span>As an Institution</span>
              </button>
            </li>
              <li>
              <button onClick={userLogin}>
              <FaUser />
                <span>As a  User</span>
              </button>
            </li>
            <li>
              <button onClick={SubscriptionLogin}>
              <FaBuilding  />
                <span>As an  Organization</span>
              </button>
            </li>
            
              
          </ul>
        </nav>
      </label>
    </>
  );
};

export default DropDown;

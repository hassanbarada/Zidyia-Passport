import React,{useState} from "react";
import './Navbar.css';
import { NavLink,useLocation,useNavigate, useRoutes  } from "react-router-dom";
import logo from '../../images/logo1.png';
import DropDown from "../DROPDOWN/Dropdown";

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    console.log(location.pathname);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    const rendered = localStorage.getItem("rendered");

    const isAdmin = token && role === 'admin';
    const isUser = token && role === 'user';
    const isSuperAdmin = token && role === 'superAdmin';

  const isInstitutionsRoute = location.pathname.startsWith('/institutions') || location.pathname.startsWith('/Institutionlogin') || location.pathname.startsWith('/CertificateUpload') || location.pathname === "/StudentViewSubs" || location.pathname.startsWith('/CertificateRequest') || location.pathname.startsWith('/login') || location.pathname.startsWith('/register')|| location.pathname.startsWith('/UserCertificate') || location.pathname.startsWith('/SubscriptionLogin') || location.pathname.startsWith('/contact') || location.pathname.startsWith('/UserCertificate') || location.pathname.startsWith('/MyProfile') || location.pathname.startsWith('/CompleteInformation') || location.pathname.startsWith('/VerificationPlatformShared') || location.pathname.startsWith('/CredentialUrl') || location.pathname.startsWith('/forgot-password') || location.pathname.startsWith('/reset_password') || location.pathname.startsWith('/Register')|| location.pathname.startsWith('/expiryLicense'); 
  const isInstitutionLogin = location.pathname.startsWith('/Institutionlogin') || location.pathname.startsWith('/CertificateUpload') || location.pathname.startsWith('/CertificateRequest') || location.pathname === "/StudentViewSubs" || location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/UserCertificate') || location.pathname.startsWith('/SubscriptionLogin') || location.pathname.startsWith('/contact') || location.pathname.startsWith('/UserCertificate') || location.pathname.startsWith('/MyProfile') || location.pathname.startsWith('/CompleteInformation') || location.pathname.startsWith('/VerificationPlatformShared') || location.pathname.startsWith('/CredentialUrl') || location.pathname.startsWith('/forgot-password') || location.pathname.startsWith('/reset_password') || location.pathname.startsWith('/Register')|| location.pathname.startsWith('/expiryLicense');
  const isUserProfileRoute = location.pathname === '/UserCertificate'; 

    return (
        <>
        {rendered ? (
          <div className={`box3 ${isInstitutionsRoute ? 'institution-route' : ''}`}>
        <div className="navbar1">
            <div className="navbar-logo">
                <img src={logo} alt="" />
                <h1 className={isInstitutionLogin ? 'white-link' : ''}>Zidyia <br />Passport</h1>
            </div>
            <div className="navbar-menu">
                <ul >
                    <li ><NavLink  className={isInstitutionsRoute ? 'white-link' : ''} to='/'>HOME</NavLink></li>
                    {isAdmin && <li><NavLink className={isInstitutionsRoute ? 'white-link' : ''} to='/admin'>Dashboard</NavLink></li>}
                    {isSuperAdmin && <li><NavLink className={isInstitutionsRoute ? 'white-link' : ''} to='/superadmin'>Dashboard</NavLink></li>}
                    {isUser && (
                <li>
                  
                  <NavLink className={isInstitutionsRoute ? 'white-link' : ''} to={isUserProfileRoute ? '/MyProfile' : '/UserCertificate'}>
                    {isUserProfileRoute ? 'My Profile' : 'Wallet'}
                  </NavLink>
                </li>
              )}                    
              <li><NavLink className={isInstitutionsRoute ? 'white-link' : ''} to='/contact'>CONTACT</NavLink></li>
               <li>
                <NavLink className={isInstitutionsRoute ? 'white-link' : ''} to={isUserProfileRoute ? '/StudentViewSubs' : '/institutions'}>
                  {isUserProfileRoute ? 'Share Certificate' : 'Institutions'}
                </NavLink>
              </li>
              <li className={isInstitutionsRoute ? 'white-link' : ''}>  <DropDown /></li>
                </ul>
            </div>
        </div>
        </div>
        ):(
<div className={`box3 ${isInstitutionsRoute ? 'institution-route' : ''}`}>
        <div className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="" />
                <h1 className={isInstitutionLogin ? 'white-link' : ''}>Zidyia <br />Passport</h1>
            </div>
            <div className="navbar-menu">
                <ul >
                    <li ><NavLink  className={isInstitutionsRoute ? 'white-link' : ''} to='/'>HOME</NavLink></li>
                    {isAdmin && <li><NavLink className={isInstitutionsRoute ? 'white-link' : ''} to='/admin'>Dashboard</NavLink></li>}
                    {isSuperAdmin && <li><NavLink className={isInstitutionsRoute ? 'white-link' : ''} to='/superadmin'>Dashboard</NavLink></li>}
                    {isUser && (
                <li>
                  
                  <NavLink className={isInstitutionsRoute ? 'white-link' : ''} to={isUserProfileRoute ? '/MyProfile' : '/UserCertificate'}>
                    {isUserProfileRoute ? 'My Profile' : 'Wallet'}
                  </NavLink>
                </li>
              )}                    
              <li><NavLink className={isInstitutionsRoute ? 'white-link' : ''} to='/contact'>CONTACT</NavLink></li>
               <li>
                <NavLink className={isInstitutionsRoute ? 'white-link' : ''} to={isUserProfileRoute ? '/StudentViewSubs' : '/institutions'}>
                  {isUserProfileRoute ? 'Share Certificate' : 'Institutions'}
                </NavLink>
              </li>
              <li className={isInstitutionsRoute ? 'white-link' : ''}>  <DropDown /></li>
                </ul>
            </div>
        </div>
        </div>
        )}
        





        <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
      <input
        id="menu__toggle"
        type="checkbox"
        checked={menuOpen}
        onChange={toggleMenu}
      />
      <label className="menu__btn" htmlFor="menu__toggle">
        <span></span>
      </label>

      <ul className="menu__box">
        <li>
          <NavLink to="/" className="menu__item" onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/Contact" className="menu__item" onClick={closeMenu}>
          Contact
          </NavLink>
        </li>
        <li>
                <NavLink  className="menu__item" onClick={closeMenu}  to={isUserProfileRoute ? '/StudentViewSubs' : '/institutions'}>
                  {isUserProfileRoute ? 'Share Certificate' : 'Institutions'}
                </NavLink>
          </li>
        {isAdmin && (
          <li>
          <NavLink to="/admin" className="menu__item" onClick={closeMenu}>
          Dashboard
          </NavLink>
        </li>
        )}
        {isSuperAdmin && (
          <li>
          <NavLink to="/superadmin" className="menu__item" onClick={closeMenu}>
          Dashboard
          </NavLink>
        </li>
        )}
         {isUser && (
                <li>
                  
                  <NavLink onClick={closeMenu} className="menu__item" to={isUserProfileRoute ? '/MyProfile' : '/UserCertificate'}>
                    {isUserProfileRoute ? 'My Profile' : 'Wallet'}
                  </NavLink>
                </li>
              )}
        <li>
          <DropDown className="menu__item" closeMenu={closeMenu}/>
          
        </li>
        
      </ul>
    </div>
        </>
    )
}
export default Navbar;
import React from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Home from "./Components/HOME/Home";
import Navbar from "./Components/NAVBAR/Navbar";
import About from "./Components/ABOUT/About";
import Institutionlogin from "./Components/InstitutionLogin/Institutionlogin";
import Register from "./Components/Authentication/Register";
import LogintoZidyia from "./Components/Authentication/Login";
import ForgotPassword from "./Components/Authentication/forgotpassword";
import Resetpassword from "./Components/Authentication/Resetpassword";
import EmailVerify from "./Components/Authentication/EmailVerify";
import EmailSent from "./Components/Authentication/EmailSent";
import AdminDashboard from "./Components/ADMIN/AdminDashboard";
import CertificateUpload from "./Components/CertificateUpload/CertificateUpload";
import CompleteInformation from "./Components/CompleteInformation/CompleteInformation";
import UserCertificate from "./Components/UserCertificate/UserCertificate";
import CertificateRequest from "./Components/CERTIFICATE REQUEST/CertificateRequest";
import StudentViewSubs from "./Components/StudentViewSubs/StudentViewSubs";
import AllInstitutions from "./Components/AllINSTITUTIONS/AllInstitutions";
import Institutions from "./Components/INSTITUTIONS/Institutions";
import Contactus from "./Components/Contactus/Contactus";
import SuperAdminDashboard from "./Components/SUPERADMIN/SuperAdminDashboard";
import VerificationPlatformShared from "./Components/verificationPlatformShared/VerificationPlatformShared";
import MyProfile from "./Components/MyProfile/MyProfile";
import SubscriptionLogin from "./Components/LOGINSUBSCRIPTION/SubscriptionLogin";
import CredentialUrl from './Components/credentialUrl/CredentialUrl';
import Expiry from "./Components/EXPIRYLICENSE/Expiry";
const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/EmailSent", "/users", "/admin", "/superadmin"];

  const isNavbarHidden = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
    return (
        <>
        {!isNavbarHidden && <Navbar />} 
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/Contact" element={<Contactus/>}></Route>
            <Route path="/Institutionlogin" element={<Institutionlogin/>}></Route>
            <Route path="/Register" element={<Register/>}></Route>
            <Route path="/login" element={<LogintoZidyia/>}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route path="/reset_password/:id/:token" element={<Resetpassword />}></Route>
            <Route path="/users/:id/verify/:token" element={<EmailVerify/>}></Route>
            <Route path="/EmailSent/:email" element={<EmailSent />}></Route>
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/institutions" element={<Institutions />}></Route>
            <Route path="/CertificateUpload" element={<CertificateUpload />} />
            <Route path="/CompleteInformation" element={<CompleteInformation />} />
            <Route path="/UserCertificate" element={<UserCertificate />} />
            <Route path="/CertificateUpload/:institutionID?" element={<CertificateUpload />} />
            <Route path="/CertificateRequest/:institutionID" element={<CertificateRequest />}></Route>
            <Route path="/StudentViewSubs" element={<StudentViewSubs />} />
            <Route path="/AllInstitutions" element={<AllInstitutions />}></Route>
            <Route path="/superadmin/*" element={<SuperAdminDashboard />}></Route>
            <Route path="/VerificationPlatformShared" element={<VerificationPlatformShared />}></Route>
            <Route path="/MyProfile" element={<MyProfile />}></Route>
            <Route path="/SubscriptionLogin" element={<SubscriptionLogin />}></Route>
            <Route path="/CredentialUrl/:sharedCertificateID" element={<CredentialUrl />}></Route>
            <Route path="/expiryLicense" element={<Expiry />}></Route>
          </Routes>
        </>
    )
}

export default App;

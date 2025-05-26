import Cookies from "js-cookie";
import { createContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Authcontext = createContext();

const AuthProvider = ({ children }) => {
  // existing states...
  const [activeTab, setActiveTab] = useState('login');

  const [registerData, setRegisterData] = useState({
    username: '',
    userid: '',
    email: '',
    password: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    userid: '',
    password: ''
  });

  const navigate = useNavigate();
  const location = useLocation() ;

  const accessToken = Cookies.get('accessToken');

  const logout = () => {
    Cookies.remove('accessToken');
    navigate('/');
  };

  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    email: '',
    userid: '',
    currentUserId: '',
    wallet: 0,
    purchaseVideo: []
  });

  const [videoType, setVideoType] = useState('');
  const [uploadata, setUploadData] = useState({
    title: '',
    description: '',
    shortFormUrl: '',
    longFormUrl: '',
    longFormPricing: ''
  });

  const [currentFeed, setCurrentFeed] = useState('all');
  const [feedData, setFeedData] = useState([]);

  // Add this function to update loginCredentials easily
  const updateLoginCredentials = (newData) => {
    setLoginCredentials(prev => ({
      ...prev,
      ...newData,
    }));
  };

  const value = {
    activeTab, setActiveTab,
    registerData, setRegisterData,
    loginData, setLoginData,
    navigate, location , accessToken, logout,
    loginCredentials, setLoginCredentials,
    updateLoginCredentials,  // expose update function
    videoType, setVideoType,
    uploadata, setUploadData,
    currentFeed, setCurrentFeed,
    feedData, setFeedData,
  };

  return (
    <Authcontext.Provider value={value}>
      {children}
    </Authcontext.Provider>
  );
};

export default AuthProvider;

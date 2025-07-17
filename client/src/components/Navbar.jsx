import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { useAuthUser } from '../hooks/useAuthUser';
import { useCustomMutation } from '../hooks/useCustomMutation';
import ToggleThemeButton from './ToggleThemeButton'
const Navbar = ({toggleSidebar}) => {
  const {authUser} = useAuthUser();

  const location = useLocation();
  const chatPage = location.pathname.startsWith('/chat');
  const navigate = useNavigate();

  const {mutate} = useCustomMutation({
    url: '/auth/logout',
    onSuccessRedirect: () => navigate('/login'),
    invalidateKey: "authUser"
  })

  return (
    <header className='header'>

      <div className='sidebar-toggle' onClick={toggleSidebar}> 
          <img src={assets.menuIcon} alt=""/>
      </div>

      { chatPage && (
        <div>
        <img src={assets.logo} alt="logo image" />
        </div>
      )  }



      <div className="utility-wrapper">
        <Link to="/notifications" >
          <img src={assets.notificationIcon} alt="notification icon" />
        </Link>

        <ToggleThemeButton />

        <img src={authUser.profilePic} alt="" className='profile-picture'  />

        <img src={assets.logoutIcon} alt="logout" onClick={() => mutate()} />
      </div>



    </header>
  )
}

export default Navbar
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

      { !chatPage && (<div className='sidebar-toggle' onClick={toggleSidebar}> 
          <img src={assets.menuIcon} alt="" className='header-util'/>
      </div>)}

      { chatPage && (
        <img src={assets.logo} alt="logo image" className='chat-page-logo' onClick={() => navigate("/")}/>
      )  }



      <div className="utility-wrapper">
        <Link to="/notifications" >
          <img src={assets.notificationIcon} alt="notification icon" className='header-util' />
        </Link>

        <ToggleThemeButton />

        <img src={authUser.profilePic} alt="" className='header-util  profile-picture'  />

        <img src={assets.logoutIcon} alt="logout" className='header-util'  onClick={() => mutate()} />
      </div>



    </header>
  )
}

export default Navbar
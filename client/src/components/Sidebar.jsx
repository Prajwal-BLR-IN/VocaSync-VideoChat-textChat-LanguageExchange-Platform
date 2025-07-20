import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useAuthUser } from '../hooks/useAuthUser'

const Sidebar = ({isOpen, closeSidebar}) => {
    const { authUser } = useAuthUser();
    const isOnline = navigator.onLine;

    return (
        <aside className={`sidebar-wrapper ${isOpen && "sidebar-active"}`}>
            <div className="sidebar-top">
                <img src={assets.logo} alt="logo" className='sidebar-logo' />
                <nav className="nav-link">
                    <NavLink to="/" className={({ isActive }) =>
                        `nav-link-anchors ${isActive ? 'active-button' : ''}`
                    } 
                    onClick={closeSidebar}
                    >
                        <img src={assets.homeIcon} alt="home icon" className='link-icons' />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/friends" className={({ isActive }) =>
                        `nav-link-anchors ${isActive ? 'active-button' : ''}`
                    } 
                    onClick={closeSidebar}
                    >
                        <img src={assets.friendsIcon} alt="friend icon" className='link-icons' />
                        <span>Friends</span>
                    </NavLink>
                    <NavLink to="/notifications" className={({ isActive }) =>
                        `nav-link-anchors ${isActive ? 'active-button' : ''}`
                    }
                    onClick={closeSidebar}
                    >
                        <img src={assets.notificationIcon} alt="notifications icon" className='link-icons' />
                        <span>Notifications</span>
                    </NavLink>
                </nav>
            </div>
            <div className="sidebar-bottom">
                <img src={authUser.profilePic} alt="profile pic" className='sidebar-profile-picture' />
                <div className="profile-details">
                    <p className="sidebar-username">{authUser.fullName}</p>
                    <p className={ isOnline? "online-status": "offline-status"}> {isOnline? "⦿ online" : "⦿ offline"}</p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
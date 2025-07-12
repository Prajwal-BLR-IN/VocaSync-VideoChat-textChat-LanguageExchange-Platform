import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({children,showSidebar = false}) => {
  return (
    <div className="home-screen-wrapper">
        {showSidebar && <Sidebar />}

        <div className="home-main-section-wrapper">
            <Navbar />
            <main>
                {children}
            </main>
        </div>
        

    </div>
  )
}

export default Layout
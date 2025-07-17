import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({children,showSidebar = false}) => {
  const [isSidebarOpen, setIsSIdebarOpen] = useState(false);
  return (
    <div className="home-screen-wrapper">
              {showSidebar && (
        <>
          <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSIdebarOpen(false)} />

          {/* Dark overlay (only visible when sidebar is open on small screens) */}
          {isSidebarOpen && (
            <div
              className="overlay"
              onClick={() => setIsSIdebarOpen(false)}
            ></div>
          )}
        </>
      )}

        <div className="home-main-section-wrapper">
            <Navbar toggleSidebar={() => setIsSIdebarOpen(prev => !prev)}/>
            <main>
                {children}
            </main>
        </div>
        

    </div>
  )
}

export default Layout
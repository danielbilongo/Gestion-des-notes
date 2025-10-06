import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

/**
 * Layout principal de l'application
 * Contient la Navbar, Sidebar et le contenu principal
 */
const AppLayout = () => {
  const [sidebarOuvert, setSidebarOuvert] = useState(false)

  const toggleSidebar = () => {
    setSidebarOuvert(!sidebarOuvert)
  }

  const closeSidebar = () => {
    setSidebarOuvert(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar ouvert={sidebarOuvert} onClose={closeSidebar} />

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout

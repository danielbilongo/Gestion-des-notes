import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Barre de navigation supérieure
 */
const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate()
  const { utilisateur, seDeconnecter } = useAuth()
  const [menuOuvert, setMenuOuvert] = useState(false)

  const handleDeconnexion = () => {
    seDeconnecter()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Gauche - Logo et toggle sidebar */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center ml-2">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900 hidden sm:block">
                Gestion de Notes
              </span>
            </div>
          </div>

          {/* Droite - Menu utilisateur */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setMenuOuvert(!menuOuvert)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100"
              >
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {utilisateur?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{utilisateur?.username}</p>
                  <p className="text-xs text-gray-500">
                    {utilisateur?.role === 'ADMIN' && 'Administrateur'}
                    {utilisateur?.role === 'TEACHER' && 'Enseignant'}
                    {utilisateur?.role === 'STUDENT' && 'Étudiant'}
                  </p>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menu déroulant */}
              {menuOuvert && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setMenuOuvert(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{utilisateur?.username}</p>
                      <p className="text-xs text-gray-500">{utilisateur?.email}</p>
                    </div>
                    <button
                      onClick={handleDeconnexion}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

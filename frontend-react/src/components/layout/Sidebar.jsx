import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Barre latérale de navigation
 */
const Sidebar = ({ ouvert, onClose }) => {
  const { estAdmin, estEnseignant, estEtudiant } = useAuth()

  // Liens de navigation selon le rôle
  const liensAdmin = [
    { nom: 'Tableau de bord', chemin: '/dashboard', icone: 'home' },
    { nom: 'Utilisateurs', chemin: '/admin/utilisateurs', icone: 'users' },
    { nom: 'Classes', chemin: '/admin/classes', icone: 'class' },
    { nom: 'Matières', chemin: '/admin/matieres', icone: 'book' },
    { nom: 'Inscriptions', chemin: '/admin/inscriptions', icone: 'edit' },
    { nom: 'Enseignants-Classes', chemin: '/admin/enseignant-classes', icone: 'link' },
    { nom: 'Historique', chemin: '/admin/connexions', icone: 'chart' },
    { nom: 'Rapports', chemin: '/admin/rapports', icone: 'document' },
  ]

  const liensEnseignant = [
    { nom: 'Tableau de bord', chemin: '/dashboard', icone: 'home' },
    // { nom: 'Mes Classes', chemin: '/enseignant/classes', icone: 'class' },
    { nom: 'Saisie Notes', chemin: '/enseignant/notes', icone: 'edit' },
    // { nom: 'Mes Étudiants', chemin: '/enseignant/etudiants', icone: 'users' },
  ]

  const liensEtudiant = [
    { nom: 'Tableau de bord', chemin: '/dashboard', icone: 'home' },
    { nom: 'Mes Notes', chemin: '/etudiant/notes', icone: 'chart' },
    { nom: 'Mes Matières', chemin: '/etudiant/matieres', icone: 'book' },
    { nom: 'Relevé de Notes', chemin: '/etudiant/releve', icone: 'document' },
  ]

  let liens = []
  if (estAdmin()) liens = liensAdmin
  else if (estEnseignant()) liens = liensEnseignant
  else if (estEtudiant()) liens = liensEtudiant

  const getIcone = (type) => {
    const icones = {
      home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
      users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
      class: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
      book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
      edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
      chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
      document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
      link: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    }
    return icones[type] || icones.home
  }

  return (
    <>
      {/* Overlay mobile */}
      {ouvert && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        ${ouvert ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {liens.map((lien) => (
              <NavLink
                key={lien.chemin}
                to={lien.chemin}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-md
                  transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getIcone(lien.icone)}
                </svg>
                {lien.nom}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Version 1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

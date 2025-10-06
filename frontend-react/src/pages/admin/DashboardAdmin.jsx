import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import utilisateursService from '../../api/utilisateursService'
import notesService from '../../api/notesService'
import classesService from '../../api/classesService'
import matieresService from '../../api/matieresService'
import Loader from '../../components/Loader'
import InitializationPanel from '../../components/admin/InitializationPanel'

const DashboardAdmin = () => {
  const queryClient = useQueryClient()
  
  const { data: utilisateurs = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['utilisateurs'],
    queryFn: () => utilisateursService.obtenirTous()
  })

  const { data: notes = [], isLoading: loadingNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesService.obtenirTous()
  })

  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classesService.obtenirTous()
  })

  const { data: matieres = [], isLoading: loadingMatieres } = useQuery({
    queryKey: ['matieres'],
    queryFn: () => matieresService.obtenirTous()
  })

  if (loadingUsers || loadingNotes || loadingClasses || loadingMatieres) {
    return <Loader message="Chargement du dashboard..." />
  }

  const etudiants = utilisateurs.filter(u => u.role === 'STUDENT')
  const enseignants = utilisateurs.filter(u => u.role === 'TEACHER')
  const admins = utilisateurs.filter(u => u.role === 'ADMIN')

  const moyenneGenerale = notes.length > 0 
    ? (notes.reduce((sum, note) => sum + note.value, 0) / notes.length).toFixed(2)
    : 0

  const handleDataInitialized = () => {
    // Rafraîchir toutes les données après initialisation
    queryClient.invalidateQueries(['utilisateurs'])
    queryClient.invalidateQueries(['notes'])
    queryClient.invalidateQueries(['classes'])
    queryClient.invalidateQueries(['matieres'])
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble du système</p>
      </div>

      {/* Note: Les données sont maintenant initialisées automatiquement au démarrage du backend */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Étudiants</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{etudiants.length}</p>
            </div>
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Enseignants</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{enseignants.length}</p>
            </div>
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="card bg-purple-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Classes</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{classes.length}</p>
            </div>
            <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <div className="card bg-yellow-50 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Matières</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{matieres.length}</p>
            </div>
            <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Statistiques Notes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total notes</span>
              <span className="font-bold text-gray-900">{notes.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Moyenne générale</span>
              <span className="font-bold text-blue-600">{moyenneGenerale}/20</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Utilisateurs</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Administrateurs</span>
              <span className="font-bold text-gray-900">{admins.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total utilisateurs</span>
              <span className="font-bold text-gray-900">{utilisateurs.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <h4 className="font-semibold text-gray-900 mb-2">Gestion Utilisateurs</h4>
          <p className="text-sm text-gray-600">Gérer les étudiants et enseignants</p>
        </div>
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <h4 className="font-semibold text-gray-900 mb-2">Classes & Matières</h4>
          <p className="text-sm text-gray-600">Configurer les classes et matières</p>
        </div>
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <h4 className="font-semibold text-gray-900 mb-2">Rapports</h4>
          <p className="text-sm text-gray-600">Générer des rapports et statistiques</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin

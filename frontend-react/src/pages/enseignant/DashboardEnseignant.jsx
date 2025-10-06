import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import enseignantClassesService from '../../api/enseignantClassesService'
import notesService from '../../api/notesService'
import inscriptionsService from '../../api/inscriptionsService'
import Loader from '../../components/Loader'

const DashboardEnseignant = () => {
  const { utilisateur } = useAuth()

  // Récupérer toutes les associations enseignant-classes
  const { data: toutesAssociations = [], isLoading: loadingAssociations } = useQuery({
    queryKey: ['teacher-classes'],
    queryFn: () => enseignantClassesService.obtenirTous()
  })

  // Filtrer les classes de l'enseignant connecté
  const classes = toutesAssociations.filter(association => 
    association.teacher?.teacherIdNum === utilisateur?.teacherIdNum
  )

  const { data: notes = [], isLoading: loadingNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesService.obtenirTous()
  })

  // Récupérer toutes les inscriptions pour compter les étudiants par classe
  const { data: inscriptions = [], isLoading: loadingInscriptions } = useQuery({
    queryKey: ['inscriptions'],
    queryFn: () => inscriptionsService.obtenirTous()
  })

  if (loadingAssociations || loadingNotes || loadingInscriptions) {
    return <Loader message="Chargement du dashboard..." />
  }

  // Fonction pour compter les étudiants dans une classe
  const compterEtudiantsClasse = (classId) => {
    if (!classId || !inscriptions.length) return 0
    return inscriptions.filter(inscription => inscription.classEntity?.id === classId).length
  }

  const totalEtudiants = classes.reduce((sum, classe) => sum + (classe.studentCount || 0), 0)
  const notesRecentes = notes.slice(0, 10)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Enseignant</h1>
        <p className="text-gray-600 mt-1">Bienvenue, {utilisateur?.username}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Mes Classes</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{classes.length}</p>
            </div>
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        {/* <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Étudiants</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{totalEtudiants}</p>
            </div>
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div> */}

        <div className="card bg-purple-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Notes Saisies</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{notes.length}</p>
            </div>
            <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Mes Classes</h3>
          {classes.length === 0 ? (
            <p className="text-gray-600">Aucune classe assignée</p>
          ) : (
            <div className="space-y-3">
              {classes.map((association) => (
                <div key={association.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {association.classEntity?.name || 'Classe inconnue'}
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Étudiants:</span> {compterEtudiantsClasse(association.classEntity?.id)} élève{compterEtudiantsClasse(association.classEntity?.id) !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Année:</span> {association.classEntity?.academicYear || 'N/A'}
                        </p>
                        {association.classEntity?.description && (
                          <p className="text-sm text-gray-500 italic">
                            {association.classEntity.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Assigné
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Notes Récentes</h3>
          {notesRecentes.length === 0 ? (
            <p className="text-gray-600">Aucune note récente</p>
          ) : (
            <div className="space-y-2">
              {notesRecentes.map((note) => (
                <div key={note.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                  <span className="text-sm text-gray-900">{note.studentName}</span>
                  <span className="font-bold text-blue-600">{note.value}/20</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <h4 className="font-semibold text-gray-900 mb-2">Saisie de Notes</h4>
          <p className="text-sm text-gray-600">Enregistrer les notes des étudiants</p>
        </div>
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <h4 className="font-semibold text-gray-900 mb-2">Mes Étudiants</h4>
          <p className="text-sm text-gray-600">Voir l'historique des notes par étudiant</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardEnseignant

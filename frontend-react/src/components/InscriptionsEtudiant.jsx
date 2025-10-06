import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import inscriptionsService from '../api/inscriptionsService'
import utilisateursService from '../api/utilisateursService'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

/**
 * Composant pour afficher les inscriptions d'un étudiant spécifique
 */
const InscriptionsEtudiant = () => {
  const [studentIdNumSelectionne, setStudentIdNumSelectionne] = useState('')

  // Récupération des étudiants
  const { data: etudiants = [] } = useQuery({
    queryKey: ['etudiants'],
    queryFn: utilisateursService.obtenirEtudiants
  })

  // Récupération des inscriptions de l'étudiant sélectionné
  const { 
    data: inscriptions = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['inscriptions-etudiant', studentIdNumSelectionne],
    queryFn: () => inscriptionsService.obtenirParEtudiant(studentIdNumSelectionne),
    enabled: !!studentIdNumSelectionne // Ne lance la requête que si un étudiant est sélectionné
  })

  if (isLoading) return <Loader message="Chargement des inscriptions..." />
  if (error) return <ErrorMessage message="Erreur lors du chargement" onRetry={refetch} />

  return (
    <div className="space-y-6">
      {/* Sélection de l'étudiant */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Sélectionner un étudiant
        </h3>
        <select
          value={studentIdNumSelectionne}
          onChange={(e) => setStudentIdNumSelectionne(e.target.value)}
          className="input-field max-w-md"
        >
          <option value="">Choisir un étudiant...</option>
          {etudiants.map(etudiant => (
            <option key={etudiant.id} value={etudiant.studentIdNum}>
              {etudiant.firstname} {etudiant.lastname} ({etudiant.studentIdNum})
            </option>
          ))}
        </select>
      </div>

      {/* Affichage des inscriptions */}
      {studentIdNumSelectionne && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Inscriptions de l'étudiant
            </h3>
            <span className="text-sm text-gray-500">
              {inscriptions.length} inscription(s)
            </span>
          </div>

          {inscriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune inscription trouvée pour cet étudiant
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Classe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Matière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Semestre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Année académique
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date d'inscription
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inscriptions.map((inscription) => (
                    <tr key={inscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {inscription.classEntity?.name || 'N/A'}
                        <div className="text-xs text-gray-500">
                          {inscription.classEntity?.academicYear || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {inscription.subject?.name || 'N/A'}
                        <div className="text-xs text-gray-500">
                          {inscription.subject?.subjectCode || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {inscription.subject?.semester ? (
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            inscription.subject.semester === 'S1' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {inscription.subject.semester}
                          </span>
                        ) : (
                          <span className="text-gray-400">Non défini</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {inscription.academicYear || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {inscription.enrollmentDate ? 
                          new Date(inscription.enrollmentDate).toLocaleDateString('fr-FR') : 
                          '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default InscriptionsEtudiant

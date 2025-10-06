import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import notesService from '../../api/notesService'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import { formaterDate, formaterNote } from '../../utils/formatters'

/**
 * Page des notes de l'étudiant
 */
const MesNotes = () => {
  const { utilisateur } = useAuth()

  // Récupération des notes
  const { data: notes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['mes-notes', utilisateur?.id],
    queryFn: () => notesService.obtenirParEtudiant(utilisateur?.studentIdNum || ''),
    enabled: !!utilisateur?.studentIdNum
  })

  // Récupération de la moyenne générale
  const { data: moyenneGenerale } = useQuery({
    queryKey: ['moyenne-generale', utilisateur?.id],
    queryFn: () => notesService.calculerMoyenneGenerale(utilisateur?.studentIdNum || ''),
    enabled: !!utilisateur?.studentIdNum
  })

  if (isLoading) return <Loader message="Chargement de vos notes..." />
  if (error) return <ErrorMessage message="Erreur lors du chargement" onRetry={refetch} />

  // DEBUG: Afficher les données reçues
  console.log('📊 Notes reçues:', notes)
  if (notes.length > 0) {
    console.log('📊 Exemple de note:', notes[0])
    const semestres = [...new Set(notes.map(n => n.semester))]
    console.log('📊 Semestres trouvés:', semestres)
    console.log('📊 Détail des semestres:', semestres.map(s => `"${s}" (type: ${typeof s})`))
    
    // Afficher chaque note avec son semestre
    notes.forEach((note, index) => {
      console.log(`📊 Note ${index + 1}: semester="${note.semester}" (type: ${typeof note.semester}), subject="${note.subjectName}"`)
    })
  }

  // Grouper les notes par matière
  const notesParMatiere = notes.reduce((acc, note) => {
    const matiere = note.subjectName || 'Sans matière'
    if (!acc[matiere]) {
      acc[matiere] = []
    }
    acc[matiere].push(note)
    return acc
  }, {})

  // Grouper les notes par semestre
  const notesParSemestre = notes.reduce((acc, note) => {
    // Normaliser le semestre (gérer null, undefined, vide)
    let semestre = note.semester?.trim()
    if (!semestre || (semestre !== 'S1' && semestre !== 'S2')) {
      console.warn('Note avec semestre invalide:', note)
      semestre = 'Sans semestre'
    }
    
    if (!acc[semestre]) {
      acc[semestre] = []
    }
    acc[semestre].push(note)
    return acc
  }, {})

  // Fonction pour rendre un tableau de notes
  const renderTableauNotes = (notesListe, titre, description) => (
    <div className="card mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{titre}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notesListe
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Trier par date décroissante
              .map((note) => (
              <tr key={note.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formaterDate(note.date)}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${
                    note.value >= 16 ? 'text-green-600' :
                    note.value >= 12 ? 'text-blue-600' :
                    note.value >= 10 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {formaterNote(note.value)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {note.comment || '-'}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {note.subjectName || 'Sans matière'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Notes</h1>
          <p className="text-gray-600 mt-1">Consultez vos notes et moyennes</p>
        </div>
      </div>

      {/* Moyenne générale */}
      {moyenneGenerale !== undefined && (
        <div className="card mb-6 bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Moyenne Générale</h3>
              <p className="text-sm text-blue-700">Toutes matières confondues</p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {formaterNote(moyenneGenerale)}
            </div>
          </div>
        </div>
      )}

      {/* Tableaux des notes par semestre */}
      {notes.length === 0 ? (
        <div className="card text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-600">Aucune note disponible</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tableau Semestre 1 */}
          {notesParSemestre['S1'] && notesParSemestre['S1'].length > 0 && (
            renderTableauNotes(
              notesParSemestre['S1'], 
              'Notes du Semestre 1', 
              'Toutes vos notes du premier semestre'
            )
          )}

          {/* Tableau Semestre 2 */}
          {notesParSemestre['S2'] && notesParSemestre['S2'].length > 0 && (
            renderTableauNotes(
              notesParSemestre['S2'], 
              'Notes du Semestre 2', 
              'Toutes vos notes du second semestre'
            )
          )}

          {/* Tableau pour les notes sans semestre défini */}
          {notesParSemestre['Sans semestre'] && notesParSemestre['Sans semestre'].length > 0 && (
            renderTableauNotes(
              notesParSemestre['Sans semestre'], 
              'Autres Notes', 
              'Notes sans semestre défini'
            )
          )}
        </div>
      )}

      {/* Moyennes par matière */}
      {Object.keys(notesParMatiere).length > 0 && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Moyennes par matière</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(notesParMatiere).map(([matiere, notesMatiere]) => {
              const moyenne = notesMatiere.reduce((sum, n) => sum + n.value, 0) / notesMatiere.length
              
              return (
                <div key={matiere} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">{matiere}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{notesMatiere.length} note{notesMatiere.length > 1 ? 's' : ''}</span>
                    <span className={`font-bold ${
                      moyenne >= 16 ? 'text-green-600' :
                      moyenne >= 12 ? 'text-blue-600' :
                      moyenne >= 10 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {formaterNote(moyenne)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MesNotes

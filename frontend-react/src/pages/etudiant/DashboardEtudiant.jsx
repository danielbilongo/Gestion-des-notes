import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import notesService from '../../api/notesService'
import inscriptionsService from '../../api/inscriptionsService'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import Loader from '../../components/Loader'
import { formaterNote } from '../../utils/formatters'

// Enregistrement des composants Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

/**
 * Dashboard étudiant avec graphiques
 */
const DashboardEtudiant = () => {
  const { utilisateur } = useAuth()

  // Récupération des notes
  const { data: notes = [], isLoading } = useQuery({
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

  // Récupération des inscriptions de l'étudiant
  const { data: inscriptions = [], isLoading: loadingInscriptions } = useQuery({
    queryKey: ['mes-inscriptions', utilisateur?.studentIdNum],
    queryFn: () => inscriptionsService.obtenirParEtudiant(utilisateur?.studentIdNum || ''),
    enabled: !!utilisateur?.studentIdNum
  })

  if (isLoading || loadingInscriptions) return <Loader message="Chargement du dashboard..." />

  // Grouper les notes par matière
  const notesParMatiere = notes.reduce((acc, note) => {
    const matiere = note.subjectName || 'Sans matière'
    if (!acc[matiere]) {
      acc[matiere] = { notes: [], total: 0, count: 0 }
    }
    acc[matiere].notes.push(note)
    acc[matiere].total += note.value
    acc[matiere].count += 1
    return acc
  }, {})

  // Données pour le graphique des moyennes par matière
  const moyennesData = {
    labels: Object.keys(notesParMatiere),
    datasets: [{
      label: 'Moyenne par matière',
      data: Object.values(notesParMatiere).map(m => (m.total / m.count).toFixed(2)),
      backgroundColor: 'rgba(37, 99, 235, 0.5)',
      borderColor: 'rgba(37, 99, 235, 1)',
      borderWidth: 2
    }]
  }

  // Données pour l'évolution des notes
  const notesTriees = [...notes].sort((a, b) => new Date(a.date) - new Date(b.date))
  const evolutionData = {
    labels: notesTriees.map(n => new Date(n.date).toLocaleDateString('fr-FR')),
    datasets: [{
      label: 'Évolution des notes',
      data: notesTriees.map(n => n.value),
      borderColor: 'rgba(37, 99, 235, 1)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4
    }]
  }

  const optionsGraphique = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}/20`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        ticks: { stepSize: 5 }
      }
    }
  }

  // Statistiques
  const meilleureNote = notes.length > 0 ? Math.max(...notes.map(n => n.value)) : 0
  const plusBasseNote = notes.length > 0 ? Math.min(...notes.map(n => n.value)) : 0
  
  // Calculer le nombre de matières basé sur les inscriptions
  const matieresInscrites = new Set(inscriptions.map(inscription => 
    inscription.subject?.subjectCode
  ).filter(Boolean)) // Filtrer les valeurs null/undefined
  
  // Fallback : si pas d'inscriptions, utiliser les notes
  const nombreMatieres = matieresInscrites.size > 0 ? matieresInscrites.size : Object.keys(notesParMatiere).length

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon Dashboard</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de vos résultats</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Moyenne Générale</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {moyenneGenerale ? formaterNote(moyenneGenerale) : '-'}
              </p>
            </div>
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Meilleure Note</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {formaterNote(meilleureNote)}
              </p>
            </div>
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        <div className="card bg-yellow-50 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Plus Basse Note</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">
                {formaterNote(plusBasseNote)}
              </p>
            </div>
            <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>

        <div className="card bg-purple-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Matières</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{nombreMatieres}</p>
            </div>
            <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Moyennes par matière */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Moyennes par Matière</h3>
            <div style={{ height: '300px' }}>
              <Bar data={moyennesData} options={optionsGraphique} />
            </div>
          </div>

          {/* Évolution des notes */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Évolution des Notes</h3>
            <div style={{ height: '300px' }}>
              <Line data={evolutionData} options={optionsGraphique} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-600 text-lg">Aucune note disponible</p>
          <p className="text-gray-500 text-sm">Les graphiques s'afficheront dès que vous aurez des notes</p>
        </div>
      )}
    </div>
  )
}

export default DashboardEtudiant

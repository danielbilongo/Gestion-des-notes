import React, { useState } from 'react'
import { toast } from 'react-toastify'
import exportService from '../../api/exportService'

/**
 * Page de génération de rapports (Admin)
 */
const Rapports = () => {
  const [chargement, setChargement] = useState({ notes: false, utilisateurs: false })

  const handleExport = async (type) => {
    setChargement(prev => ({ ...prev, [type]: true }))
    try {
      await exportService.telechargerExcel(type)
      toast.success(`Export ${type} réussi`)
    } catch (error) {
      toast.error(`Erreur lors de l'export ${type}`)
    } finally {
      setChargement(prev => ({ ...prev, [type]: false }))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rapports & Exports</h1>
        <p className="text-gray-600 mt-1">Générer des rapports et exporter les données</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Notes */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold">Export Notes</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Exporter toutes les notes au format Excel
          </p>
          <button
            onClick={() => handleExport('notes')}
            disabled={chargement.notes}
            className="btn-primary w-full"
          >
            {chargement.notes ? 'Export en cours...' : 'Exporter Notes Excel'}
          </button>
        </div>

        {/* Export Utilisateurs */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold">Export Utilisateurs</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Exporter tous les utilisateurs au format Excel
          </p>
          <button
            onClick={() => handleExport('utilisateurs')}
            disabled={chargement.utilisateurs}
            className="btn-primary w-full"
          >
            {chargement.utilisateurs ? 'Export en cours...' : 'Exporter Utilisateurs Excel'}
          </button>
        </div>
      </div>

      {/* Informations */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Information</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Les fichiers Excel seront téléchargés automatiquement dans votre dossier de téléchargements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rapports

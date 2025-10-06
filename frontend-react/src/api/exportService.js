import apiClient from './client'

/**
 * Service d'export Excel
 */
const exportService = {
  /**
   * Exporter les notes en Excel
   */
  exporterNotes: async () => {
    const response = await apiClient.get('/api/exports/grades/excel', {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Exporter les utilisateurs en Excel
   */
  exporterUtilisateurs: async () => {
    const response = await apiClient.get('/api/exports/users/excel', {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Télécharger un fichier Excel
   */
  telechargerExcel: async (type = 'notes') => {
    const blob = type === 'notes' 
      ? await exportService.exporterNotes()
      : await exportService.exporterUtilisateurs()
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `export_${type}_${new Date().getTime()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

export default exportService

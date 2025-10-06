import apiClient from './client'

/**
 * Service de gestion des relevés de notes (PDF)
 */
const releveService = {
  /**
   * Générer un relevé PDF pour un étudiant
   */
  genererPDF: async (studentIdNum) => {
    const response = await apiClient.get(`/api/transcript/generate/${studentIdNum}`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Télécharger un relevé PDF
   */
  telechargerPDF: async (studentIdNum) => {
    const blob = await releveService.genererPDF(studentIdNum)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `releve_notes_${studentIdNum}_${new Date().getTime()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  /**
   * Obtenir tous les relevés d'un étudiant
   */
  obtenirTous: async (studentIdNum) => {
    const response = await apiClient.get(`/api/transcript/student/${studentIdNum}`)
    return response.data
  }
}

export default releveService

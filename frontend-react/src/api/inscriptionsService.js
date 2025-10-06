import apiClient from './client'

/**
 * Service de gestion des inscriptions (enrollments)
 * Gère l'inscription des étudiants aux matières et classes
 */
const inscriptionsService = {
  /**
   * Créer une inscription
   * @param {Object} data - { studentIdNum, classId, subjectCode }
   */
  creer: async (data) => {
    const response = await apiClient.post('/api/enrollments', data)
    return response.data
  },

  /**
   * Récupérer toutes les inscriptions
   */
  obtenirTous: async () => {
    const response = await apiClient.get('/api/enrollments')
    return response.data
  },

  /**
   * Récupérer une inscription par ID
   */
  obtenirParId: async (id) => {
    const response = await apiClient.get(`/api/enrollments/${id}`)
    return response.data
  },

  /**
   * Récupérer les inscriptions d'un étudiant
   */
  obtenirParEtudiant: async (studentIdNum) => {
    const response = await apiClient.get(`/api/enrollments/student/${studentIdNum}`)
    return response.data
  },

  /**
   * Récupérer les inscriptions d'une classe
   */
  obtenirParClasse: async (classId) => {
    const response = await apiClient.get(`/api/enrollments/class/${classId}`)
    return response.data
  },

  /**
   * Modifier une inscription
   * @param {number} id - ID de l'inscription
   * @param {Object} data - { studentIdNum, classId, subjectCode }
   */
  modifier: async (id, data) => {
    const response = await apiClient.put(`/api/enrollments/${id}`, data)
    return response.data
  },

  /**
   * Supprimer une inscription
   */
  supprimer: async (id) => {
    const response = await apiClient.delete(`/api/enrollments/${id}`)
    return response.data
  }
}

export default inscriptionsService

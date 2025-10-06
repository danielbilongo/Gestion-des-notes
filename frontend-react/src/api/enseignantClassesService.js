import apiClient from './client'

/**
 * Service de gestion des associations enseignant-classes
 */
const enseignantClassesService = {
  /**
   * Assigner un enseignant à une classe
   * @param {Object} data - { teacherIdNum, classId }
   */
  assigner: async (data) => {
    const response = await apiClient.post('/api/teacher-classes/assign', data)
    return response.data
  },

  /**
   * Récupérer toutes les associations
   */
  obtenirTous: async () => {
    const response = await apiClient.get('/api/teacher-classes')
    return response.data
  },

  /**
   * Récupérer les classes d'un enseignant
   */
  obtenirClassesEnseignant: async (teacherIdNum) => {
    const response = await apiClient.get(`/api/teacher-classes/teacher/${teacherIdNum}`)
    return response.data
  },

  /**
   * Récupérer les enseignants d'une classe
   */
  obtenirEnseignantsClasse: async (classId) => {
    const response = await apiClient.get(`/api/teacher-classes/class/${classId}`)
    return response.data
  },

  /**
   * Modifier une association
   * @param {number} id - ID de l'association
   * @param {Object} data - { teacherIdNum, classId }
   */
  modifier: async (id, data) => {
    const response = await apiClient.put(`/api/teacher-classes/${id}`, data)
    return response.data
  },

  /**
   * Supprimer une association
   */
  supprimer: async (id) => {
    const response = await apiClient.delete(`/api/teacher-classes/${id}`)
    return response.data
  }
}

export default enseignantClassesService

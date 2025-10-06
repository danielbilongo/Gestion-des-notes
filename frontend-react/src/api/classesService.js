import apiClient from './client'

/**
 * Service de gestion des classes
 */
const classesService = {
  /**
   * Créer une classe
   */
  creer: async (data) => {
    const response = await apiClient.post('/api/classes', data)
    return response.data
  },

  /**
   * Récupérer toutes les classes
   */
  obtenirTous: async () => {
    const response = await apiClient.get('/api/classes')
    return response.data
  },

  /**
   * Récupérer une classe par ID
   */
  obtenirParId: async (id) => {
    const response = await apiClient.get(`/api/classes/${id}`)
    return response.data
  },

  /**
   * Modifier une classe
   */
  modifier: async (id, data) => {
    const response = await apiClient.put(`/api/classes/${id}`, data)
    return response.data
  },

  /**
   * Supprimer une classe
   */
  supprimer: async (id) => {
    const response = await apiClient.delete(`/api/classes/${id}`)
    return response.data
  }
}

export default classesService

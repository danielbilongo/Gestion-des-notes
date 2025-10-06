import apiClient from './client'

/**
 * Service de gestion des matières
 */
const matieresService = {
  /**
   * Créer une matière
   */
  creer: async (data) => {
    const response = await apiClient.post('/api/subjects', data)
    return response.data
  },

  /**
   * Récupérer toutes les matières
   */
  obtenirTous: async () => {
    const response = await apiClient.get('/api/subjects')
    return response.data
  },

  /**
   * Récupérer une matière par ID
   */
  obtenirParId: async (id) => {
    const response = await apiClient.get(`/api/subjects/${id}`)
    return response.data
  },

  /**
   * Rechercher par code
   */
  rechercherParCode: async (code) => {
    const response = await apiClient.get(`/api/subjects/code/${code}`)
    return response.data
  },

  /**
   * Modifier une matière
   */
  modifier: async (id, data) => {
    const response = await apiClient.put(`/api/subjects/${id}`, data)
    return response.data
  },

  /**
   * Supprimer une matière
   */
  supprimer: async (id) => {
    const response = await apiClient.delete(`/api/subjects/${id}`)
    return response.data
  }
}

export default matieresService

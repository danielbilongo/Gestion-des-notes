import axios from 'axios'
import { toast } from 'react-toastify'

// Configuration de base
// En développement, on utilise le proxy Vite (pas de baseURL)
// En production, on utilisera VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : ''
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000

// Création de l'instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur de requête - Ajout du token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gestion_notes_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse - Gestion des erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Log pour debug
    console.error('API Error:', {
      url: originalRequest?.url,
      data: error.response?.data,
      message: error.message
    })

    // Gestion des erreurs d'authentification - MOINS AGRESSIVE
    if (error.response?.status === 401) {
      // Vérifier si c'est vraiment une erreur d'auth ou juste une requête échouée
      const isLoginRequest = error.config?.url?.includes('/login')
      const isAuthRequest = error.config?.url?.includes('/auth')
      
      // Ne pas déconnecter sur les requêtes de login/auth qui échouent normalement
      if (isLoginRequest || isAuthRequest) {
        // Laisser passer l'erreur sans déconnecter
        return Promise.reject(error)
      }
      
      // Pour les autres requêtes 401, vérifier le token
      const token = localStorage.getItem('gestion_notes_token')
      if (!token) {
        // Pas de token - rediriger vers login
        window.location.href = '/login'
        return Promise.reject(error)
      }
      
      // Token présent mais 401 - peut-être expiré
      // Essayer une seule fois de refresh, sinon laisser l'utilisateur continuer
      const refreshToken = localStorage.getItem('gestion_notes_refresh_token')
      
      if (refreshToken && !error.config._retry) {
        error.config._retry = true
        try {
          const refreshResponse = await axios.post('/api/auth/refresh', {
            refreshToken: refreshToken
          })
          
          const newToken = refreshResponse.data.token
          localStorage.setItem('gestion_notes_token', newToken)
          
          // Retry la requête originale
          error.config.headers.Authorization = `Bearer ${newToken}`
          return axios.request(error.config)
        } catch (refreshError) {
          // Refresh failed - mais ne pas déconnecter automatiquement
          console.warn('Token refresh failed, but continuing...', refreshError)
        }
      }
    }

    // Gestion des autres erreurs
    if (error.response) {
      const errorData = error.response.data
      let message = 'Une erreur est survenue'
      
      // Extraction du message d'erreur selon la structure de réponse
      if (typeof errorData === 'string') {
        message = errorData
      } else if (errorData?.message) {
        message = errorData.message
      } else if (errorData?.error) {
        message = errorData.error
      } else if (errorData?.details) {
        message = errorData.details
      }
      
      switch (error.response.status) {
        case 400:
          // Erreurs de validation - messages plus spécifiques
          if (message.includes('Student ID')) {
            toast.error('Format d\'ID étudiant invalide. Utilisez le format S0001')
          } else if (message.includes('Teacher ID')) {
            toast.error('Format d\'ID enseignant invalide. Utilisez le format T0001')
          } else if (message.includes('Grade value')) {
            toast.error('Note invalide. La note doit être entre 0 et 100')
          } else if (message.includes('Email')) {
            toast.error('Format d\'email invalide')
          } else if (message.includes('Username')) {
            toast.error('Nom d\'utilisateur invalide (3-50 caractères)')
          } else if (message.includes('already exists')) {
            toast.error('Cet élément existe déjà dans le système')
          } else {
            toast.error(`Données invalides: ${message}`)
          }
          break
        case 401:
          // Ne pas afficher de toast pour les 401, gestion silencieuse
          console.warn('Erreur 401 - Token potentiellement expiré')
          break
        case 403:
          toast.error('Accès interdit. Vous n\'avez pas les permissions nécessaires.')
          break
        case 404:
          toast.error('Élément non trouvé')
          break
        case 409:
          toast.error('Conflit: Cet élément existe déjà')
          break
        case 422:
          toast.error('Données non valides pour cette opération')
          break
        case 500:
          toast.error('Erreur serveur. Veuillez réessayer plus tard.')
          break
        case 503:
          toast.error('Service temporairement indisponible')
          break
        default:
          toast.error(message)
      }
    } else if (error.request) {
      // Erreur réseau
      if (error.code === 'ECONNREFUSED') {
        toast.error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 8088.')
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('Erreur réseau. Vérifiez votre connexion internet.')
      } else {
        toast.error('Erreur de connexion au serveur. Vérifiez que le backend est démarré.')
      }
      console.error('Request made but no response:', error.request)
    } else {
      // Autre erreur
      toast.error(`Erreur inattendue: ${error.message}`)
    }

    return Promise.reject(error)
  }
)

export default apiClient

/**
 * Script de diagnostic pour vérifier le token JWT
 */

export const debugToken = () => {
  console.log('🔍 === DIAGNOSTIC TOKEN JWT ===')
  
  const token = localStorage.getItem('gestion_notes_token')
  
  if (!token) {
    console.error('❌ Aucun token trouvé dans localStorage')
    return false
  }
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('❌ Token JWT malformé (pas 3 parties)')
      return false
    }
    
    const payload = JSON.parse(atob(parts[1]))
    const now = Date.now() / 1000
    
    console.log('✅ Token trouvé:', {
      username: payload.sub,
      role: payload.role,
      issued: new Date(payload.iat * 1000).toLocaleString(),
      expires: new Date(payload.exp * 1000).toLocaleString(),
      expired: payload.exp < now,
      timeLeft: payload.exp - now > 0 ? Math.round((payload.exp - now) / 60) + ' minutes' : 'EXPIRÉ'
    })
    
    if (payload.exp < now) {
      console.error('❌ Token expiré!')
      return false
    }
    
    if (!payload.role) {
      console.error('❌ Rôle manquant dans le token!')
      return false
    }
    
    console.log('✅ Token valide')
    return true
    
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error)
    return false
  }
}

// Fonction pour forcer la reconnexion
export const forceReconnect = () => {
  console.log('🔄 Suppression du token et redirection vers login...')
  localStorage.removeItem('gestion_notes_token')
  window.location.href = '/login'
}

// Auto-exécution en mode développement
if (process.env.NODE_ENV === 'development') {
  // Ajouter au window pour accès depuis la console
  window.debugToken = debugToken
  window.forceReconnect = forceReconnect
  
  console.log('🛠️ Fonctions de debug disponibles:')
  console.log('- debugToken() : Vérifier le token JWT')
  console.log('- forceReconnect() : Forcer la reconnexion')
}

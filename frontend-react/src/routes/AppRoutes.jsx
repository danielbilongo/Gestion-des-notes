import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Import des composants
import ProtectedRoute from '../components/ProtectedRoute'
import RoleGuard from '../components/RoleGuard'
import AppLayout from '../components/layout/AppLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import NonAutorise from '../pages/NonAutorise'

/**
 * Configuration des routes de l'application
 * Gère la navigation et la protection des routes selon l'authentification et les rôles
 */
const AppRoutes = () => {
  const { estAuthentifie } = useAuth()

  return (
    <Routes>
      {/* Route publique - Login */}
      <Route 
        path="/login" 
        element={
          estAuthentifie ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />

      {/* Routes protégées avec Layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard - Redirection selon le rôle */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Dashboards spécifiques par rôle */}
        <Route path="/admin/dashboard" element={
          <RoleGuard rolesAutorises="ADMIN">
            <React.Suspense fallback={<div>Chargement...</div>}>
              {React.createElement(React.lazy(() => import('../pages/admin/DashboardAdmin')))}
            </React.Suspense>
          </RoleGuard>
        } />
        <Route path="/enseignant/dashboard" element={
          <RoleGuard rolesAutorises={['TEACHER', 'ADMIN']}>
            <React.Suspense fallback={<div>Chargement...</div>}>
              {React.createElement(React.lazy(() => import('../pages/enseignant/DashboardEnseignant')))}
            </React.Suspense>
          </RoleGuard>
        } />
        <Route path="/etudiant/dashboard" element={
          <RoleGuard rolesAutorises={['STUDENT', 'TEACHER', 'ADMIN']}>
            <React.Suspense fallback={<div>Chargement...</div>}>
              {React.createElement(React.lazy(() => import('../pages/etudiant/DashboardEtudiant')))}
            </React.Suspense>
          </RoleGuard>
        } />

        {/* Routes Admin */}
        <Route path="/admin/*" element={
          <RoleGuard rolesAutorises="ADMIN">
            <Routes>
              <Route path="utilisateurs" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/admin/ListeUtilisateurs')))}
                </React.Suspense>
              } />
              <Route path="classes" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/admin/GestionClasses')))}
                </React.Suspense>
              } />
              <Route path="matieres" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/admin/GestionMatieres')))}
                </React.Suspense>
              } />
              <Route path="inscriptions" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/admin/GestionInscriptions')))}
                </React.Suspense>
              } />
              <Route path="connexions" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/admin/HistoriqueConnexions')))}
                </React.Suspense>
              } />
              <Route path="rapports" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/admin/Rapports')))}
                </React.Suspense>
              } />
              <Route path="enseignant-classes" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/admin/GestionEnseignantClasses')))}
                </React.Suspense>
              } />
            </Routes>
          </RoleGuard>
        } />

        {/* Routes Enseignant */}
        <Route path="/enseignant/*" element={
          <RoleGuard rolesAutorises={['TEACHER', 'ADMIN']}>
            <Routes>
              <Route path="classes" element={
                <div className="text-center py-8">
                  <h1 className="text-2xl font-bold">Mes Classes</h1>
                  <p className="text-gray-600 mt-2">Itération 4</p>
                </div>
              } />
              <Route path="notes" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/enseignant/SaisieNotes')))}
                </React.Suspense>
              } />
              <Route path="etudiants" element={
                <div className="text-center py-8">
                  <h1 className="text-2xl font-bold">Mes Étudiants</h1>
                  <p className="text-gray-600 mt-2">Itération 5</p>
                </div>
              } />
            </Routes>
          </RoleGuard>
        } />

        {/* Routes Étudiant */}
        <Route path="/etudiant/*" element={
          <RoleGuard rolesAutorises={['STUDENT', 'TEACHER', 'ADMIN']}>
            <Routes>
              <Route path="notes" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/etudiant/MesNotes')))}
                </React.Suspense>
              } />
              <Route path="matieres" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/etudiant/MesMatieres')))}
                </React.Suspense>
              } />
              <Route path="releve" element={
                <React.Suspense fallback={<div>Chargement...</div>}>
                  {React.createElement(React.lazy(() => import('../pages/etudiant/MonReleve')))}
                </React.Suspense>
              } />
            </Routes>
          </RoleGuard>
        } />
      </Route>

      {/* Route - Accès non autorisé */}
      <Route path="/non-autorise" element={<NonAutorise />} />

      {/* Redirection par défaut */}
      <Route 
        path="/" 
        element={
          estAuthentifie ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Route 404 - Page non trouvée */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
              <a href="/" className="btn-primary">
                Retour à l'accueil
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default AppRoutes

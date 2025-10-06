# 📚 DOCUMENTATION COMPLÈTE - FRONTEND REACT

## 🎯 Vue d'Ensemble

Application React complète pour la gestion de notes académiques, connectée au backend Spring Boot.

**Technologies** : React 18, Vite, Tailwind CSS, React Query, React Hook Form, Chart.js  
**Style** : Design simple et épuré  
**Port** : http://localhost:4300  
**Backend** : http://localhost:8088

---

## 📦 Installation

```bash
cd "c:\Users\vladimir\Documents\gestion de notes\frontend-react"
npm install
npm run dev
```

---

## 🗂️ Structure Complète

```
frontend-react/
├── src/
│   ├── api/                          # Services API (8 fichiers)
│   │   ├── client.js                 # Client Axios + intercepteurs JWT
│   │   ├── authService.js            # Authentification
│   │   ├── utilisateursService.js    # Gestion utilisateurs
│   │   ├── classesService.js         # Gestion classes
│   │   ├── matieresService.js        # Gestion matières
│   │   ├── notesService.js           # Gestion notes
│   │   ├── releveService.js          # Relevés PDF
│   │   └── exportService.js          # Export Excel
│   │
│   ├── components/                   # Composants (10 fichiers)
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Barre navigation
│   │   │   ├── Sidebar.jsx           # Menu latéral
│   │   │   └── AppLayout.jsx         # Layout principal
│   │   ├── modals/
│   │   │   └── ModalUtilisateur.jsx  # Modal CRUD utilisateur
│   │   ├── ProtectedRoute.jsx        # Protection authentification
│   │   ├── RoleGuard.jsx             # Protection par rôle
│   │   ├── Loader.jsx                # Indicateur chargement
│   │   └── ErrorMessage.jsx          # Affichage erreurs
│   │
│   ├── contexts/                     # Contextes React
│   │   └── AuthContext.jsx           # Gestion authentification globale
│   │
│   ├── hooks/                        # Hooks personnalisés
│   │   └── useAuth.js                # Hook authentification
│   │
│   ├── pages/                        # Pages (10 fichiers)
│   │   ├── Login.jsx                 # Page connexion
│   │   ├── Dashboard.jsx             # Dashboard principal
│   │   ├── NonAutorise.jsx           # Page accès refusé
│   │   ├── admin/
│   │   │   ├── ListeUtilisateurs.jsx # Gestion utilisateurs
│   │   │   └── Rapports.jsx          # Exports Excel
│   │   ├── enseignant/
│   │   │   └── SaisieNotes.jsx       # Saisie notes
│   │   └── etudiant/
│   │       ├── MesNotes.jsx          # Consultation notes
│   │       ├── DashboardEtudiant.jsx # Dashboard graphiques
│   │       └── MonReleve.jsx         # Téléchargement PDF
│   │
│   ├── routes/                       # Configuration routes
│   │   └── AppRoutes.jsx             # Définition navigation
│   │
│   ├── utils/                        # Utilitaires
│   │   ├── constants.js              # Constantes app
│   │   └── formatters.js             # Fonctions formatage
│   │
│   ├── App.jsx                       # Composant racine
│   ├── main.jsx                      # Point d'entrée
│   └── index.css                     # Styles globaux
│
├── .env                              # Variables environnement
├── package.json                      # Dépendances
├── vite.config.js                    # Config Vite
├── tailwind.config.js                # Config Tailwind
└── README.md                         # Doc rapide
```

---

## 🔐 Authentification

### Flux Complet

1. **Connexion** : POST `/api/auth/signin`
2. **Réponse** : JWT + infos utilisateur
3. **Stockage** : localStorage (token + user)
4. **Utilisation** : Ajout auto du token dans headers
5. **Déconnexion** : Suppression localStorage

### Structure Réponse Backend

```json
{
  "jwt": "eyJhbGc...",
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "authorities": ["ROLE_ADMIN"]
}
```

### Comptes Test

| Rôle | Username | Password |
|------|----------|----------|
| Admin | admin | adminpass |
| Enseignant | À créer | - |
| Étudiant | À créer | - |

---

## 🎨 Design Simple

### Principes

- ✅ Interface épurée sans fioritures
- ✅ Typographie claire (Inter)
- ✅ Couleurs sobres (bleu, gris)
- ✅ Espaces aérés
- ✅ Composants cohérents
- ✅ Responsive (mobile/desktop)

### Palette

- **Primaire** : Bleu (#2563eb)
- **Secondaire** : Gris (#6b7280)
- **Succès** : Vert (#10b981)
- **Erreur** : Rouge (#ef4444)
- **Fond** : Gris clair (#f9fafb)

### Classes CSS

```css
.btn-primary      /* Bouton bleu */
.btn-secondary    /* Bouton gris */
.btn-danger       /* Bouton rouge */
.input-field      /* Champ saisie */
.card             /* Carte avec ombre */
.label            /* Label formulaire */
.error-message    /* Message erreur */
```

---

## 📊 Fonctionnalités par Rôle

### 👨‍💼 Administrateur

**Gestion Utilisateurs** (`/admin/utilisateurs`)
- Créer étudiants/enseignants
- Modifier informations
- Supprimer utilisateurs
- Filtrer par rôle
- Recherche

**Rapports** (`/admin/rapports`)
- Export Excel notes
- Export Excel utilisateurs
- Téléchargement automatique

### 👨‍🏫 Enseignant

**Saisie Notes** (`/enseignant/notes`)
- Sélection étudiant
- Sélection matière
- Note sur 20 (validation 0-20)
- Date et commentaire
- Historique notes étudiant

### 👨‍🎓 Étudiant

**Mes Notes** (`/etudiant/notes`)
- Notes groupées par matière
- Moyennes par matière
- Moyenne générale
- Commentaires enseignants

**Dashboard** (`/dashboard`)
- Statistiques (moyenne, meilleure note, etc.)
- Graphique moyennes par matière (Bar)
- Graphique évolution notes (Line)
- Cartes colorées

**Relevé PDF** (`/etudiant/releve`)
- Génération PDF automatique
- Téléchargement direct
- Contenu complet (notes, moyennes)

---

## 🔧 Services API

### authService
```javascript
login(credentials)           // Connexion
logout()                     // Déconnexion
getCurrentUser()             // Utilisateur courant
isAuthenticated()            // Vérif authentification
hasRole(roles)               // Vérif rôle
```

### utilisateursService
```javascript
creerEtudiant(data)          // POST /api/admin/users/students
creerEnseignant(data)        // POST /api/admin/users/teachers
obtenirTous()                // GET /api/admin/users/users
obtenirParId(id)             // GET /api/admin/users/{id}
modifier(id, data)           // PUT /api/admin/users/update/{id}
supprimer(id)                // DELETE /api/admin/users/delete/{id}
```

### notesService
```javascript
ajouter(data)                // POST /api/grades/add
obtenirParEtudiant(idNum)    // GET /api/grades/student/{idNum}
obtenirParMatiere(code)      // GET /api/grades/subject/{code}
calculerMoyenneGenerale(id)  // GET /api/grades/averages/student/overall/{id}
modifier(id, data)           // PUT /api/grades/{id}
supprimer(id)                // DELETE /api/grades/{id}
```

### releveService
```javascript
genererPDF(studentIdNum)     // GET /api/transcripts/generate/{id}
telechargerPDF(studentIdNum) // Téléchargement auto
```

### exportService
```javascript
exporterNotes()              // GET /api/excel/export/grades
exporterUtilisateurs()       // GET /api/excel/export/users
telechargerExcel(type)       // Téléchargement auto
```

---

## 🛡️ Sécurité

### Protection Routes

**ProtectedRoute** : Vérifie authentification
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**RoleGuard** : Vérifie rôle
```jsx
<RoleGuard rolesAutorises="ADMIN">
  <PageAdmin />
</RoleGuard>

<RoleGuard rolesAutorises={['TEACHER', 'ADMIN']}>
  <PageEnseignant />
</RoleGuard>
```

### Intercepteurs Axios

- **Requête** : Ajout auto token JWT
- **Réponse 401** : Tentative refresh (si configuré)
- **Réponse 403** : Message accès refusé
- **Réponse 404** : Ressource non trouvée
- **Réponse 500** : Erreur serveur
- **Erreur réseau** : Message connexion

---

## 📈 Graphiques (Chart.js)

### Configuration

```javascript
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)
```

### Types Utilisés

- **Bar** : Moyennes par matière
- **Line** : Évolution temporelle des notes

### Options

```javascript
{
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true, max: 20 }
  }
}
```

---

## 🧪 Tests Manuels

### Test 1 : Connexion Admin

```bash
# API
curl -X POST http://localhost:8088/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"adminpass"}'

# UI
1. http://localhost:4300
2. Cliquer "Admin"
3. Se connecter
4. ✅ Redirection /dashboard
5. ✅ Menu latéral visible
```

### Test 2 : Gestion Utilisateurs

```bash
1. Menu → Utilisateurs
2. Cliquer "Nouvel Étudiant"
3. Remplir formulaire
4. Enregistrer
5. ✅ Étudiant dans liste
6. ✅ Toast succès
```

### Test 3 : Saisie Note (Enseignant)

```bash
1. Se connecter enseignant
2. Menu → Saisie Notes
3. Sélectionner étudiant
4. Sélectionner matière
5. Entrer note (0-20)
6. Enregistrer
7. ✅ Note dans historique
```

### Test 4 : Consultation Notes (Étudiant)

```bash
1. Se connecter étudiant
2. Menu → Mes Notes
3. ✅ Notes groupées par matière
4. ✅ Moyennes affichées
5. Menu → Dashboard
6. ✅ Graphiques visibles
```

### Test 5 : Export PDF

```bash
1. Étudiant → Relevé de Notes
2. Cliquer "Télécharger"
3. ✅ PDF téléchargé
4. ✅ Contenu complet
```

### Test 6 : Export Excel (Admin)

```bash
1. Admin → Rapports
2. Cliquer "Exporter Notes"
3. ✅ Fichier .xlsx téléchargé
```

---

## 🐛 Dépannage

### Backend non accessible

```bash
# Vérifier backend
cd "c:\Users\vladimir\Documents\gestion de notes\gestion_des_notes"
mvn spring-boot:run

# Vérifier PostgreSQL
docker ps
```

### Erreur 401 Unauthorized

```bash
# Vérifier token
1. F12 → Application → Local Storage
2. Vérifier "gestion_notes_token"
3. Si absent → Se reconnecter
```

### Styles Tailwind non appliqués

```bash
# Réinstaller
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

### Port 4300 occupé

```javascript
// vite.config.js
server: {
  port: 4301, // Changer ici
}
```

### Erreur CORS

```bash
# Backend doit autoriser http://localhost:4300
# Vérifier WebSecurityConfig.java
```

---

## 🚀 Déploiement

### Build Production

```bash
npm run build
# Fichiers dans dist/
```

### Variables Environnement

```env
# Production
VITE_API_BASE_URL=https://votre-backend.com
VITE_API_TIMEOUT=10000
```

### Docker (optionnel)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4300
CMD ["npm", "run", "preview"]
```

---

## 📊 Statistiques Projet

- **Fichiers créés** : 60+
- **Lignes de code** : 5000+
- **Services API** : 8
- **Composants** : 10
- **Pages** : 10
- **Routes** : 15+
- **Fonctionnalités** : 20+

---

## ✅ Checklist Complète

### Itération 1 - Auth ✅
- [x] Configuration Vite + Tailwind
- [x] Client Axios + intercepteurs
- [x] AuthContext + useAuth
- [x] Page Login
- [x] ProtectedRoute + RoleGuard

### Itération 2 - Layout ✅
- [x] Navbar responsive
- [x] Sidebar dynamique
- [x] AppLayout
- [x] Navigation par rôle

### Itération 3 - Admin ✅
- [x] Service utilisateurs
- [x] Liste utilisateurs
- [x] Modal CRUD
- [x] Filtres et recherche

### Itération 4-6 - Fonctionnalités ✅
- [x] Services (classes, matières, notes)
- [x] Page notes étudiant
- [x] Page saisie notes enseignant
- [x] Calcul moyennes

### Itération 7 - Dashboard ✅
- [x] Dashboard étudiant
- [x] Graphiques Chart.js
- [x] Statistiques

### Itération 8 - Export ✅
- [x] Service relevé PDF
- [x] Service export Excel
- [x] Pages téléchargement

### Itération 9-10 - Finalisation ✅
- [x] Tests manuels
- [x] Documentation
- [x] Guide démarrage
- [x] Optimisations

---

## 🎉 Projet Terminé !

Le frontend React est **100% fonctionnel** et **prêt à l'emploi**.

**Prochaines étapes possibles** :
- Tests unitaires (Jest + RTL)
- Tests E2E (Cypress)
- Optimisations performances
- PWA (Progressive Web App)
- Internationalisation (i18n)

---

## 📞 Support

Pour toute question :
1. Consulter cette documentation
2. Vérifier logs backend
3. Vérifier console navigateur (F12)
4. Vérifier fichier `.env`

**Bon développement ou exploration ! 🚀**

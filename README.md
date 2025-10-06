# 📚 Système de Gestion des Notes Universitaires

## 🎯 Description
Application web complète pour la gestion des notes universitaires avec authentification JWT et interface responsive.

## 🏗️ Architecture
- **Backend**: Spring Boot 3.x + MySQL
- **Frontend**: React 18 + Vite + TailwindCSS
- **Sécurité**: JWT avec rôles (Admin, Enseignant, Étudiant)
- **API**: REST avec documentation Swagger

## 🚀 Installation

### Prérequis
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.6+

### Backend
```bash
cd gestion_des_notes
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend-react
npm install
npm run dev
```

## 🔐 Authentification
- **Admin**: admin/admin
- **Enseignant**: teacher/teacher
- **Étudiant**: student/student

## 📊 Fonctionnalités

### 👨‍💼 Administrateur
- Gestion complète des utilisateurs
- Création/modification des classes et matières
- Attribution enseignants-classes
- Consultation de tous les rapports

### 👨‍🏫 Enseignant
- Saisie et modification des notes
- Consultation des étudiants assignés
- Génération de relevés PDF

### 👨‍🎓 Étudiant
- Consultation des notes par semestre
- Visualisation de la moyenne générale
- Téléchargement du relevé PDF

## 🌐 URLs d'accès
- **Application**: http://localhost:4300
- **API Documentation**: http://localhost:8088/swagger-ui.html
- **Backend**: http://localhost:8088

## 📋 Structure du Projet

### Backend (Spring Boot)
```
src/main/java/com/groupe/gestion_de_notes/
├── controllers/     # API REST endpoints
├── dto/            # Data Transfer Objects
├── model/          # Entités JPA
├── repository/     # Accès données
├── services/       # Logique métier
├── security/       # Configuration JWT
└── exceptions/     # Gestion erreurs
```

### Frontend (React)
```
src/
├── api/           # Services API
├── components/    # Composants réutilisables
├── contexts/      # Contextes React
├── pages/         # Pages principales
├── utils/         # Utilitaires
└── styles/        # Styles CSS
```

## 🔧 Configuration

### Base de données (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestion_notes
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

### JWT
```properties
gestion_.de_.notes.app.jwtSecret=mySecretKey
gestion_.de_.notes.app.jwtExpirationMs=86400000
```

## 📱 Interface Utilisateur

### Navigation par Rôle

#### Admin
- Tableau de bord
- Utilisateurs
- Classes
- Matières
- Inscriptions
- Enseignants-Classes
- Historique
- Rapports

#### Enseignant
- Tableau de bord
- Saisie Notes

#### Étudiant
- Tableau de bord
- Mes Notes
- Mes Matières
- Relevé de Notes

## 🛠️ API Endpoints Principaux

### Authentification
- `POST /api/auth/signin` - Connexion
- `POST /api/auth/signup` - Inscription

### Notes
- `GET /api/grades/student/{id}` - Notes étudiant
- `POST /api/grades` - Créer note
- `PUT /api/grades/{id}` - Modifier note
- `GET /api/grades/average/{id}` - Moyenne générale

### Utilisateurs
- `GET /api/admin/users/students/all` - Liste étudiants
- `GET /api/admin/users/teachers/all` - Liste enseignants
- `POST /api/admin/users/students` - Créer étudiant

### PDF
- `GET /api/transcript/generate/{id}` - Générer relevé PDF

## 🎨 Technologies Utilisées

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL
- JWT (jsonwebtoken)
- PDFBox (génération PDF)
- Swagger/OpenAPI

### Frontend
- React 18
- Vite
- TailwindCSS
- React Query
- React Router
- React Hook Form
- Axios

## 📄 Génération PDF
- Relevés professionnels avec en-tête
- Notes groupées par semestre (S1/S2)
- Moyenne générale mise en évidence
- Informations personnelles complètes

## 🔒 Sécurité
- Authentification JWT
- Autorisation basée sur les rôles
- Chiffrement des mots de passe (BCrypt)
- Protection CORS
- Validation des données

## 🐛 Dépannage

### Erreurs communes
- **401 Unauthorized**: Vérifier le token JWT
- **CORS Error**: Vérifier la configuration CORS
- **Connection refused**: Vérifier que MySQL est démarré

### Logs
- Backend: Console Spring Boot
- Frontend: Console navigateur (F12)

## 📈 Version
**Version actuelle**: 1.0.0

### Fonctionnalités implémentées
- ✅ Authentification complète
- ✅ Gestion des notes par semestre
- ✅ Interface responsive
- ✅ Génération PDF
- ✅ Administration complète

## 👥 Contributeurs
Projet développé dans le cadre d'un système de gestion universitaire.

## 📞 Support
Pour toute question technique, consulter:
- Documentation Swagger: http://localhost:8088/swagger-ui.html
- Logs de l'application
- Code source commenté

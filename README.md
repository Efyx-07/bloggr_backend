# Bloggr

#### _- Partie backend -_

#### Application de création et gestion d'articles de blog

# • • •

## Description

Cette application permet à un utilisateur de créer et gérer ses articles de blog. Le but est de générer une API avec la liste des articles qui pourront être affichés sur un site externe (par exemple un site vitrine).

## Fonctionnalités

- **Connexion et authentification** : L'application n'autorise qu'un seul utilisateur dont les données seront préalablement renseignées dans la base de données par l'administrateur. Possibilité de modifier le mot de passe via l'application.
- **Création d'un article** : Création d'un article avec les champs 'Titre', 'Image de couverture', 'Corps de l'article' et 'Mots-clé'.
- **Modification d'un article** : Chaque donnée peut être modifiée et mise à jour.
- **Publication controlée** : Un article nouvellement créé a un statut "En attente de publication". Pour être "Publié", l'utilisateur devra le publier manuellement après contrôle. L'API à récupérer sur un site tierce ne concernera que les articles publiés (voir section Endpoints).

## Technologies utilisées

- **Node.js / Nest.js**
- **Typescript**: Pour le typage des données
- **Typeorm**: Pour l'interface entre le backend et la base de données MySQL
- **Class-validator**: Pour la gestion des DTOs
- **JWT**: Pour la génération des tokens d'authentification
- **Bcrypt**: Pour le cryptage des mot de passe
- **Jest**: Pour les tests unitaires

## Configuration

### Base de données

Ce backend communique avec une base de données relationnelle MySQL à mettre en place préalablement. La structure est fournie [ici](https://github.com/Efyx-07/bloggr_backend/blob/publication/bloggr.db.sql)

1. Créez un fichier `.env` à la racine du projet et renseignez les données suivantes :
   ```plaintext
    DB_HOSTNAME=yourhostname
    DB_USERNAME=yourusername
    DB_PASSWORD=yourdbpassword
    DB_NAME=yourdbname
    PORT=port
   ```
2. Assurez-vous que votre fichier `.env` est ignoré par Git. Le fichier .gitignore doit inclure .env pour éviter que la clé ne soit exposée publiquement.

### Initialisation de l'administrateur

L'application étant réservée à un seul administrateur, celui-ci doit être initialisé en base de donnée.

1. Dans le fichier `.env` à la racine du projet, renseignez les données suivantes :
   ```plaintext
    ADMIN_LASTNAME=adminlastname
    ADMIN_FIRSTNAME=adminfirstname
    ADMIN_EMAIL=adminemail
    ADMIN_PASSWORD=adminpassword
   ```
2. Assurez-vous que votre fichier `.env` est ignoré par Git. Le fichier .gitignore doit inclure .env pour éviter que la clé ne soit exposée publiquement.

3. Pour initialiser l'administrateur, lancez le script de setup avec cette commande: 
```bash
$ npx ts-node initAdmin.ts
```

### Authentification

L'authenfication fonctionne avec JWT. Vous aurez besoin de définir une clé secrète et un temps d'expiration.

1. Dans le fichier `.env` à la racine du projet, renseignez les données suivantes :
   ```plaintext
    AUTH_SECRETKEY=secretkey
    AUTH_EXPIRESIN=expiresin
   ```
2. Assurez-vous que votre fichier `.env` est ignoré par Git. Le fichier .gitignore doit inclure .env pour éviter que la clé ne soit exposée publiquement.


## Installation

1. Clonez le dépôt:
   ```plaintext
   git clone https://github.com/Efyx-07/bloggr_backend.git
   ```
2. Accédez au projet:
   ```plaintext
   cd bloggr_backend
   ```
3. Installez les dépendances:
   ```plaintext
   $ npm install
   ```
4. Configurez votre backend avec le fichier `.env` comme décrit dans la section Configuration.
5. Lancez le serveur de développement:
   ```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
    ```

## Tests

Des tests unitaires ont été écrits pour assurer le bon fonctionnement des fonctionnalités critiques de l’application. Pour les exécuter, utilisez la commande suivante

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
## Endpoints

### Admin / Password
| **Method** | **URL**                      | **Description**       |
|------------|------------------------------|-----------------------|
| POST       | /admins/login                | Connexion             |
| PUT        | /passwords/update-password   | Mise à jour du mot de passe|

### Articles
| **Method** | **URL**                      | **Description**                      |
|------------|------------------------------|--------------------------------------|
| POST       | /articles/create-article     | Créer un article                     |
| PUT        | /articles/publish-article/:id| Change le statut de publication      |
| GET        | /articles                    | Retourne tous les articles créés     |
| GET        | /articles/published-articles | Ne retourne que les articles publiés (API à utiliser dans le site externe)|
| GET        | /articles/published-articles/:id | Retourne un article publié par son ID (API à utiliser dans le site externe)|
| GET        | /articles/:id                | Retourne un article par son ID parmi tous les articles|
| PUT        | /articles/:id                | Met à jour article                    |
| DELETE     | /articles/:id                | Supprime un article                   |


## Utilisation

### Interface

Ce dépôt ne concerne que la partie backend de l'application. Celle-ci fonctionne avec une interface créée en NextJs.  
 <a href="https://github.com/Efyx-07/bloggr_frontend">Accéder au dépôt du frontend</a>

### Utilisation dans une application tierce

L'objectif final de cette application est de récupérer l'API des articles avec le statut "publié" pour les afficher dans une application tierce (par exemple un site vitrine).
Pour avoir le contrôle sur les articles à afficher, il est important de n'y utiliser que les endpoints concernant "published-articles", décrits dans la section "Endpoints".

**Bonne découverte !**

FX.
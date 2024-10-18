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
- **Typescript**
- **Typeorm**: Pour l'interface entre le backend et la base de données MySQL
- **Class-validator**: Pour la gestion des DTOs

## Base de données

Ce backend communique avec une base de données relationnelle MySQL à mettre en place préalablement. La structure est fournie [ici](https://github.com/Efyx-07/bloggr_backend/blob/publication/bloggr.db.sql)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

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


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

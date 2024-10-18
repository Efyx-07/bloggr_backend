# Bloggr

#### _- Partie backend -_

#### Application de création et gestion d'articles de blog

# • • •

## Description

Cette application permet à un utilisateur de créer et gérer ses articles de blog. Le but est de générer une API avec la liste des articles qui pourront être affichés sur un site externe (par exemple un site vitrine).

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

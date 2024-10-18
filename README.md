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
| POST       | /admins/login                | Login                 |
| PUT        | /passwords/update-password   | Update password       |

### Articles
| **Method** | **URL**                      | **Description**                      |
|------------|------------------------------|--------------------------------------|
| POST       | /articles/create-article     | Create an article                    |
| PUT        | /articles/publish-article/:id| Change an article published status   |
| GET        | /articles                    | Get all the articles                 |
| GET        | /articles/published-articles | Get only published articles (use it in the external website)|
| GET        | /articles/published-articles/:id | return a published article by id (use it in the external website)|
| GET        | /articles/:id                | Get an article by id among all the articles|
| PUT        | /articles/:id                | update an article                    |
| DELETE     | /articles/:id                | delete an article                    |


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

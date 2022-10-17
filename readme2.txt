

## Envinroment setup

1) Create database
2) Copy .env.example to .env and fill with database credentials.

To install dependencies, run

``` bash
npm install
```
3)Build:

``` bash
npm run build
```
4) Migrations:

``` bash
npx sequelize-cli db:migrate
```

5) Seeders:

``` bash
npx sequelize-cli db:seed:all
```

## Start local server

``` bash
npm run dev
```
## Start local server with nodemon
``` bash
npm run dev:watch
```

## Test users

| Email             | Password  |
|-------------------|-----------|
| admin@admin.admin | admin     |
| admin2@admin.admin | testAdmin |
| user@user.user | user      |
|user2@user.user| user2     |
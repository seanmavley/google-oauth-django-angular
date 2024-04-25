# Google Oauth Django Angular

This repository contains the most minimum setup needed to Authenticate via API using Django + REST Framework + Angular on the frontend.

## Run the repository

- Download/Clone the repository
- Run `cd backend && pip install -r requirements`
- Run `cd frontend && bun install`
- Create a `environment.development.ts` file in the `src/environments/` folder and update with your Google ID

```
// environment.development.ts
export const environment = {
  google_id: '<YOUR_GOOGLE_ID>.apps.googleusercontent.com'
};
```

- Create a `.env` file in the root of your django project (in this case, `backend` and update with your Google ID)

```
# .env
GOOGLE_OAUTH2_CLIENT_ID='YOUR_GOOGLE_ID.apps.googleusercontent.com'
GOOGLE_OAUTH2_CLIENT_SECRET='YOUR_GOOGLE_SECRET'
```

- Run both the django and angular servers

```
cd backend && python manage.py runserver
cd frontend && ng serve
```

- Visit `http://localhost:4200` for the frontend, and visit `http://localhost:8000` for the django backend
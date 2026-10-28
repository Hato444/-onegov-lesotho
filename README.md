# OneGov Lesotho

React (Vite) front end and Node.js (Express) back end, built from the `onegov-lesotho.html` prototype.
All screens and styles from the prototype are kept. Data now comes from the API instead of being hard-coded in the page.

## Run it

You need Node.js 18.11 or newer.

```bash
npm install
cp server/.env.example server/.env     # then edit the values
npm run dev
```

Open http://localhost:5173 and sign in:

- Username: `GOV-04417`
- Password: the `DEMO_PASSWORD` you set in `server/.env`
  (if you skip the `.env` file in development, the password is `OneGov!2026`)

## Run it for real (one server)

```bash
npm run build
JWT_SECRET=<32+ random characters> DEMO_PASSWORD=<password> npm start
```

Express serves the built React app and the API together on http://localhost:4000.
In production the server will not start without `JWT_SECRET`. Serve it over HTTPS, because the session cookie is marked `Secure`.

## Folders

```
server/src/index.js    app setup, security headers, rate limits
server/src/auth.js     login, logout, session check
server/src/routes.js   citizens, search, notifications, analytics, service requests
server/src/data.js     seed data from the prototype (in memory)
client/src/            React app: views/, components/, api.js, constants.js
```

## Security that is included

- Passwords are hashed with bcrypt. Login says "incorrect username or password" without saying which one.
- Sign-in uses a JWT stored in an `httpOnly`, `SameSite=Strict` cookie, so page scripts cannot read it. It expires after 1 hour, or 8 hours with "Keep me signed in".
- Login is limited to 10 failed tries per 15 minutes per IP. All API calls are limited too.
- Every API route except login needs a valid session.
- Changing requests (POST) must send an `X-Requested-With` header, which stops other websites from sending them for you.
- Helmet adds security headers, including a Content Security Policy.
- Inputs are checked on the server (search type, lengths, allowed departments and services).
- The server writes an audit line for each sign in, citizen search, record view and request. Search text is not logged.
- React escapes all text, so records cannot inject HTML.

## Good next steps

- Replace the in-memory data and the demo officer with a database (for example PostgreSQL).
- Add roles, so a Police officer cannot read Pension data.
- Add password reset by email, and two-factor sign in for officers.
- The department tables load full records. Return only the columns each table shows.

## Small changes from the prototype

- Advanced filters on Citizen Search now work (they were not applied before).
- National ID search ignores spaces, so `1990010123459` finds `1990 0101 2345 9`.
- "Keep me signed in" now changes how long the session lasts.
- Notifications link to a citizen ID instead of matching on the name.

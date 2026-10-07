# Email Campaign Dashboard

[![CI](https://github.com/SzymonRojek/email-campaign-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/SzymonRojek/email-campaign-dashboard/actions/workflows/ci.yml)

A full-stack web app for running e-mail campaigns: manage subscribers, write campaigns and send them to the chosen active subscribers. Built with **React, TypeScript and Express**, data stored in **Airtable**, covered by **automated tests** and deployed automatically with **CI/CD**.

## Live demo

| | link | login password |
| --- | --- | --- |
| **Production** | [email-campaign-dashboard-app.onrender.com](https://email-campaign-dashboard-app.onrender.com/) | `admin` |
| Staging (newest changes) | [email-campaign-dashboard-staging.onrender.com](https://email-campaign-dashboard-staging.onrender.com/) | `admin` |

> Hosted on a free plan - after a break the first load can take up to a minute.
>
> **Demo mode:** the password is public, so sending real e-mails is turned off (anybody could send e-mails from my account). "Send email" saves the campaign as `sent` and the app says clearly that no e-mail was really sent.
>
> Feel free to add, edit and remove anything - the example data comes back every night.

## What the app does

- **Dashboard** - the numbers at a glance (subscribers, active, sent campaigns), recent campaigns and newest subscribers, quick actions
- **Subscribers** - list (newest first, sortable by date), search by name or e-mail, filter by status (active / pending / blocked), remove; details, adding and editing in a side panel over the list (with a link of its own, quick activation of pending / blocked subscribers); one e-mail can belong to one subscriber only
- **CSV import / export** - export what the list shows; import a file (comma or semicolon) with a preview that checks every row like the form, finds duplicates and imports only the valid rows
- **Campaigns** - write a campaign, save it as a draft or send it (after a confirmation with the number of recipients), edit drafts (click the row), duplicate any campaign as a new draft, search, filter by status, sort by date
- **No lost work** - leaving a form with unsaved changes (another page, "back", closing the panel or the tab) asks first
- **Choose recipients** - send to all active subscribers or only to the selected ones
- **Login** - the app and its data are available only after logging in
- **Light and dark mode** - light, dark or like the operating system, remembered in the browser; works on phones (the lists become cards)

## Highlights

- **Full-stack TypeScript** - React client and Express server, strict mode
- **Secure backend** - the Airtable API key never reaches the browser; login with signed tokens and protection against password guessing
- **Automated testing** - 69 server and 80 client unit tests, 47 end-to-end tests in a real browser (Playwright)
- **CI/CD** - every pull request is checked by GitHub Actions; `dev` deploys to staging and `main` to production automatically
- **Team-style Git workflow** - feature branches, pull requests, staging before production

## Tech stack

| area | technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), React Router 7, TanStack Query, React Hook Form + Yup |
| Backend | Node.js, Express, TypeScript, Airtable REST API |
| Testing | Jest, Vitest, React Testing Library, supertest, Playwright, Postman |
| DevOps | GitHub Actions, Render (`render.yaml` Blueprint) |

## How it works

<p align="center">
  <img src="./client/src/img/concept.png" alt="Concept of the app">
</p>

```
React app  ->  Express API (/api, login, proxy)  ->  Airtable
```

The React app never talks to Airtable directly. The Express server works as a **proxy**: it keeps the Airtable key and base id in environment variables, calls Airtable and returns only the data - the key is not visible in the browser or in the response headers.

The server also handles the **login**: `POST /api/auth/login` checks the password and returns a signed token valid for 8 hours. All data endpoints require it in the `Authorization: Bearer <token>` header, and after 5 wrong passwords the IP is blocked for 15 minutes.

The goal of the project was a CRUD application - Create, Read, Update and Delete over a REST API - connected to [Email.js](https://www.emailjs.com/) to send a personalized e-mail with one click to all chosen active subscribers.

<details>
<summary>Example of the e-mail template</summary>

<img src="./client/src/img/exampleEmails.png" alt="Example e-mails">

</details>

<details>
<summary>API endpoints</summary>

All endpoints are under `/api`:

| method | endpoint | auth |
| ------ | -------- | ---- |
| `GET` | `/api/health` | - |
| `POST` | `/api/auth/login` | - |
| `GET`, `POST` | `/api/subscribers` | token |
| `POST` | `/api/subscribers/import` | token |
| `GET`, `PATCH`, `DELETE` | `/api/subscribers/:id` | token |
| `GET`, `POST` | `/api/campaigns` | token |
| `GET`, `PATCH`, `DELETE` | `/api/campaigns/:id` | token |
| `POST` | `/api/demo/reset` | reset key (only production) |

Airtable uses token-based authentication (`Authorization: Bearer <key>` header) - the key is sent in the header, not as an `api_key` query parameter, which is the less secure option.

<img src="./client/src/img/responseHeaders.png" alt="Response headers without the Airtable key">

</details>

<details>
<summary>Daily reset of the demo data</summary>

The login password is public, so visitors change the data. Every night a scheduled GitHub Action (`.github/workflows/demo-reset.yml`) wakes the server up and calls `POST /api/demo/reset` with a secret key. The server creates the examples from `server/demo/seedData.ts` again and only then deletes the old records (so an error never leaves an empty table) - the dates of the examples are counted back from the day of the reset, so they never look old.

To save Airtable API calls (the free plan has a monthly limit), the server first compares both tables with the examples and **skips the reset when nobody changed anything** - unless the examples are older than 7 days. The endpoint exists only where `DEMO_RESET_KEY` is set (production), and two resets never run at the same time.

</details>

## Testing

Every pull request runs in GitHub Actions: type checking, unit tests, production build and end-to-end tests.

- **Server unit tests** (Jest + supertest) - login, tokens, protection against password guessing, all endpoints, error handling, the demo data reset; Airtable is mocked
- **Client unit tests** (Vitest + React Testing Library) - helpers, form validation, API client, hooks, login form, choosing recipients
- **End-to-end tests** (Playwright) - real user flows in a browser on the production build: logging in, adding / editing / removing subscribers, drafting and sending campaigns, navigation. They run against a fake Airtable (`e2e/mock-airtable.ts`), so they never touch real data.

<details>
<summary>Earlier: API tests in Postman</summary>

I have used **Postman** to test valid, invalid, authorised and unauthorised requests. The screenshots show the old endpoints - today they live under `/api/...` and need a token from `/api/auth/login`.

<img src="./client/src/img/postman.png" alt="Postman">

Example of API tests:

<img src="./client/src/img/tests.png" alt="Postman tests">

Results of the API tests run automatically by Postman's runner:

<img src="./client/src/img/runnerTests.png" alt="Postman runner results">

</details>

## Running locally

1. Create `.env` in the project root:

```
REACT_APP_DB_ID=appXXXXXXXXXXXXXX     # Airtable base id
REACT_APP_API_KEY=patXXXXXXXXXXXXXX   # Airtable personal access token
ADMIN_PASSWORD=...                    # password for the login form
AUTH_SECRET=...                       # random string for signing login tokens
# DEMO_RESET_KEY=...                  # optional - turns on POST /api/demo/reset (it wipes the base!)
```

2. Install and start (two terminals):

```bash
npm install && npm start                       # API on http://localhost:5000
cd client && npm install && npm start          # app on http://localhost:3000
```

### Running the tests

| command | what |
| --- | --- |
| `npm run typecheck` | TypeScript (server + client) |
| `npm install --prefix server && npm test` | server unit tests |
| `cd client && npm test` | client unit tests |
| `npm run build`<br>`npm install --prefix e2e && npm run test:e2e` | end-to-end tests (need the production build) |

On macOS 12 (no Playwright Chromium) run the e2e tests on the installed Chrome: `PW_CHANNEL=chrome npm run test:e2e`.

## Git workflow and deployment

| branch | environment on Render |
| ------ | --------------------- |
| `main` | production - [demo](https://email-campaign-dashboard-app.onrender.com/) |
| `dev`  | staging - [staging demo](https://email-campaign-dashboard-staging.onrender.com/) |

1. Every change starts on a short-lived branch off `dev` (`feature/...`, `fix/...`, `chore/...`).
2. Pull request into `dev` - CI runs and the PR must have no conflicts. A human reviews and **squash-merges** it; Render deploys it to staging.
3. After checking staging - pull request `dev -> main`, CI again, a human merges it with a **merge commit** (not squash, so `dev` and `main` do not drift apart); Render deploys production.

**Hotfix** - only for an urgent fix of production:

1. Branch `hotfix/...` off `main`.
2. Pull request into `main` - CI runs, a human merges it; Render deploys production.
3. Right after that, pull request `main -> dev` (merge commit) - otherwise staging would run a different version than production and new work on `dev` could conflict with the fix.

Both services are defined in `render.yaml` (free plan).

## Roadmap

- Sending to a test inbox (Ethereal) with previews of the sent e-mails
- E-mail templates with personalization (`{{name}}`) and a preview before sending
- Campaign details and history (recipients, sent date) with a CSV export of the recipients
- An unsubscribe link in every e-mail

## Credits

- Images from the [Email.js](https://www.emailjs.com/) website.

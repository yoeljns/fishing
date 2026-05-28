# Fishing Catch Journal

A single-user fishing journal: log catches (species, length, weight, date, location, bait, notes) and track which species from a built-in list you've caught vs not yet caught.

Built with Next.js 15 (App Router) + Vercel Postgres. Hosted on Vercel.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in values:
   ```bash
   cp .env.example .env.local
   ```

3. Provision a Postgres database. Either:
   - **Vercel**: create a Postgres database from the Vercel dashboard, link the project (`vercel link`), then `vercel env pull .env.local`.
   - **Local**: `docker run --name fishing-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fishing -p 5432:5432 -d postgres:16`.

4. Run migrations and seed the species list:
   ```bash
   npm run migrate
   npm run seed
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

   Open http://localhost:3000 and log in with `APP_PASSWORD`.

## Deploy

1. Push the repository to GitHub.
2. Import the project on Vercel.
3. Attach a Postgres database in the Storage tab (Neon works — its `POSTGRES_URL` env var is consumed directly).
4. Set environment variables in the Vercel dashboard:
   - `APP_PASSWORD` — the password you'll use to log in
   - `SESSION_SECRET` — a long random string (rotate to log yourself out)
   - `SETUP_TOKEN` — a random string used once to initialize the database schema
5. After the first successful deploy, initialize the schema and seed species by hitting:
   ```
   https://<your-deployment>.vercel.app/api/setup?token=<SETUP_TOKEN>
   ```
   This is idempotent — safe to re-run. It returns JSON with the row counts.

   Alternative for local setup against the prod DB:
   ```bash
   vercel env pull .env.local
   npm run migrate && npm run seed
   ```

## How it works

- `/login` — single password input
- `/catches` — list of all logged catches with edit/delete
- `/catches/new` — log a new catch
- `/species` — built-in checklist of species; filter by water type/region, see caught vs not caught
- `/stats` — totals and personal bests

Lengths and weights are stored in metric (cm/kg). The Nav has a unit toggle that switches the display to imperial (in/lb); your preference is saved in the browser.

Custom species (typed instead of picked from the list) are auto-added to the species table under the "Custom" region so they show up in the checklist.

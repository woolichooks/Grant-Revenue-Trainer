# Grant-Revenue-Trainer

Nonprofit Revenue Recognition. Read a real grant agreement and make the seven calls that drive revenue recognition under ASC 958-605 and ASU 2016-14.

A static Vite + React + TypeScript single-page app. Game progress is stored in
the browser (`localStorage`); each player's **solve time per level** is also
recorded to a Supabase table for your own analysis.

## Develop

```bash
npm install
npm run dev        # local dev server
npm test           # run the test suite
npm run build      # type-check + production build → dist/
```

## Deploy (Cloudflare Pages)

Connect the repo in Cloudflare Pages with:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION = 22` (Vite 8 needs Node ≥ 20.19 / 22.12) |

## Collecting solve times (Supabase)

Each time a player finishes a level, the app inserts one row — player name,
level, score, and active solve time — into a Supabase table. Players enter
their name once (stored locally). The data is **write-only from the app**: only
you can read it, in the Supabase dashboard.

### One-time setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the project, open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and **Run**. This creates the
   `level_times` table with insert-only row-level security.
3. Grab **Project URL** and the **anon public** key from
   **Project Settings → API**.
4. Add these as **build-time environment variables** in Cloudflare Pages
   (Settings → Environment variables, for *both* Production and Preview), then
   redeploy:

   ```
   VITE_SUPABASE_URL       = https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY  = your-anon-public-key
   ```

   For local development, put the same two variables in a `.env.local` file
   (already git-ignored).

If these variables are absent the app still runs normally — it just skips
recording times.

### Viewing the data

In the Supabase dashboard use **Table editor → `level_times`**, or run SQL,
e.g.:

```sql
-- Every solve, newest first
select player_name, level_label, score, active_ms / 1000.0 as seconds, completed_at
from level_times
order by completed_at desc;

-- Average and fastest time per level
select level_label,
       count(*)                            as players,
       round(avg(active_ms) / 1000.0, 1)   as avg_seconds,
       round(min(active_ms) / 1000.0, 1)   as fastest_seconds
from level_times
group by level_label
order by level_label;
```

### Notes

- **Active play time** is accumulated while a player is on a level and is banked
  across resumes (leaving and coming back). It is not wall-clock time across
  days; idle time with the tab open still counts.
- The anon key is safe to expose: row-level security allows `insert` only, so
  the public app can write times but cannot read, edit, or delete any data.
- Replaying a level records a new row.
- Submissions that fail (offline) are parked in `localStorage` and retried on
  the next load, so a flaky connection doesn't lose a result.

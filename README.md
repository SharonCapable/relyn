# Relyn — CRM

A modern, unified CRM platform built with React + Firebase. Streamlines lead management,
pipeline tracking, and team collaboration with a beautiful web interface.

---

## Tech Stack

| Layer       | Choice                          |
|-------------|----------------------------------|
| Frontend    | React 18 + Vite                  |
| Styling     | Tailwind CSS                     |
| Auth        | Firebase Auth (Google + Email)   |
| Database    | Firestore                        |
| Hosting     | Firebase Hosting                 |

---

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthProvider.jsx       # Auth context
│   │   └── ProtectedRoute.jsx     # Route guard
│   ├── leads/
│   │   └── LeadFormDrawer.jsx     # Add / edit lead form
│   └── shared/
│       └── AppShell.jsx           # Sidebar + layout
├── hooks/
│   └── useAuth.js                 # Auth state + email/password support
├── lib/
│   ├── firebase.js                # Firebase init  ← PUT YOUR CONFIG HERE
│   └── db.js                      # All Firestore helpers + schema
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx          # KPI overview
│   ├── LeadsPage.jsx              # Tab 1 — Inbound Leads
│   └── PipelinePage.jsx           # Tab 2 — Scoping & Pipeline
├── styles/
│   └── index.css
├── App.jsx                        # Router
└── main.jsx                       # Entry point
```

---

## Setup Instructions

### 1. Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new Firebase project
3. Enable **Firestore** (production mode)
4. Enable **Authentication** → Sign-in method → **Google**
   - Set the authorised domain to include your deployment URL
5. Enable **Hosting**

### 2. Add Firebase Config

Open `src/lib/firebase.js` and replace all `REPLACE_WITH_*` values with your
actual project config. Find these at:

> Firebase Console → Project Settings → Your Apps → Web app → SDK setup and configuration

```js
const firebaseConfig = {
  apiKey:            '...',
  authDomain:        '...',
  projectId:         '...',
  storageBucket:     '...',
  messagingSenderId: '...',
  appId:             '...',
}
```

> ⚠️ These values are safe to commit — they are scoped to your Firebase project
> and protected by Firestore security rules + domain restrictions.

### 3. Update .firebaserc

Replace `YOUR_FIREBASE_PROJECT_ID` in `.firebaserc` with your actual project ID.

### 4. Install & Run

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
```

### 5. Deploy

```bash
npm install -g firebase-tools   # first time only
firebase login                  # authenticate with your Firebase account
npm run deploy                  # builds React app + deploys to Firebase Hosting
```

---

## Auth & Security

- Sign-in supports **Google OAuth** and **Email/Password** authentication
- All authenticated users can access the platform
- Server-side security is enforced via `firestore.rules` — only verified, authenticated users
  can read or write data. No client-side auth bypass is possible.

---

## Data Model

### `leads` collection  (Tab 1 — Inbound Leads)

| Field               | Type      | Notes                              |
|---------------------|-----------|------------------------------------|
| `leadId`            | string    | Auto: REL-001, REL-002, …          |
| `firstName`         | string    |                                    |
| `lastName`          | string    |                                    |
| `email`             | string    |                                    |
| `phone`             | string    |                                    |
| `company`           | string    |                                    |
| `roleTitle`         | string    |                                    |
| `country`           | string    |                                    |
| `howFoundAya`       | string    |                                    |
| `projectDescription`| string    |                                    |
| `assignedTo`        | string    |                                    |
| `responseStatus`    | string    |                                    |
| `businessUnit`      | string    |                                    |
| `serviceLineInterest`| string   |                                    |
| `stage`             | string    | New → Contacted → … → Move to Scoping |
| `leadScore`         | number    | Auto-calculated 0–100              |
| `callDate`          | string    |                                    |
| `dataModality`      | string    |                                    |
| `budget`            | number    |                                    |
| `timeline`          | string    |                                    |
| `decisionMaker`     | string    |                                    |
| `useCaseSummary`    | string    |                                    |
| `createdAt`         | timestamp |                                    |
| `updatedAt`         | timestamp |                                    |
| `createdBy`         | string    | Firebase UID                       |

### `pipeline` collection  (Tab 2 — Scoping & PoC)

| Field                | Type      | Notes                              |
|----------------------|-----------|------------------------------------|
| `leadId`             | string    | Links back to leads collection     |
| `accountName`        | string    | Deal / project name                |
| `company`            | string    |                                    |
| `owner`              | string    | BD Owner                           |
| `pipelineStage`      | string    | Scoping → PoC → Negotiation → Closed Won/Lost |
| `serviceLine`        | string    |                                    |
| `dataModality`       | string    |                                    |
| `annotationType`     | string    |                                    |
| `platformRequired`   | string    |                                    |
| `volumeUnits`        | string    |                                    |
| `volumeEstHours`     | number    |                                    |
| `pocStartDate`       | string    |                                    |
| `pocEndDate`         | string    |                                    |
| `pocCost`            | number    |                                    |
| `pocOutcome`         | string    |                                    |
| `hourlyRate`         | number    |                                    |
| `estDealValue`       | number    |                                    |
| `pricingModel`       | string    |                                    |
| `estGrossMargin`     | number    |                                    |
| `financeApproved`    | boolean   |                                    |
| `sowStatus`          | string    | Not Started / Draft / Sent / Signed |
| `winProbability`     | number    | 0–100                              |
| `weightedValue`      | number    | Auto: estDealValue × winProbability/100 |
| `contractType`       | string    | One-off / Retainer / Pilot         |
| `blockers`           | string    |                                    |
| `nextSteps`          | string    |                                    |
| `riskNotes`          | string    |                                    |
| `createdAt`          | timestamp |                                    |
| `updatedAt`          | timestamp |                                    |
| `createdBy`          | string    |                                    |

---

## MVP Scope (this repo)

- [x] Google SSO restricted to @ayadata.ai
- [x] Inbound leads — add, edit, list, search
- [x] Auto lead ID generation (AYA-001, AYA-002…)
- [x] Lead score calculation (mirrors Excel formula)
- [x] Missing field warnings (mirrors Excel ⚠ logic)
- [x] One-click "Move to Scoping" → creates pipeline deal
- [x] Pipeline view with stage filtering and deal cards
- [x] Dashboard KPIs (total leads, conversion rate, weighted pipeline, revenue)
- [x] Firestore security rules (server-side domain enforcement)

## Next Iterations

- [ ] Pipeline deal edit drawer (full Tab 2 field editing)
- [ ] Leads Progression analytics page (monthly breakdown by service line)
- [ ] Export to CSV
- [ ] Email notifications on stage changes (Firebase Functions)
- [ ] Role-based views (BD vs. C-level read-only)
- [ ] Activity log / notes per lead

# The Men's Circle Website - Session Handoff

**Date:** December 12, 2025
**Status:** Prototype built and deployed, needs Google Sheets setup to be functional

---

## What Was Built

### 1. Proposal Site (Complete)
- **URL:** https://tmc-site-proposal.sailorskills.com
- **Repo:** https://github.com/standardhuman/tmc-proposal
- **Location:** `proposal-site/`
- **Purpose:** Stakeholder presentation of the website proposal and PRD

### 2. App Prototype (Deployed, needs config)
- **URL:** https://app-sailorskills.vercel.app (needs env vars to work)
- **Repo:** https://github.com/standardhuman/tmc-app
- **Location:** `app/`
- **Purpose:** Working prototype of the actual TMC website

---

## App Architecture

```
app/
├── api/                    # Vercel serverless functions
│   ├── _lib/
│   │   ├── auth.js         # JWT token helpers
│   │   └── sheets.js       # Google Sheets API helpers
│   ├── auth/
│   │   ├── request.js      # Send magic link
│   │   └── verify.js       # Verify magic link token
│   ├── announcements.js
│   ├── config.js           # Site settings (new)
│   ├── contact.js
│   ├── members.js
│   ├── onboarding.js
│   ├── resources.js
│   └── upload.js
├── src/
│   ├── lib/
│   │   ├── api.js          # Frontend API client
│   │   ├── auth.js         # Session management
│   │   └── router.js       # Hash-based routing
│   ├── pages/
│   │   ├── home.js         # Public landing page
│   │   ├── login.js        # Magic link request
│   │   ├── verify.js       # Magic link verification
│   │   ├── onboarding.js   # New member profile completion
│   │   ├── dashboard.js    # Member home
│   │   ├── directory.js    # Member directory
│   │   ├── resources.js    # Documents/guidelines
│   │   ├── announcements.js
│   │   └── settings.js     # Admin config (new)
│   ├── main.js             # Router setup
│   └── styles.css          # All styles
└── vercel.json             # Deployment config
```

---

## Features Implemented

### Public
- Landing page with TMC purpose statement
- Contact form (writes to sheet + emails notification)
- Member login link

### Authentication
- Magic link login (no passwords)
- Roster sheet = access control list
- 15-min token expiry, 30-day sessions

### Member Onboarding (for "pending" status members)
- Blocks access to member area until complete
- Collects: name, phone, team, emergency contact, sponsor, how they found TMC, photo
- Teams: No, Bloom, Roar, Electric
- Updates roster sheet and changes status to "active"

### Member Area
- Dashboard with quick links and recent announcements
- Directory (searchable member list)
- Resources (documents organized by category)
- Announcements (chronological updates)
- Settings (new - configure dynamic content)

### Settings Page
- Circling location (name, address, directions URL, notes)
- Google Sheets URLs for data sources
- Quick links (calendar, communication channel)
- Stores in Config sheet

---

## Environment Variables Needed

Set these in Vercel project settings:

```
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Sheet IDs (from Google Sheets URLs)
ROSTER_SHEET_ID=1abc...xyz
RESOURCES_SHEET_ID=1abc...xyz  (or same as ROSTER if using tabs)
ANNOUNCEMENTS_SHEET_ID=1abc...xyz
CONTACTS_SHEET_ID=1abc...xyz
CONFIG_SHEET_ID=1abc...xyz

# Email (Resend)
RESEND_API_KEY=re_...
NOTIFICATION_EMAIL=contact@themenscircle.com

# Auth
JWT_SECRET=a-long-random-secret-string
```

---

## Google Sheets Structure Needed

### Roster Sheet (tab: "Roster")
| Column | Purpose |
|--------|---------|
| email | Login identifier (required) |
| name | Display name |
| first_name | First name |
| last_name | Last name |
| phone | Contact phone |
| team | No, Bloom, Roar, or Electric |
| status | "pending" or "active" |
| photo_url | Photo URL |
| emergency_contact_name | Emergency contact |
| emergency_contact_phone | Emergency phone |
| emergency_contact_relationship | Relationship |
| sponsor | Who sponsored them |
| how_found | How they found TMC |
| onboarding_completed | Timestamp |

### Resources Sheet (tab: "Resources")
| Column | Purpose |
|--------|---------|
| title | Resource title |
| description | Brief description |
| category | Grouping (e.g., "Guidelines", "Agendas") |
| content | Full content text |

### Announcements Sheet (tab: "Announcements")
| Column | Purpose |
|--------|---------|
| date | Announcement date |
| title | Headline |
| body | Full content |
| author | Who posted it |

### Contacts Sheet (tab: "Contacts")
| Column | Purpose |
|--------|---------|
| timestamp | When submitted |
| name | Submitter name |
| email | Submitter email |
| message | Their message |

### Config Sheet (tab: "Config")
| Column | Purpose |
|--------|---------|
| key | Setting name |
| value | Setting value |

---

## Next Steps

1. **Create Google Cloud service account**
   - Enable Sheets API
   - Create service account and download credentials
   - Share sheets with service account email

2. **Set up Google Sheets**
   - Create sheets with structure above
   - Add at least one test member with "pending" status

3. **Configure Vercel environment variables**
   - Add all env vars listed above
   - Redeploy

4. **Configure custom domain**
   - Add DNS record: `A tmc-app 76.76.21.21`
   - Or use tmc-app.sailorskills.com once DNS propagates

5. **Test the flow**
   - Public landing page
   - Contact form submission
   - Magic link login
   - Onboarding flow
   - Member area pages

---

## Design Direction

- **Colors:** Deep Charcoal (#2D2D2D), Warm Earth (#8B5A2B), Soft Cream (#FAF8F5), Ember Orange (#D4652F), Forest Shadow (#4A5D4A)
- **Typography:** Playfair Display (headlines), Source Sans 3 (body)
- **Feel:** Grounded, earthy, warm, masculine without being aggressive

---

## Purpose Statement (use prominently)

> "In the Men's Circle, we forge brotherhood, inspire transformation, and support men in living on purpose."

---

## Files Reference

| File | Purpose |
|------|---------|
| `docs/PRD.md` | Full product requirements |
| `docs/plans/2025-12-11-architecture-design.md` | Technical design |
| `CLAUDE.md` | Project context for Claude Code |
| `HANDOFF.md` | This file |

---

## Open Items

- [ ] DNS setup for tmc-app.sailorskills.com
- [ ] Google Cloud service account creation
- [ ] Sheet structure setup with real data
- [ ] Environment variables in Vercel
- [ ] Test full flow end-to-end
- [ ] Vision Body approval before going live

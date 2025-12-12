# The Men's Circle App - Session Handoff

**Date:** December 12, 2025
**Status:** ✅ Core app functional with magic link auth and member directory

---

## What's Working

| Feature | Status | Notes |
|---------|--------|-------|
| Magic link login | ✅ Working | Emails via Resend |
| Member authentication | ✅ Working | JWT sessions, 30-day expiry |
| Member directory | ✅ Working | Pulls from Google Sheet |
| Auto-deploy | ✅ Working | Connected to GitHub |

### Live URLs
- **App:** https://app-sailorskills.vercel.app
- **Proposal:** https://tmc-site-proposal.sailorskills.com

### GitHub Repos
- **App:** https://github.com/standardhuman/tmc-app
- **Proposal:** https://github.com/standardhuman/tmc-proposal

---

## Architecture (Simplified)

```
Google Sheet (published) ──► Vercel API ──► Frontend
     │                           │
     │                           ├── /api/auth/request (send magic link)
     │                           ├── /api/auth/verify (verify token)
     │                           └── /api/members (directory)
     │
     └── Sheet ID: 1O_HyR5DNs9vwZ-dBvtx5PCWOZCNaMHDLPMxd_x-H68o
```

**Key change this session:** Switched from Google Sheets API (requires service account) to **published sheets** (just needs sheet to be public). No more googleapis dependency.

---

## Google Sheet Structure

**Current Sheet:** https://docs.google.com/spreadsheets/d/1O_HyR5DNs9vwZ-dBvtx5PCWOZCNaMHDLPMxd_x-H68o/

This is a copy of the TMC roster. The app reads these columns:
- `Status` → "Active" members can log in
- `E-Mail` → Login identifier
- `First Name` + `Last Name` → Display name
- `Current Team` → Team assignment
- `Cell` → Phone number (for directory)

**Sheet must be:**
1. Published to web (File → Share → Publish to web)
2. Shared with "Anyone with link" can view

---

## Environment Variables (Vercel)

| Variable | Value | Notes |
|----------|-------|-------|
| `ROSTER_SHEET_ID` | `1O_HyR5DNs9vwZ-dBvtx5PCWOZCNaMHDLPMxd_x-H68o` | Test sheet |
| `JWT_SECRET` | `tmc-secret-2025-xK9mP2vL8nQ4wR7j` | For token signing |
| `RESEND_API_KEY` | (set by Brian) | For magic link emails |

---

## What's Not Yet Built

### Resources Tab
Add a "Resources" tab to the Google Sheet with columns:
- `title` | `description` | `category` | `content`

### Announcements Tab
Add an "Announcements" tab:
- `date` | `title` | `body` | `author`

### Config Tab
Add a "Config" tab for dynamic settings:
- `key` | `value`
- Keys: `circling_location_name`, `circling_address`, `calendar_url`, etc.

### Custom Domain
- DNS: Add CNAME `tmc-app` → `cname.vercel-dns.com`
- Or A record to Vercel IP

---

## Code Notes

### Read-Only Mode
The app is **read-only** — it fetches from published sheets but cannot write. This means:
- ❌ Contact form writes to sheet (sends email only)
- ❌ Self-service onboarding (admins add members to sheet directly)
- ❌ Config editing in app (edit sheet directly)

### Column Mapping
The app maps TMC's sheet columns to expected names:
```javascript
// In api/auth/request.js, api/members.js, api/auth/verify.js
const memberEmail = member.email || member['e-mail'];
const memberName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
const memberTeam = member.team || member.current_team;
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `api/_lib/sheets.js` | Fetches published sheets as CSV |
| `api/_lib/auth.js` | JWT token creation/verification |
| `api/auth/request.js` | Magic link request endpoint |
| `api/auth/verify.js` | Token verification endpoint |
| `api/members.js` | Member directory endpoint |
| `src/pages/directory.js` | Member directory UI |
| `src/lib/auth.js` | Frontend session management |

---

## Next Session Checklist

- [ ] Add Resources tab to sheet + test
- [ ] Add Announcements tab to sheet + test
- [ ] Add Config tab for circling location
- [ ] Set up custom domain (tmc-app.sailorskills.com)
- [ ] Switch to production roster sheet (when ready)
- [ ] Vision Body approval for go-live

---

## Quick Commands

```bash
# Local dev
cd /Users/brian/Documents/AI/personal/themenscircle/app
npm run dev

# Deploy (auto on push, or manual)
vercel --prod

# Check logs
vercel logs --follow
```

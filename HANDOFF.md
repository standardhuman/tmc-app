# The Men's Circle App - Session Handoff

**Date:** December 12, 2025 (Late Evening Session)
**Status:** ✅ Feature-complete prototype ready for Vision Body review

---

## What's Working

| Feature | Status | Notes |
|---------|--------|-------|
| Magic link login | ✅ Working | Emails via Resend |
| Member authentication | ✅ Working | JWT sessions, 30-day expiry |
| Member directory | ✅ Enhanced | Rich profiles with intro letters |
| Resources page | ✅ Working | 11 TMC docs from Essential Documents |
| Announcements | ✅ Working | 5 sample announcements in sheet |
| Homepage | ✅ Enhanced | TMC fire logo, flame in nav |
| Team tabs | ✅ Working | Filter directory by team |
| Feedback API | ✅ New | Receives feedback from proposal site |

### Live URLs
- **App:** https://app-sailorskills.vercel.app
- **Proposal:** https://tmc-site-proposal.sailorskills.com

### GitHub Repos
- App: https://github.com/standardhuman/tmc-app
- Proposal: https://github.com/standardhuman/tmc-proposal

---

## This Session's Work

### 1. Google Sheets MCP Integration
- Verified gsheets MCP server is working
- Can read/write to any Google Sheet Brian has access to
- Tools: listSheets, readSheet, writeRange, createSheet, etc.

### 2. Intro Letters on Member Profiles
- Added INTROS tab data to member profiles
- API fetches Active Men + INTROS in parallel
- Matches by name (lowercase normalized)
- Displays in scrollable section with date badge
- Styled with cream background and ember left border

### 3. Announcements Fixed
- Created "Announcements" tab in roster sheet
- Populated with 5 sample announcements
- API already fell back to ROSTER_SHEET_ID, so it just worked
- Dashboard now shows recent announcements

### 4. Proposal Site Updated
Major updates to https://tmc-site-proposal.sailorskills.com:

**New Sections:**
- **Preview Section** (forest green) - Link to test site with login instructions
- **Feedback Form** - 8 comprehensive questions for Vision Body
- **"Beautiful Fallback"** - Explains zero-risk approach (sheets remain if site disappears)

**Feedback Questions:**
1. Overall impression (1-5 rating)
2. Look & feel (too soft / just right / too harsh)
3. Member directory usefulness
4. Intro letters privacy concerns
5. Login experience smoothness
6. Missing features (checkboxes + open text)
7. Bugs/issues found
8. Open feedback

### 5. Flame Logo in Nav
- Added fire.svg to header nav (24x24px)
- Shows on both public and member pages
- Left of "The Men's Circle" text

---

## Google Sheets Structure

**Roster Sheet:** `1O_HyR5DNs9vwZ-dBvtx5PCWOZCNaMHDLPMxd_x-H68o`

| Tab | Purpose | Status |
|-----|---------|--------|
| Active Men | Member roster | ✅ Connected |
| INTROS | Introduction letters | ✅ Connected |
| Announcements | News/updates | ✅ Created this session |
| Website Feedback | Feedback form responses | ✅ Created (headers only) |

**Resources Sheet:** `1OKSYfpmXF2SHjh2K9vl5n0sRs242es5oXbqjGfWOcbs`

---

## Environment Variables (Vercel)

| Variable | Status | Notes |
|----------|--------|-------|
| `ROSTER_SHEET_ID` | ✅ Set | Main roster + announcements + intros |
| `RESOURCES_SHEET_ID` | ✅ Set | TMC documents |
| `JWT_SECRET` | ✅ Set | For token signing |
| `RESEND_API_KEY` | ✅ Set | For magic link emails |

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Send magic link email |
| `/api/auth/verify` | GET | Verify magic link token |
| `/api/members` | GET | Member directory + intros |
| `/api/resources` | GET | TMC documents |
| `/api/announcements` | GET | News/updates |
| `/api/contact` | POST | Public contact form |
| `/api/feedback` | POST | Proposal site feedback |

---

## Member Profile Fields

```javascript
{
  name, firstName, lastName, email, phone, team,
  position,        // Leader, Captain, etc.
  status,          // Active, Sabbatical
  city, state, website, yearJoined, sponsor, occupation,
  identities,
  purposeEssence, purposeBlessing, purposeMission, purposeMessage,
  photoUrl,
  intro,           // NEW: Full intro letter text
  introDate        // NEW: When intro was sent
}
```

---

## Key Design Decisions

### "Beautiful Fallback" Principle
The website is just a window into Google Sheets. If anything goes wrong with the site, or no one can maintain it, everything continues exactly as before - the sheets remain the source of truth, safe and accessible.

### Intro Letters Display
Currently showing all intro letters in member profiles. Feedback form specifically asks about privacy concerns. May need to make this opt-in based on feedback.

---

## Next Session Checklist

- [ ] Review feedback responses (check Vercel logs)
- [ ] Add member photos (need photo URLs in roster sheet)
- [ ] Set up custom domain (DNS coordination needed)
- [ ] Switch to production roster (when approved)
- [ ] Vision Body approval for go-live
- [ ] Consider intro letter opt-in based on feedback

---

## Quick Commands

```bash
# Local dev (app)
cd /Users/brian/Documents/AI/personal/themenscircle/tmc-site-demo
npm run dev

# Local dev (proposal)
cd /Users/brian/Documents/AI/personal/themenscircle/tmc-site-proposal
npm run dev

# Deploy (auto on push to main)
git push origin main

# Check Vercel logs for feedback
vercel logs --follow
```

---

## MCP Servers Available

- **gsheets** - Read/write Google Sheets
- **gdrive** - Search/read Google Drive files
- **gmail** - Email operations
- **nano-banana** - Image generation (Gemini)

---

## Files Changed This Session

**App:**
- `api/members.js` - Added INTROS fetch and matching
- `api/feedback.js` - New feedback endpoint
- `src/pages/directory.js` - Added intro display in modal
- `src/main.js` - Added flame logo to nav
- `src/styles.css` - Intro section + nav logo styles

**Proposal Site:**
- `index.html` - Preview section, feedback form, fallback section
- `public/style.css` - New section styles

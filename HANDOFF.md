# The Men's Circle App - Session Handoff

**Date:** December 12, 2025 (Evening Session)
**Status:** ✅ Full-featured member portal with rich profiles, resources, and branding

---

## What's Working

| Feature | Status | Notes |
|---------|--------|-------|
| Magic link login | ✅ Working | Emails via Resend |
| Member authentication | ✅ Working | JWT sessions, 30-day expiry |
| Member directory | ✅ Enhanced | Rich profiles with modal detail view |
| Resources page | ✅ Working | 11 TMC docs from Essential Documents |
| Homepage | ✅ Enhanced | TMC fire heart logo as centerpiece |
| Team tabs | ✅ New | Filter directory by team |

### Live URLs
- **App:** https://app-sailorskills.vercel.app
- **Proposal:** https://tmc-site-proposal.sailorskills.com

### GitHub Repo
- https://github.com/standardhuman/tmc-app

---

## This Session's Work

### 1. Logo & Branding
- Generated fire heart logo with "THE MEN'S CIRCLE" text
- Created TMC abbreviated version (`/logo-tmc.png`) - currently on homepage
- Fine-tuned background color (#FBFAF7) to blend with page gradient
- Removed logo from nav bar, kept text "The Men's Circle"

### 2. Resources System
- Created Resources sheet in TMC-Site-Draft folder
- Extracted 11 documents from TMC Essential Documents:
  - The Men's Circle Document, TMC Essential Documents
  - Leader/Captain/Initiator Handbooks
  - Pillar Guide Handbooks (2 versions)
  - Sponsorship Handbook, Visitor's Guide
  - Qualities of a Man in TMC, Core Team Roles
- Resources display with "Open" buttons linking to Google Docs

### 3. Enhanced Member Directory
**Cards now show:**
- Name + Position badge (Leader, Captain, Initiator, etc.)
- Occupation
- Purpose Essence (italic quote)
- Team + Year Joined

**Click any card** to open modal with:
- Purpose section (Essence, Blessing, Mission, Message)
- About (Occupation, Location, Identities)
- TMC Journey (Team, Year Joined, Sponsor)
- Contact (Email, Phone, Website - all clickable)

**Also:**
- Team filter tabs at top
- Includes Sabbatical members (with badge)
- Hover effects on cards

### 4. Announcements (Mock Data Ready)
Created CSV with 5 sample announcements:
- New Winter Circling Location
- Holiday Schedule 2024
- Initiator Training - January Cohort
- Updated Circling Guidelines
- Welcome New Brothers!

**File:** https://drive.google.com/file/d/19PrmC6qOKytNah8owYAdYoZJERvGYFCN/view

---

## Google Drive Structure

**TMC-Site-Draft Folder:**
| File | Type | Status |
|------|------|--------|
| Copy of TMC Roster | Sheet | ✅ Published, connected |
| TMC Resources | Sheet | ✅ Published, connected |
| TMC Announcements | CSV | ⚠️ Needs conversion to Sheet |

---

## Environment Variables (Vercel)

| Variable | Status | Notes |
|----------|--------|-------|
| `ROSTER_SHEET_ID` | ✅ Set | `1O_HyR5DNs9vwZ-dBvtx5PCWOZCNaMHDLPMxd_x-H68o` |
| `RESOURCES_SHEET_ID` | ✅ Set | `1OKSYfpmXF2SHjh2K9vl5n0sRs242es5oXbqjGfWOcbs` |
| `JWT_SECRET` | ✅ Set | For token signing |
| `RESEND_API_KEY` | ✅ Set | For magic link emails |
| `ANNOUNCEMENTS_SHEET_ID` | ❌ Not set | Need to convert CSV → Sheet first |

---

## To Activate Announcements

1. Open the [Announcements CSV](https://drive.google.com/file/d/19PrmC6qOKytNah8owYAdYoZJERvGYFCN/view)
2. Open with Google Sheets
3. Rename tab to **Announcements**
4. Publish (File → Share → Publish to web)
5. Copy the Sheet ID from URL
6. Add to Vercel: `ANNOUNCEMENTS_SHEET_ID` = (sheet id)
7. Redeploy

---

## Logo Files

| File | Description |
|------|-------------|
| `/public/logo.png` | Full "THE MEN'S CIRCLE" version |
| `/public/logo-tmc.png` | Abbreviated "TMC" version (currently on homepage) |

Both have #FBFAF7 background to blend with page gradient.

---

## API Data Fields

**Members API now returns:**
```javascript
{
  name, firstName, lastName, email, phone, team,
  position,        // Leader, Captain, etc.
  status,          // Active, Sabbatical
  city, state,
  website,
  yearJoined,
  sponsor,
  occupation,
  identities,
  purposeEssence,
  purposeBlessing,
  purposeMission,
  purposeMessage
}
```

---

## Next Session Checklist

- [ ] Activate Announcements (convert CSV → Sheet, set env var)
- [ ] Switch homepage logo back to full version? (currently TMC)
- [ ] Add member photos (need photo URLs in roster sheet)
- [ ] Set up custom domain
- [ ] Switch to production roster (when ready)
- [ ] Vision Body approval for go-live

---

## Quick Commands

```bash
# Local dev
cd /Users/brian/Documents/AI/personal/themenscircle/app
npm run dev

# Deploy (auto on push)
git push origin main

# Check Vercel logs
vercel logs --follow
```

---

## Image Generation Note

nano-banana MCP is configured with Gemini API key for logo editing. Config stored locally (not in git).

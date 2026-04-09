# RELYN CRM — Design System Brief

**Platform Name:** Relyn  
**Current Status:** MVP ready for redesign  
**Target Users:** Sales teams, sales heads, supervisors, managing sales pipelines  
**Core Vision:** AI-powered CRM that transforms manual tracking into intelligent insights  

---

## Vision Statement

Relyn is a **centralized, intelligent CRM platform** that eliminates repetitive manual data entry and empowers sales teams with real-time insights. Instead of clicking through multiple screens, users get a **unified dashboard** where:

- Sales heads manage team hierarchies (supervisors, reps)
- Teams track pipeline status in real-time
- **AI provides actionable insights** on leads, deals, and performance without leaving the dashboard
- Data flows naturally from capture → scoring → forecasting

**Key Differentiator:** Embedded AI assistant that answers questions like:
- "Which leads should I prioritize this week?"
- "What's blocking my pipeline?"
- "Show me rep performance vs. forecast"
- All without leaving the page.

---

## Core Features

### 1. Inbound Leads Management
**Purpose:** Capture and qualify incoming leads automatically

- **Lead capture form** - 31 fields organized by section, smart defaults from email domain
- **Auto-scoring** - AI scores leads 0-100 based on discovery fields
- **Lead grades** - A/B/C/D grades for quick prioritization
- **Search & filter** - Instant filtering by name, company, status, score
- **Bulk actions** - Assign 5 leads to a rep with one click
- **Activity timeline** - See "24 hrs since contact" / "Discovery scheduled" at a glance

### 2. Sales Pipeline (Scoping → Closed Won)
**Purpose:** Track active deals through deal stages

- **Visual pipeline board** - Kanban-style cards you can drag between stages
  - Scoping → PoC → Negotiation → Closed Won / Closed Lost
- **Deal cards show:**
  - Company name + logo
  - Est. deal value (large, prominent)
  - Win probability slider (adjust on card)
  - Next action (e.g., "Send proposal by Friday")
  - Assigned rep
  - Days in stage (red if stalled)
  
- **Weighted pipeline** - Shows $ forecasted revenue with visual confidence levels
- **Stage indicators** - Color-coded badges + progress bar

### 3. Dashboard (Intelligence Hub)
**Purpose:** Real-time view of business health + AI insights

#### **Top Section: KPIs (4 cards)**
- **Total Leads** - All inbound (count + trend ↑↓)
- **Conversion Rate** - Leads → Scoping (%)
- **Weighted Pipeline** - Forecast revenue ($)
- **Win Rate** - Deals won vs. total active (%)

#### **Middle Section: Visual Breakdowns**
- **Leads by stage** - Horizontal stacked bar chart (New → Contacted → Discovery → Scoping → Disqualified)
- **Pipeline by stage** - Horizontal bar with $ amounts per stage
- **Team performance** - Grid of 4-6 reps with their metrics:
  - Leads assigned
  - Pipeline value
  - Conversion rate
  - Avatar + name

#### **Right Column: AI Assistant Panel (Sticky)**
- **"Ask Relyn"** - Search box at top
- **Quick prompts** below (cards):
  - "🔥 Hot leads this week" → Shows 3 leads scored 80+
  - "⚠️ Stalled deals" → Shows deals > 30 days in same stage
  - "📈 Rep forecast" → Compare each rep's pipeline vs. quota
  - "💡 Next actions" → Recommended follow-ups
- **Chat history** - Toggle to see past queries
- **Export** - "Export to PDF" for each insight

---

### 4. Team Management
**Purpose:** Org chart + permissions

- **Team tree view** (left sidebar expandable):
  - Sales Head (you)
    - Supervisor A
      - Rep 1, Rep 2, Rep 3
    - Supervisor B
      - Rep 4, Rep 5
- **Quick assign** - Drag rep to lead/deal in dashboard
- **Team settings** - Edit roles, quotas, team names

### 5. User Settings & Profile
**Purpose:** Personal account management

- **Profile card** - Photo, name, email, role, quota
- **Account settings** - Password, 2FA, notification preferences
- **API keys** - For Zapier/webhook integrations
- **Export data** - Download all personal leads/deals as CSV

---

## Design Principles

### **Visual Hierarchy**
1. **Primary actions** - Large buttons (blue/teal), always visible
   - "Add Lead"
   - "New Deal"
   - "Ask Relyn"
2. **Secondary actions** - Smaller, outlined buttons
   - Edit, Assign, Archive
3. **Tertiary** - Links, icons, context menus
   - Drill-down, delete, more options

### **Color System**
- **Primary:** Teal/Blue (trust, intelligence, tech)
- **Accent:** Warm orange (AI highlights, quick wins)
- **Status colors:**
  - 🟢 Green = Closed Won / High score (80-100)
  - 🟡 Yellow = In progress / Medium (40-79)
  - 🔴 Red = Blocked / Low (0-39)
  - ⚫ Gray = Disqualified / Archived
- **Background:** Light gray/white with subtle gradients
- **Text:** Dark gray on light (high contrast for accessibility)

### **Components**
- **Cards** - Rounded corners (12-16px), subtle shadows, hover lift
- **Buttons** - Rounded (8px), with icons when relevant
- **Badges** - Compact, monospace fonts for scores/IDs
- **Modals** - Clean drawers on the right (not center popups)
- **Tables** - Striped rows, sortable headers, inline editing
- **Charts** - Minimal gridlines, animated on load

---

## User Flows

### **Flow 1: Sales Rep — Add & Move Lead to Scoping**
```
1. Dashboard → "Add Lead" button
2. Form drawer slides in (auto-focuses first field)
3. Rep fills key fields (name, company, email, discovery notes)
4. Form auto-saves as draft (no button needed initially)
5. Rep clicks "Create Lead" at bottom
6. Success toast: "Lead REL-001 created, score: 72 (B)"
7. Form disappears, lead appears in table
8. Rep finds lead in table, clicks "→ Scoping" button
9. Confirms action, lead moves to pipeline as new deal
10. "Success! Deal created. Review in Pipeline tab"
```

### **Flow 2: Sales Head — Check Team Performance & AI Insights**
```
1. Open dashboard (default view)
2. See KPI cards + team performance grid at a glance
3. Notice rep "Alex" has 0 activities this week (alert badge)
4. Hover over "AI Assistant" panel on right
5. Read suggested quick prompt: "⚠️ Stalled deals (3 found)"
6. Click prompt → AI shows 3 deals stuck > 30 days with recommended actions
7. Click "Send proposal reminder" on one deal
8. Zapier integration auto-emails the rep + updates deal notes
9. Check back tomorrow for follow-up result
```

### **Flow 3: Sales Rep — Search for Insights**
```
1. Dashboard → Click "Ask Relyn" search box
2. Type: "Which leads should I call first?"
3. AI responds: "Your top 5 leads by score (all 80+)"
4. Shows table with lead names, companies, next actions
5. Rep clicks lead name → Form opens with all details + history
6. Rep sees "Last contacted: 2 days ago" + "Discovery scheduled: Yes"
7. Rep updates discovery notes: "Interested in PoC next month"
8. Clicks "Save" → Data saved + score potentially updates
9. AI suggests: "Schedule PoC call — I'll send calendar invite to client"
10. Rep confirms → Integration with Calendly/Outlook bookings
```

---

## Layout Structure

### **Global Layout**
```
┌──────────────────────────────────────────────────────────┐
│ [Logo: Relyn] [Search: Cmd+K]     [Profile] [Settings] │
├─────────────────┬──────────────────────────────────────┤
│                 │                                        │
│  Dashboard      │     MAIN CONTENT AREA                │
│  • Leads        │                                        │
│  • Pipeline     │  (Dashboard / Leads / Pipeline views) │
│  • Settings     │                                        │
│                 │       [AI Assistant Panel] ────────┐  │
│                 │                                  ┌─┴──┤
│  Team Tree      │                                  │    │
│  (collapsible)  │                                  │    │
│                 │                                  │    │
└─────────────────┴──────────────────────────────────┴────┘
```

### **Dashboard View Structure**
```
┌─ Header ──────────────────────────────────────────────────┐
│  DASHBOARD  |  📊 Leads  |  🔄 Pipeline  |  ⚙ Settings  │
├────────────────────────────────────────────────────────────┤
│ [KPI Cards Row]                                            │
│  Total Leads  │ Conversion  │ Weighted $  │ Win Rate    │
│     42        │    28%      │  $485k      │   65%       │
├────────────────────────────────────────────────────────────┤
│ [Charts Row]                    │ [AI Panel - Sticky]     │
│ Leads by Stage                  │ 🤖 Ask Relyn          │
│ │████ New  │████░ Contacted │   │ [Search box]          │
│                                 │                         │
│ Pipeline by Stage               │ Quick Prompts:         │
│ │████░ Scoping │████░ PoC    │ 🔥 Hot leads           │
│                                 │ ⚠️ Stalled deals       │
│ [Team Performance Grid]         │ 📈 Rep forecast       │
│ [Reps with metrics in tiles]    │ 💡 Suggested actions  │
│                                 │                         │
└────────────────────────────────────────────────────────────┘
```

---

## Interaction Patterns

### **Drag & Drop**
- Drag lead to rep avatar on team card → Assign
- Drag deal card between pipeline stages → Move
- Drag column header → Reorder columns
- Feedback: Highlight drop zone, show confirmation

### **Inline Editing**
- Click any cell in table → Edit (not modal)
- Hit Enter to save or Escape to cancel
- Cell highlights yellow while editing
- Shows "Saved" checkmark briefly

### **Real-time Updates**
- When another team member updates a lead/deal, dashboard updates live (no refresh)
- Toast notification: "Alex moved Deal #5 to Negotiation"
- Activity log scrolls to show event

### **Keyboard Shortcuts**
- `Cmd+K` / `Ctrl+K` → Open AI search
- `N` → New lead
- `D` → New deal
- `Escape` → Close any modal/drawer

---

## AI Integration Points

### **Embedded Assistant Features**
1. **Lead Scoring** - Real-time, based on discovery fields
   - Auto-grade (A-D) appears immediately
   - Trend indicator if score changes
   
2. **Pipeline Forecast** - Weighted value updates as deals move
   - "You'll hit forecast if you close 3 more deals"
   - Risk alerts: "Deal X hasn't moved in 28 days"

3. **Next Best Action** - Recommended follow-ups
   - "Call these 5 leads tomorrow"
   - "Send proposal to deal #3 before EOD"
   - "Schedule discovery call with lead #8"

4. **Anomaly Detection**
   - Rep hasn't logged activity in 7 days → Alert
   - Deal in negotiation for 60+ days → Flag
   - Lead score dropped suddenly → Investigate

5. **Reporting & Forecasting**
   - "Your team will hit $2.1M forecast if conversion stays at 28%"
   - "Compared to last month, conversion is up 5%"
   - "Rep Alex is on pace for 120% of quota"

---

## Mobile Responsiveness

- **Desktop** (1440px+) - Full layout, AI panel on right
- **Tablet** (768-1440px) - Sidebar collapses, single-column layout
- **Mobile** (< 768px) - Stacked layout, AI panel becomes tab

---

## Accessibility Requirements

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader friendly (ARIA labels)
- ✅ Color not only indicator (icons + text)
- ✅ Min. 16px font for body text
- ✅ 4.5:1 contrast ratio for text

---

## Next Steps for Design Implementation

1. **Figma / Design System** - Build component library (buttons, cards, badges, etc.)
2. **High-fidelity mockups** - Create 5-6 key screens:
   - Dashboard (overview)
   - Leads table (with form drawer open)
   - Pipeline kanban (3 stages shown)
   - AI Assistant panel (focused)
   - Team management (org chart)
3. **Interactive prototype** - Link screens with realistic interactions
4. **Design tokens** - Export colors, spacing, typography for dev handoff
5. **Engineering handoff** - Share Figma link + design system docs

---

## Success Metrics for Redesign

- ✅ Users can add a lead in < 2 minutes (form feels smooth)
- ✅ Conversion from lead → scoping deal increased (better visibility)
- ✅ Sales head can make data-driven decision in < 5 minutes (dashboard is clear)
- ✅ AI queries reduce time-to-insight by 50% (vs. manual filtering)
- ✅ Team adoption rate > 80% within first month (onboarding is intuitive)

---

## Brand Voice & Tone

**Words:** Modern, intelligent, approachable, direct
**Not:** Corporate jargon, overcomplicated, boring
**Example messaging:**
- ✅ "Hot leads this week: 5 scored 80+"
- ✅ "Your pipeline's looking strong! On track for 110% forecast."
- ❌ "Lead qualification metrics dashboard accessed"
- ❌ "Initiate data aggregation sequence"

---

## Design File Structure (for Figma / Design Tool)

```
Relyn Design System
├── 🎨 Brand
│   ├── Logo + Icon set
│   ├── Color palette
│   ├── Typography (Inter/Poppins)
│
├── 🧩 Components
│   ├── Buttons (primary, secondary, small, icon)
│   ├── Cards (KPI card, lead card, deal card)
│   ├── Forms (input, select, date picker, textarea)
│   ├── Badges (status, grade, score)
│   ├── Tables (sortable, with inline actions)
│   ├── Charts (bar, line, pie, progress)
│   ├── Modals + Drawers (form panels)
│   ├── Navigation (sidebar, header, tabs)
│
├── 🖼️ Screens (High-Fidelity)
│   ├── 1. Dashboard (full view)
│   ├── 2. Leads (table + form drawer)
│   ├── 3. Pipeline (kanban board)
│   ├── 4. Team Management (org chart)
│   ├── 5. Settings (profile + preferences)
│   ├── 6. AI Assistant (chat + prompts)
│
├── 📱 Responsive
│   ├── Mobile (Inbound Leads tab view)
│   ├── Tablet (sidebar collapsed)
│   ├── Desktop (full layout)
```

---

## Implementation Roadmap

### **Phase 1: Design** (1-2 weeks)
- [ ] Finalize design system in Figma
- [ ] Build 6 high-fidelity screens
- [ ] Create interactive prototype with micro-interactions

### **Phase 2: Frontend Build** (2-3 weeks)
- [ ] Implement component library in React + Tailwind
- [ ] Build dashboard with KPI cards + charts (Recharts or Chart.js)
- [ ] Implement leads table with search/filter
- [ ] Build pipeline kanban (react-dnd or similar)
- [ ] Create AI panel UI (search, prompts, chat)

### **Phase 3: Backend Integration** (1-2 weeks)
- [ ] Connect to Firestore for real-time updates
- [ ] Implement advanced search + AI query endpoint
- [ ] Add webhooks for team notifications
- [ ] Set up team hierarchy + permissions

### **Phase 4: Polish & Testing** (1 week)
- [ ] Accessibility audit
- [ ] Performance optimization (lazy loading, caching)
- [ ] User testing with beta group
- [ ] Deploy to production

---

## Questions for Designers / Dev Team

1. Should the AI panel be always visible or collapsible?
2. Do we use icons or text labels in the sidebar nav?
3. What charting library? (Recharts, Chart.js, Victory, D3?)
4. Dark mode support? (Yes/No?)
5. Should deals be draggable in kanban, or click-to-move dropdown?
6. How many quick AI prompts on dashboard? (3–5 recommended)

---

**Created:** April 8, 2026  
**Version:** 1.0 (Initial Brief)  
**Status:** Ready for Design Team Input

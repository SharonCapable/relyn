// src/lib/db.js
// ─────────────────────────────────────────────────────────────────────────────
// Firestore collection references + helper functions.
// All Firestore reads/writes should go through these helpers — never call
// Firestore directly from components.
// ─────────────────────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Collection names ──────────────────────────────────────────────────────────
export const COLLECTIONS = {
  LEADS:    'leads',
  PIPELINE: 'pipeline',
}

// ── Leads (Tab 1 — Inbound Leads) ─────────────────────────────────────────────

/**
 * Lead document schema - matches the Excel "1. Inbound Leads" sheet
 *
 * FROM INBOUND FORM (Fields 1-10)
 *   leadId              string   Auto-generated  e.g. "REL-001"
 *   dateReceived        timestamp
 *   firstName           string   Required
 *   lastName            string   Required
 *   phoneNumber         string
 *   email               string   Required
 *   company             string   Required
 *   roleTitle           string   Required
 *   country             string   Required
 *   howFoundRelyn       string   Required (e.g. "Google Ads", "Referral", "Website")
 *   projectDescription  string   Required
 *
 * FIRST TOUCH / TRIAGE (Fields 11-16)
 *   assignedTo          string   Team member name
 *   dateFirstContacted  timestamp
 *   responseStatus      string   e.g. "No Response", "Responded", "Engaged"
 *   businessUnit        string   "Data Annotation" or "AI Solutions"
 *   serviceLine         string   e.g. "Image Annotation", "NLP"
 *   partnerOrDirect     string   "Partner" or "Direct"
 *
 * DISCOVERY CALL OUTPUTS (Fields 17-24)
 *   discoveryCallDate   timestamp
 *   dataModality        string   "Image", "Text", "Audio", "Video", "LiDAR"
 *   estVolume           string   e.g. "10,000 images"
 *   budgetRange         string   e.g. "$10K-$50K"
 *   timeline            string   "Urgent", "3 months", "6 months"
 *   decisionMaker       boolean
 *   industryVertical    string
 *   discoveryNotes      string   Free text notes
 *
 * STAGE GATE & ROUTING (Fields 25-29)
 *   leadScore           number   0-100 (auto-calculated)
 *   leadGrade           string   "A", "B", "C", "D" (auto-calculated)
 *   discoveryComplete   boolean
 *   stage               string   "New" | "Contacted" | "Discovery Scheduled" | "Discovery Done" | "Move to Scoping" | "Disqualified"
 *   outcomeIfLost       string   Reason if Lost/Dead
 *
 * VELOCITY
 *   dateMovedToScoping  timestamp
 *
 * META
 *   createdAt           timestamp
 *   updatedAt           timestamp
 *   createdBy           string   uid
 */

export async function getLeads() {
  const q = query(collection(db, COLLECTIONS.LEADS), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getLead(id) {
  const snap = await getDoc(doc(db, COLLECTIONS.LEADS, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function addLead(data, uid) {
  const nextId = await generateLeadId()
  const leadScore = calculateLeadScore(data)
  const leadGrade = calculateLeadGrade(leadScore)
  return addDoc(collection(db, COLLECTIONS.LEADS), {
    // From inbound form
    leadId: nextId,
    dateReceived: data.dateReceived || serverTimestamp(),
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNumber: data.phoneNumber || '',
    email: data.email,
    company: data.company,
    roleTitle: data.roleTitle,
    country: data.country,
    howFoundRelyn: data.howFoundRelyn,
    projectDescription: data.projectDescription,

    // First touch / triage
    assignedTo: data.assignedTo || '',
    dateFirstContacted: data.dateFirstContacted || null,
    responseStatus: data.responseStatus || '',
    businessUnit: data.businessUnit || '',
    serviceLine: data.serviceLine || '',
    partnerOrDirect: data.partnerOrDirect || 'Direct',

    // Discovery call outputs
    discoveryCallDate: data.discoveryCallDate || null,
    dataModality: data.dataModality || '',
    estVolume: data.estVolume || '',
    budgetRange: data.budgetRange || '',
    timeline: data.timeline || '',
    decisionMaker: data.decisionMaker || false,
    industryVertical: data.industryVertical || '',
    discoveryNotes: data.discoveryNotes || '',

    // Stage gate & routing
    leadScore,
    leadGrade,
    discoveryComplete: data.discoveryComplete || false,
    stage: 'New',
    outcomeIfLost: '',

    // Velocity
    dateMovedToScoping: null,

    // Meta
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
  })
}

export async function updateLead(id, data) {
  const leadScore = calculateLeadScore(data)
  const leadGrade = calculateLeadGrade(leadScore)
  return updateDoc(doc(db, COLLECTIONS.LEADS, id), {
    ...data,
    leadScore,
    leadGrade,
    updatedAt: serverTimestamp(),
  })
}

// ── Pipeline (Tab 2 — Scoping & PoC) ─────────────────────────────────────────

/**
 * Pipeline document schema (mirrors Tab 2):
 *
 * LEAD REFERENCE
 *   leadId          string   Links back to Tab 1 document
 *   accountName     string   Deal / project name
 *   company         string   From Tab 1
 *   owner           string   BD Owner
 *
 * SCOPING / PoC
 *   dateEnteredScoping  timestamp
 *   projectDescription  string
 *   serviceLine         string
 *   dataModality        string
 *   annotationType      string
 *   platformRequired    string
 *   volumeUnits         string
 *   volumeEstHours      number
 *   pocStartDate        timestamp
 *   pocEndDate          timestamp
 *   pocCost             number
 *   pocOutcome          string
 *   pocFeedback         string
 *
 * COMMERCIAL
 *   hourlyRate          number
 *   estDealValue        number
 *   pricingModel        string
 *   estGrossMargin      number
 *   financeApproved     boolean
 *   sowStatus           string   "Not Started" | "Draft" | "Sent" | "Signed"
 *   dateSowSent         timestamp
 *
 * DEAL STATUS & PIPELINE
 *   pipelineStage       string   "Scoping" | "PoC" | "Negotiation" | "Closed Won" | "Closed Lost"
 *   winProbability      number   0–100
 *   weightedValue       number   Auto-calculated: estDealValue × winProbability/100
 *   contractType        string   "One-off" | "Retainer" | "Pilot"
 *   daysInScoping       number
 *   blockers            string
 *   nextSteps           string
 *   riskNotes           string
 *   lastUpdated         timestamp
 *
 * OUTCOME
 *   dateWon             timestamp
 *   productionStartDate timestamp
 *   productionEndDate   timestamp
 *   winLossReason       string
 *
 * META
 *   createdAt           timestamp
 *   updatedAt           timestamp
 *   createdBy           string
 */

export async function getPipelineDeals() {
  const q = query(collection(db, COLLECTIONS.PIPELINE), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addPipelineDeal(leadData, uid) {
  return addDoc(collection(db, COLLECTIONS.PIPELINE), {
    leadId:         leadData.leadId,
    accountName:    '',
    company:        leadData.company,
    owner:          leadData.assignedTo,
    pipelineStage:  'Scoping',
    winProbability: 20,
    weightedValue:  0,
    createdAt:      serverTimestamp(),
    updatedAt:      serverTimestamp(),
    createdBy:      uid,
  })
}

export async function updatePipelineDeal(id, data) {
  const weightedValue =
    (data.estDealValue || 0) * ((data.winProbability || 0) / 100)
  return updateDoc(doc(db, COLLECTIONS.PIPELINE, id), {
    ...data,
    weightedValue,
    updatedAt: serverTimestamp(),
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Auto-generate the next Lead ID in the format REL-001.
 * Reads all existing leads and increments the highest number found.
 */
async function generateLeadId() {
  const snap = await getDocs(collection(db, COLLECTIONS.LEADS))
  let max = 0
  snap.forEach(d => {
    const id = d.data().leadId || ''
    const num = parseInt(id.replace('REL-', ''), 10)
    if (!isNaN(num) && num > max) max = num
  })
  return `REL-${String(max + 1).padStart(3, '0')}`
}

/**
 * Lead score calculation (0-100)
 * Higher score = more qualified lead
 *
 * Scoring rubric (5 points each):
 *   discoveryCallDate: 20 points
 *   dataModality: 20 points
 *   budgetRange: 20 points
 *   timeline: 20 points
 *   decisionMaker: 20 points
 */
export function calculateLeadScore(data) {
  let score = 0
  if (data.discoveryCallDate) score += 20
  if (data.dataModality) score += 20
  if (data.budgetRange) score += 20
  if (data.timeline) score += 20
  if (data.decisionMaker) score += 20
  return Math.min(score, 100)
}

/**
 * Lead grade calculation (A-D)
 * Based on lead score:
 *   A: 80-100
 *   B: 60-79
 *   C: 40-59
 *   D: 0-39
 */
export function calculateLeadGrade(score) {
  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  if (score >= 40) return 'C'
  return 'D'
}

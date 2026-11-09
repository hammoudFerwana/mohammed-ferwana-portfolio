/**
 * claimFsm.js — Canonical Claim Lifecycle Finite State Machine (FSM)
 *
 * Single source of truth for InsurFlow claim lifecycle states, transitions,
 * and terminal state definitions.
 *
 * Extracted verbatim from InsurFlow case study evidence:
 * - Happy Path: InsurflowEvidence.jsx (lines 231–263)
 * - Branches & Terminal States: InsurflowEvidence.jsx (lines 267–286)
 * - Service Precondition Gates: claim.service.js excerpt in InsurflowEvidence.jsx (lines 298–310)
 */

export const states = [
  'NEW',
  'PENDING_ACCEPTANCE',
  'ASSIGNED',
  'IN_PROGRESS',
  'SUBMITTED',
  'UNDER_REVIEW',
  'CORRECTION_REQUIRED',
  'APPROVED',
  'CLOSED',
  'REJECTED',
];

export const transitions = {
  NEW: ['PENDING_ACCEPTANCE'],
  PENDING_ACCEPTANCE: ['ASSIGNED', 'NEW'],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['APPROVED', 'CORRECTION_REQUIRED', 'REJECTED'],
  CORRECTION_REQUIRED: ['IN_PROGRESS'],
  APPROVED: ['CLOSED'],
  CLOSED: [],
  REJECTED: [],
};

export const terminalStates = ['CLOSED', 'REJECTED'];

export const claimFsm = {
  states,
  transitions,
  terminalStates,
};

export default claimFsm;

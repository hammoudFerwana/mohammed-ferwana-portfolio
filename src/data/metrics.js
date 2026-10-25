/**
 * Centralized Metrics & Evidence Data Module
 *
 * Source of truth for verifiable engineering claims across the portfolio.
 */

import { claimFsm } from './claimFsm';

// Switch to 'main' after the first production release merge
export const ciBadgeBranch = 'develop';

export const metrics = {
  integrationTests: 616,
  testSuites: 39,
  testRunDate: '2026-10-01',
  fsmStates: claimFsm.states.length,
  ciBadgeBranch,
  source: 'Sawn backend, full Jest run',
};

export default metrics;

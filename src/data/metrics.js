/**
 * Centralized Metrics & Evidence Data Module
 *
 * Source of truth for verifiable engineering claims across the portfolio.
 */

import { claimFsm } from './claimFsm';

export const ciBadgeBranch = 'main';

export const metrics = {
  integrationTests: 1248,
  testSuites: 63,
  testRunDate: '2026-11-11',
  fsmStates: claimFsm.states.length,
  ciBadgeBranch,
  source: 'Sawn backend, full Jest run',
};

export default metrics;

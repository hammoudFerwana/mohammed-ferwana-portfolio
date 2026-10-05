/**
 * Centralized Metrics & Evidence Data Module
 *
 * Source of truth for verifiable engineering claims across the portfolio.
 * Note: The verbatim Jest test excerpt in src/components/projects/InsurflowTestingEvidence.jsx
 * contains the literal number 15 and remains unchanged as a syntax-highlighted code excerpt.
 */

// Switch to 'main' after the first production release merge
export const ciBadgeBranch = 'develop';

export const metrics = {
  integrationTests: 553,
  testSuites: 34,
  claimsEngineTests: 387,
  claimsEngineSuites: 27,
  fsmStates: 10,
  concurrentRequests: 15,
  ciBadgeBranch,
  source: 'Existing portfolio data at commit 2b60f86',
};

export default metrics;

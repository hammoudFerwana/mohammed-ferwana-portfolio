/**
 * fsm.mjs — Pure Claim Lifecycle State Machine Transitions
 *
 * Exposes pure functions to evaluate lifecycle transitions, query allowed
 * source states, and build deterministic error payloads.
 */

import { states, transitions, terminalStates } from '../data/claimFsm.js';

/**
 * Validates whether a state transition from `from` to `to` is permitted.
 *
 * @param {string} from - Source state
 * @param {string} to - Target state
 * @returns {{ ok: boolean, status: 200 | 409, code: string | null, from: string, to: string }}
 * @throws {TypeError} If either `from` or `to` is not in the states list
 */
export function canTransition(from, to) {
  if (typeof from !== 'string' || !states.includes(from)) {
    throw new TypeError(`Invalid source state: ${from}`);
  }
  if (typeof to !== 'string' || !states.includes(to)) {
    throw new TypeError(`Invalid target state: ${to}`);
  }

  const allowedTargets = transitions[from] || [];
  const ok = allowedTargets.includes(to);

  if (ok) {
    return {
      ok: true,
      status: 200,
      code: null,
      from,
      to,
    };
  }

  return {
    ok: false,
    status: 409,
    code: 'INVALID_STATUS_TRANSITION',
    from,
    to,
  };
}

/**
 * Finds all states that have `targetState` in their allowed transitions.
 *
 * @param {string} targetState - The state being entered
 * @returns {string[]} List of valid source states
 * @throws {TypeError} If `targetState` is not in the states list
 */
export function getAllowedSourceStates(targetState) {
  if (typeof targetState !== 'string' || !states.includes(targetState)) {
    throw new TypeError(`Invalid target state: ${targetState}`);
  }

  return states.filter((state) => (transitions[state] || []).includes(targetState));
}

/**
 * Generates the deterministic error message for an invalid transition to `targetState`.
 * Format per D2 & D5: "Claim is not in <allowed source states joined with ' or '> state"
 *
 * @param {string} targetState - The target state attempted
 * @returns {string} The error message string
 * @throws {TypeError} If `targetState` is not in the states list
 */
export function buildErrorMessage(targetState) {
  const sources = getAllowedSourceStates(targetState);
  const formattedSources = sources.join(' or ');
  return `Claim is not in ${formattedSources} state`;
}

/**
 * Builds the HTTP 409 Conflict response payload verbatim according to D2.
 *
 * @param {string} targetState - The attempted target state
 * @returns {{ success: false, message: string, errors: Array<{ code: string, details: string }> }}
 */
export function build409ResponseBody(targetState) {
  const message = buildErrorMessage(targetState);
  return {
    success: false,
    message,
    errors: [
      {
        code: 'INVALID_STATUS_TRANSITION',
        details: message,
      },
    ],
  };
}

/**
 * Builds the service return value for an HTTP 200 transition according to D2.
 *
 * @param {string} targetState - The successfully transitioned target state
 * @returns {{ status: string }}
 */
export function build200ResponseBody(targetState) {
  return {
    status: targetState,
  };
}

export { states, transitions, terminalStates };

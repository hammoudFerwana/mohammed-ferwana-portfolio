import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { states, transitions, terminalStates } from '../data/claimFsm.js';
import { canTransition, buildErrorMessage, getAllowedSourceStates } from './fsm.mjs';

describe('Claim Lifecycle Finite State Machine (FSM)', () => {
  describe('Table Integrity', () => {
    it('contains exactly 10 states', () => {
      assert.equal(states.length, 10);
    });

    it('defines exactly two terminal states: CLOSED and REJECTED', () => {
      assert.deepEqual(terminalStates, ['CLOSED', 'REJECTED']);
    });

    it('ensures every transition target exists in the states list', () => {
      for (const [source, targets] of Object.entries(transitions)) {
        for (const target of targets) {
          assert.ok(
            states.includes(target),
            `Transition target ${target} from ${source} is not a valid state`
          );
        }
      }
    });

    it('ensures terminal states have zero outgoing transitions', () => {
      for (const terminal of terminalStates) {
        assert.deepEqual(
          transitions[terminal],
          [],
          `Terminal state ${terminal} must have zero outgoing transitions`
        );
      }
    });

    it('ensures every state has at least one allowed source state under D1', () => {
      for (const state of states) {
        const sources = getAllowedSourceStates(state);
        assert.ok(
          sources.length > 0,
          `State ${state} has no allowed source states in the transition graph`
        );
      }
    });
  });

  describe('canTransition — Allowed Transitions (HTTP 200)', () => {
    for (const [source, targets] of Object.entries(transitions)) {
      for (const target of targets) {
        it(`allows transition from ${source} to ${target} (returns 200)`, () => {
          const result = canTransition(source, target);
          assert.deepEqual(result, {
            ok: true,
            status: 200,
            code: null,
            from: source,
            to: target,
          });
        });
      }
    }
  });

  describe('canTransition — Forbidden Transitions (HTTP 409)', () => {
    it('rejects stage-skipping transition NEW -> IN_PROGRESS with 409', () => {
      const result = canTransition('NEW', 'IN_PROGRESS');
      assert.deepEqual(result, {
        ok: false,
        status: 409,
        code: 'INVALID_STATUS_TRANSITION',
        from: 'NEW',
        to: 'IN_PROGRESS',
      });
    });

    it('rejects backward transition SUBMITTED -> IN_PROGRESS with 409', () => {
      const result = canTransition('SUBMITTED', 'IN_PROGRESS');
      assert.deepEqual(result, {
        ok: false,
        status: 409,
        code: 'INVALID_STATUS_TRANSITION',
        from: 'SUBMITTED',
        to: 'IN_PROGRESS',
      });
    });

    it('rejects transitions from every terminal state to every other state', () => {
      for (const terminal of terminalStates) {
        for (const target of states) {
          const result = canTransition(terminal, target);
          assert.equal(result.ok, false);
          assert.equal(result.status, 409);
          assert.equal(result.code, 'INVALID_STATUS_TRANSITION');
          assert.equal(result.from, terminal);
          assert.equal(result.to, target);
        }
      }
    });

    it('rejects same-state transition attempts for all states', () => {
      for (const state of states) {
        const result = canTransition(state, state);
        assert.equal(result.ok, false);
        assert.equal(result.status, 409);
        assert.equal(result.code, 'INVALID_STATUS_TRANSITION');
        assert.equal(result.from, state);
        assert.equal(result.to, state);
      }
    });
  });

  describe('canTransition — Validation & Errors', () => {
    it('throws TypeError when source state is unknown', () => {
      assert.throws(
        () => canTransition('NON_EXISTENT_STATE', 'NEW'),
        TypeError
      );
    });

    it('throws TypeError when target state is unknown', () => {
      assert.throws(
        () => canTransition('NEW', 'UNKNOWN_TARGET'),
        TypeError
      );
    });

    it('throws TypeError when arguments are missing or not strings', () => {
      assert.throws(() => canTransition(null, 'NEW'), TypeError);
      assert.throws(() => canTransition('NEW', undefined), TypeError);
    });
  });

  describe('buildErrorMessage (D5 Message Builder)', () => {
    it('yields "Claim is not in ASSIGNED or CORRECTION_REQUIRED state" for IN_PROGRESS', () => {
      const message = buildErrorMessage('IN_PROGRESS');
      assert.equal(
        message,
        'Claim is not in ASSIGNED or CORRECTION_REQUIRED state'
      );
    });

    it('yields "Claim is not in NEW state" for PENDING_ACCEPTANCE', () => {
      const message = buildErrorMessage('PENDING_ACCEPTANCE');
      assert.equal(message, 'Claim is not in NEW state');
    });

    it('throws TypeError for unknown target state', () => {
      assert.throws(() => buildErrorMessage('UNKNOWN_STATE'), TypeError);
    });
  });
});

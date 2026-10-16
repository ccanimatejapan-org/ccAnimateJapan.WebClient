import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUTE_NAMES } from '../../../shared/constants/routes.js';
import { LOGIN_ERROR, resolveLoginFailureRoute } from './loginFailure.js';

// The backend answers every refused login with HTTP 200 + { status: '403', message: <code> }.
// unwrapApiResponse() turns that into an ApiResponseError(message, apiStatus).
const refused = (message) => Object.assign(new Error(message), { apiStatus: '403' });

test('a disabled account goes to the login page with the "disabled" notice, NOT the add-friend page', () => {
  assert.deepEqual(resolveLoginFailureRoute(refused('accountDisabled')), {
    name: ROUTE_NAMES.LOGIN,
    query: { error: LOGIN_ERROR.DISABLED }
  });
  assert.equal(LOGIN_ERROR.DISABLED, 'disabled');
});

test('not being a friend of the official account still goes to the add-friend page', () => {
  assert.deepEqual(resolveLoginFailureRoute(refused('notFriend')), { name: ROUTE_NAMES.LINE_ADD_FRIEND });
});

test('any other 403 keeps the previous behaviour (add-friend page)', () => {
  assert.deepEqual(resolveLoginFailureRoute(refused('Forbidden')), { name: ROUTE_NAMES.LINE_ADD_FRIEND });
});

test('notFriend is recognised by message even when apiStatus is missing', () => {
  assert.deepEqual(resolveLoginFailureRoute(new Error('notFriend')), { name: ROUTE_NAMES.LINE_ADD_FRIEND });
});

test('accountDisabled wins even if apiStatus is missing', () => {
  assert.deepEqual(resolveLoginFailureRoute(new Error('accountDisabled')), {
    name: ROUTE_NAMES.LOGIN,
    query: { error: LOGIN_ERROR.DISABLED }
  });
});

test('everything else (network error, 500, LIFF failure, no error object) is a generic LIFF login error', () => {
  const generic = { name: ROUTE_NAMES.LOGIN, query: { error: LOGIN_ERROR.LIFF } };
  assert.deepEqual(resolveLoginFailureRoute(Object.assign(new Error('Server error'), { apiStatus: '500' })), generic);
  assert.deepEqual(resolveLoginFailureRoute(new Error('Network Error')), generic);
  assert.deepEqual(resolveLoginFailureRoute(undefined), generic);
  assert.deepEqual(resolveLoginFailureRoute(null), generic);
  assert.equal(LOGIN_ERROR.LIFF, 'liff');
});

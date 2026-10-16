import { ROUTE_NAMES } from '../../../shared/constants/routes.js';

// Query values for /auth/login?error=… (LoginPage decides which message to show).
export const LOGIN_ERROR = Object.freeze({
  LIFF: 'liff',
  DISABLED: 'disabled'
});

// The backend answers a refused LINE login with HTTP 200 + { status: '403', message: <code> }.
// unwrapApiResponse() throws ApiResponseError(message, apiStatus) for it.
const MESSAGE_NOT_FRIEND = 'notFriend';
const MESSAGE_ACCOUNT_DISABLED = 'accountDisabled';

// Where to send the user when the LIFF login flow in the router guard throws.
// - accountDisabled: an admin disabled this member. They ARE friends, so the add-friend page would be
//   misleading; show the login page with a "this account cannot be used" notice instead.
// - notFriend / any other 403: ask them to add the official account (previous behaviour).
// - anything else: generic LIFF login error.
export function resolveLoginFailureRoute(error) {
  if (error?.message === MESSAGE_ACCOUNT_DISABLED) {
    return { name: ROUTE_NAMES.LOGIN, query: { error: LOGIN_ERROR.DISABLED } };
  }

  if (error?.apiStatus === '403' || error?.message === MESSAGE_NOT_FRIEND) {
    return { name: ROUTE_NAMES.LINE_ADD_FRIEND };
  }

  return { name: ROUTE_NAMES.LOGIN, query: { error: LOGIN_ERROR.LIFF } };
}

export function isActivityOrderable(activity) {
  return Number(activity?.status) === 3;
}

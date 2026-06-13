export const ADDRESS_KIND = {
  STORE_PICKUP: 1,
  NONE: 2,
  HOME_DELIVERY: 3
};

export function requiresAddress(addressKind) {
  return addressKind !== ADDRESS_KIND.NONE;
}

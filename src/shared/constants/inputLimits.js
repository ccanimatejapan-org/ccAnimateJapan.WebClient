// Free-text limits. They must match the backend (WebAPI: Application/Common/InputLimits.cs); the server rejects
// anything longer, so these only keep a normal customer from ever hitting that error.
export const ADDRESS_MAX_LENGTH = 200;
export const ADDRESS_NAME_MAX_LENGTH = 60;
export const PHONE_MAX_LENGTH = 20;

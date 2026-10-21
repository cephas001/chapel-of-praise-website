const { auth } = require("../config/firebase");

const mergeClaims = (existingClaims, updates) => {
  const nextClaims = { ...(existingClaims || {}) };

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      nextClaims[key] = value;
    }
  });

  return nextClaims;
};

const setUserClaims = async (uid, updates) => {
  const userRecord = await auth.getUser(uid);
  const nextClaims = mergeClaims(userRecord.customClaims, updates);

  await auth.setCustomUserClaims(uid, nextClaims);

  return nextClaims;
};

module.exports = {
  mergeClaims,
  setUserClaims,
};

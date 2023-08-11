import UserModel from "../db/models/UserModel.mjs";
import PunishmentModel from "../db/models/PunishmentModel.mjs";

// list of penalty thresholds and their corresponding punishments
// duration is measured in days
const penaltyThresholds = [
    { threshold: 3, duration: 1 },
    { threshold: 5, duration: 3 },
    { threshold: 7, duration: 7 },
    { threshold: 10, duration: 14 },
    // permanent ban
    { threshold: 12, duration: null },
];

// ==================== FUNCTIONS ====================
// incur penalty
export const incurPenalty = async (userId, penalty, reason) => {
    // get the previous penalty count
    const previousPenaltyCount = await getPenaltyCount(userId);
    const newPenaltyCount = previousPenaltyCount + penalty;
    const punishment = await getPunishment(previousPenaltyCount, newPenaltyCount, reason);

    // update the penalty count
    await UserModel.updateOne({ _id: userId }, { penaltyPoints: newPenaltyCount });

    // if punishment, apply it
    if (punishment) {
        applyPunishment(userId, punishment);
    }
};

// get the penalty count
export const getPenaltyCount = async (userId) => {
    const user = await UserModel.findById(userId).populate({ penaltyPoints: "pen" });
    return user.penaltyPoints;
};

// get the punishment
export const getPunishment = async (prev, curr, reason) => {
    // dont include the last threshold
    for (let i = 0; i < penaltyThresholds.length - 1; i++) {
        const threshold = penaltyThresholds[i].threshold;
        const nextThreshold = penaltyThresholds[i + 1].threshold;

        // if the previous penalty count is less than the current threshold
        // and the current penalty count is greater than or equal to the current threshold
        if (prev < threshold && curr >= threshold) {
            // create a new punishment
            const expiresAt = penaltyThresholds[i].duration ? Date.now() + penaltyThresholds[i].duration * 24 * 60 * 60 * 1000 : null;
            const punishment = new PunishmentModel({
                user: userId,
                expiresAt,
                reason,
            });
            await punishment.save();
            return punishment;
        }
    }
}

// apply the punishment
export const applyPunishment = async (userId, punishment) => {
    await UserModel.updateOne({ _id: userId }, {
        punishment: punishment._id,
    });
}
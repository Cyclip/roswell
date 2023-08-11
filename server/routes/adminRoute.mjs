import express from 'express';
import { authenticationMiddleware, adminMiddleware } from '../middleware/authMiddleware.mjs';
import { applyPunishment, incurPenalty } from '../utils/punishments.mjs';
import UserModel from '../db/models/UserModel.mjs';
import PunishmentModel from '../db/models/PunishmentModel.mjs';

const router = express.Router();

// ==================== ROUTES ====================
// apply punishment to user
router.post("/punish", [authenticationMiddleware, adminMiddleware], async (req, res) => {
    try {
        const userId = req.body.userId;
        const reason = req.body.reason;
        const duration = req.body.duration;

        // check if user exists
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User does not exist'
            });
        }

        // create punishment
        // convert duration from days to milliseconds
        const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
        const punishment = new PunishmentModel({
            user: userId,
            reason,
            duration,
            expiresAt
        });
        punishment.save();

        // apply punishment
        await applyPunishment(user, punishment, reason, duration);

        // return success
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// incur penalty to user
router.post("/penalty", [authenticationMiddleware, adminMiddleware], async (req, res) => {
    try {
        const userId = req.body.userId;
        const punishment = req.body.punishment;
        const reason = req.body.reason;
        const duration = req.body.duration;

        // check if user exists
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User does not exist'
            });
        }

        // apply punishment
        await incurPenalty(user, punishment, reason, duration);

        // return success
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// ==================== EXPORT ====================
export default router;
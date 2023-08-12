import UserModel from '../db/models/UserModel.mjs';
import jwt from 'jsonwebtoken';

// hard authentication (requires token)
export function authenticationMiddleware(req, res, next) {
    // Assuming the token is sent in the Authorization header as "Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log(req.headers, "is none")
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
}


// soft authentication (token is optional)
export function softAuthenticationMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return next();
    }
}


// prevent banned users from accessing routes
export async function banMiddleware(req, res, next) {
    const user = await UserModel.findById(req.user.id)
        .populate('punishment')
        .select('+punishment');

    if (user.punishment) {
        // check if punishment is still active
        if (user.punishment.expiresAt > Date.now()) {
            return res.status(403).json({ message: 'You are currently banned.' });
        } else {
            // remove punishment
            user.punishment = null;
            await user.save();
        }
    }

    next();
}


// admin users only
export async function adminMiddleware(req, res, next) {
    const user = await UserModel.findOne({ _id: req.user.id });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Insufficient permission' });
    }

    next();
}
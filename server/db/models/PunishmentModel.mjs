import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PunishmentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now(),
        select: true,
    },
    expiresAt: {
        type: Date,
        default: null,
        select: true,
        validate: {
            validator: function (value) {
                return value > this.issuedAt;
            }
        }
    },
    reason: {
        type: String,
        default: null,
        select: true,
    }
});

export default mongoose.model('Punishment', PunishmentSchema);
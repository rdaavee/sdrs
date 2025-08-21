import { Document, model, Schema } from "mongoose"

export interface ValidCodeSchemaInterface extends Document {
    identifier: string,
    code: string,
    expiresAt: Date,
}

const ValidCodeSchema: Schema = new Schema({
    identifier: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
    },
})

export const ValidCode = model<ValidCodeSchemaInterface>("ValidCode", ValidCodeSchema)
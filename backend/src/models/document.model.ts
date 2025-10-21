import { Document, model, Schema } from "mongoose"

export interface DocumentSchemaInterface extends Document {
    category: string;
    name: string;
    fee: number;
    active: boolean;
}

const DocumentSchema: Schema = new Schema({
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    fee: {
        type: Number,
        required: true,
        min: 0,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const DocumentModel = model<DocumentSchemaInterface>("Document", DocumentSchema);

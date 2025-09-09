import { Schema, Document, ObjectId, model } from 'mongoose';

export interface RequestReceiptSchemaInterface extends Document {
    _id: ObjectId,
    reference_number: string,
    student_number: string,
    full_name: string,
    current_address: string,
    course: string,
    contact_number: string,
    email_address: string,
    purpose_of_request: string,
    requested_documents: string,
    payment_method: string,
    paid: boolean,
    code: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
}

const RequestReceiptSchema = new Schema({
    reference_number: {
        type: String,
        required: true
    },
    student_number: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    current_address: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    },
    purpose_of_request: {
        type: String,
        required: true
    },
    requested_documents: {
        type: String,
        required: true
    },
    payment_method: {
        type: String,
        enum: ["online", "cashier"],
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: false
    },
    status: {
        type: String,
        enum: ["waiting", "processing", "ready", "released", "accepted", "rejected"],
        default: "waiting"
    },
}, {
    timestamps: true
});

export const RequestReceipt = model<RequestReceiptSchemaInterface>("RequestReceipt", RequestReceiptSchema)
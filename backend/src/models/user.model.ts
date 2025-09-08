import { Schema, Document, ObjectId, model } from 'mongoose';

export interface UserSchemaInterface extends Document {
    _id: ObjectId,
    full_name: string,
    email_address: string,
    password_hash: string,
    role: string,
    status: boolean,
    refresh_token_version: number,
    createdAt?: Date,
    updatedAt?: Date,
}

const UserSchema: Schema = new Schema({
    full_name: {
        type: String,
        required: [true, 'Please enter your full name.'],
    },
    email_address: {
        type: String,
        required: [true, 'Please enter your email address.'],
        unique: true,
    },
    password_hash: {
        type: String,
        required: [true, 'Please enter your password.'],
    },
    role: {
        type: String,
        enum: ["Super Admin", "Middle Admin", "Staff Admin"],
        required: [true, 'Please enter your role.'],
    },
    refresh_token_version: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
});

export const User = model<UserSchemaInterface>("User", UserSchema)
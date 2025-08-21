import { startSession } from "mongoose";
import { ValidCode, ValidCodeSchemaInterface } from "../models/code.model";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/send_email";

export const requestCode = async (email_address: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const code = Math.floor(100000 + Math.random() * 900000);
        const identifier = jwt.sign({ email_address }, process.env.TOKEN as string, {
            expiresIn: "60m",
        });
        await new ValidCode({
            code,
            identifier,
            expiresAt: new Date(Date.now() + 20 * 60 * 1000)
        }).save();

        await session.commitTransaction();
        session.endSession();

        sendEmail(email_address, code.toString());
        return { message: identifier, httpCode: 200 };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return { error: "Internal Server Error", httpCode: 500 };
    }
}

export const verifyCode = async (code: string, identifier: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const user: ValidCodeSchemaInterface | null = await ValidCode.findOne({ identifier });
        if (!user) return { error: "User not found", httpCode: 404 };
        if (user.expiresAt < new Date()) return { error: "Code expired", httpCode: 400 };
        const result: boolean = user.code === code;
        if (!result) return { error: "Invalid Code", httpCode: 400 };
        await ValidCode.deleteOne({ identifier });

        return { message: "Success", httpCode: 200 };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return { error: "Internal Server Error", httpCode: 500 };
    }
}
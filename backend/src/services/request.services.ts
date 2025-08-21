import { startSession } from "mongoose";
import { RequestReceipt, RequestReceiptSchemaInterface } from "../models/request.model";

interface RequestData {
    student_number: string,
    full_name: string,
    current_address: string,
    course: string,
    contact_number: string,
    email_address: string,
    purpose_of_request: string,
    requested_documents: string[],
    payment_method: string,
    paid: boolean,
}
export const saveRequestReceipt = async (data: RequestData) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const code = Math.floor(100000 + Math.random() * 900000);
        const today = new Date();
        const formatted =
            String(today.getMonth() + 1).padStart(2, "0") +
            String(today.getDate()).padStart(2, "0") +
            String(today.getFullYear()).slice(-2);

        const latest_request = await RequestReceipt.findOne({
            reference_number: new RegExp(`^${formatted}SDRS-`),
        })
            .session(session)
            .sort({ createdAt: -1 });

        let increment = 1;
        if (latest_request) {
            const last_part = latest_request.reference_number.split("-")[1];
            const last_increment = parseInt(last_part, 10);
            increment = isNaN(last_increment) ? 1 : last_increment + 1;
        }

        const reference_number = `${today}SDRS-${String(increment).padStart(
            5,
            "0"
        )}`;

        await new RequestReceipt({
            reference_number,
            code,
            ...data
        }).save({ session });

        await session.commitTransaction();
        session.endSession();

        return { message: { reference_number, code }, httpCode: 200 };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return { error: "Internal Server Error", httpCode: 500 };
    }
}
export const getRequestReceipt = async (reference_number: string, code: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const result = RequestReceipt.findOne({
            reference_number,
            code,
        }).session(session);

        if (!result) {
            return { error: "Request not found.", httpCode: 404 }
        }

        await session.commitTransaction();
        session.endSession();

        return { message: result, httpCode: 200 };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return { error: "Internal Server Error", httpCode: 500 };
    }
}
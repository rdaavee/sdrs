import { startSession } from "mongoose";
import { RequestReceipt, RequestReceiptSchemaInterface } from "../models/request.model";

interface RequestData {
    student_number: string,
    full_name: string,
    current_address: string,
    course: string,
    gender: string,
    birthday: string,
    contact_number: string,
    email_address: string,
    last_school_attended: string,
    semester: string,
    school_year: string,
    last_school_year_graduated: string,
    elementary_school: string,
    elementary_year_graduated: string,
    high_school: string,
    highschool_year_graduated: string,
    purpose_of_request: string,
    requested_documents: string,
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

        const reference_number = `${formatted}SDRS-${String(increment).padStart(
            5,
            "0"
        )}`;
        data.requested_documents = JSON.stringify(data.requested_documents)
        console.log("saved")
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
        console.log(error)
        return { error: "Internal Server Error", httpCode: 500 };
    }
}
export const getRequestReceipt = async (reference_number: string, code: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const result = await RequestReceipt.findOne({
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
export const getAllRequestReceipt = async () => {
    const session = await startSession();
    session.startTransaction();

    try {
        const result = await RequestReceipt.find().session(session);

        if (!result) {
            return { error: "No Request found.", httpCode: 404 }
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
export const getAllRequestReceiptStats = async () => {
    const session = await startSession();
    session.startTransaction();

    try {
        const aggregation = await RequestReceipt.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]).session(session);

        const counts: { [key: string]: number } = {};
        for (const item of aggregation) {
            counts[item._id] = item.count;
        }

        const waiting = counts["waiting"] || 0;
        const processing = (counts["processing"] || 0) + (counts["for-review"] || 0);
        const ready = counts["ready"] || 0;
        const active = waiting + processing;

        await session.commitTransaction();
        session.endSession();

        return { message: { active, waiting, processing, ready }, httpCode: 200 };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return { error: "Internal Server Error", httpCode: 500 };
    }
}
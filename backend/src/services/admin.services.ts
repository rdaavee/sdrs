import * as bcrypt from "bcryptjs";
import { User, UserSchemaInterface } from "../models/user.model";
import jwt from 'jsonwebtoken';
import { startSession } from "mongoose";

export const checkEmailAvailability = async (email_address: string): Promise<boolean> => {
    try {
        const result: boolean = (await User.findOne({ email_address: { $regex: new RegExp(`^${email_address}$`, 'i') } })) === null;
        return result;
    } catch (error) {
        return false;
    }
}

export const loginUsertoDatabase = async (user_identifier: string, password: string) => {
    try {
        let result = await User.findOne({
            email_address: { $regex: new RegExp(`^${user_identifier}$`, 'i') }
        });
        if (result) {
            if (await bcrypt.compare(password, result.password_hash)) {
                return { 'message': 'Success', "httpCode": 200 };
            }
            return { 'error': 'Sorry, looks like that\'s the wrong credentials.', "httpCode": 401 };
        }
        return { 'error': 'Sorry, looks like that\'s the wrong credentials.', "httpCode": 404 };
    } catch (e) {
        console.log("irys", e)
        return { 'error': 'Internal Server Error.', "httpCode": 500 };
    }
};
export const signupUsertoDatabase = async (
    full_name: string, email_address: string, password: string, role: string, status: boolean
) => {
    let userCredentialResult;

    try {
        const saltRounds = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(password, saltRounds);
        userCredentialResult = await new User({
            full_name, email_address, password_hash, role, status
        }).save();


        const result: any = await generateAccessAndRefereshTokens(userCredentialResult._id.toString());
        if (result.httpCode === 200) {
            return {
                message: "Success",
                access_token: result.message?.access_token,
                refresh_token: result.message?.refresh_token,
                user_id: userCredentialResult._id,
                role: userCredentialResult.role,
                full_name: userCredentialResult.full_name,
                email_address: userCredentialResult.email_address,
                status: userCredentialResult.status,
                httpCode: 200
            };
        }
        return { error: result.error, httpCode: result.httpCode }
    } catch (error) {
        if (userCredentialResult) {
            await userCredentialResult.deleteOne();
        }
        return { error: "Internal Server Error", httpCode: 500 };
    }
};
export const getDataByUserIdentifier = async (user_identifier: string): Promise<UserSchemaInterface | null> => {
    try {
        const result: UserSchemaInterface | null = await User.findOne({
            email_address: {
                $regex: new RegExp(`^${user_identifier}$`, 'i')
            }
        });
        return result;
    } catch (error) {
        return null;
    }
};

export const generateAccessAndRefereshTokens = async (user_id: string) => {
    try {
        const user = await User.findById(user_id)
        if (!user) {
            return { error: "User not found", httpCode: 404 }
        }
        const access_token = await generateAccessToken(user)
        const refresh_token = await generateRefreshToken(user_id)

        return { message: { access_token, refresh_token }, httpCode: 200 }
    } catch (error) {
        return { error: "Internal Server Error", httpCode: 500 }
    }
}


export const userExists = async (userId: string): Promise<boolean> => {
    try {
        const user = await User.findById(userId).exec();
        return !!user;
    } catch (error) {
        return false
    }
};
export const generateAccessToken = async (user: UserSchemaInterface): Promise<string> => {
    return jwt.sign(
        {
            user_id: user._id,
            email_address: user.email_address,
            role: user.role,
            full_name: user.full_name
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: "30m"
        }
    )
};

export const generateRefreshToken = async (user_id: string): Promise<string> => {
    const refresh_token_version = await getUserRefreshToken(user_id)
    return jwt.sign(
        {
            user_id,
            refresh_token_version
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: "180d"
        }
    )
};
export const getUserRefreshToken = async (user_id: string) => {
    try {
        const user = await User.findById(user_id)
        if (!user) {
            return { error: "User not found", httpCode: 404 }
        }
        return user.refresh_token_version
    } catch (error) {
        return { error: "Internal Server Error", httpCode: 500 }
    }
}
export const getAllUsers = async () => {
    const session = await startSession();
    session.startTransaction();

    try {
        const result = await User.find().session(session);

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
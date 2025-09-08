import { Request, Response } from 'express';
import { checkEveryInputForLogin, checkEveryInputForSignup, checkInputType } from '../utils/input.validator';
import { generateAccessAndRefereshTokens, getAllUsers, getDataByUserIdentifier, loginUsertoDatabase, signupUsertoDatabase } from '../services/admin.services';


export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { user_identifier, password } = req.body;
        const user_identifier_type = await checkInputType(user_identifier);
        const checker_for_input = await checkEveryInputForLogin(user_identifier, password, user_identifier_type);

        if (checker_for_input.httpCode === 200) {
            const data = await loginUsertoDatabase(user_identifier, password);

            if (data.httpCode === 200) {
                const user_data = await getDataByUserIdentifier(user_identifier);

                if (!user_data) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }

                const result = await generateAccessAndRefereshTokens(user_data._id.toString());
                if (result.httpCode !== 200) {
                    res.status(result.httpCode).json({ error: result.error })
                    return;
                }

                res
                    .status(200)
                    .cookie(
                        "refresh_token",
                        result.message?.refresh_token,
                        {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                        }
                    )
                    .json({
                        message: "Success", access_token: result.message?.access_token, user_id: user_data._id, role: user_data.role, full_name: user_data.full_name, email_address: user_data.email_address
                    });
                return;
            }
            res.status(data.httpCode).json({ error: data.error });
            return;
        }
        res.status(checker_for_input.httpCode).json({ error: checker_for_input.error });
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'error': 'Internal Server Error' });
    }
};
export const signupUserController = async (req: Request, res: Response) => {
    try {
        const { full_name, password_hash, role, status } = req.body;

        let email_address: string = req.body.email_address;
        if (!email_address) {
            res.status(404).json({ error: "Email address  not found" });
            return
        }
        email_address = email_address.toLowerCase()
        const requiredFields = {
            full_name,
            password_hash,
            role
        };

        const updatedKey: { [key: string]: string } = {
            full_name: "Full Name",
            password_hash: "Password",
            role: "Role",
        }
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                res.status(400).json({ error: `${updatedKey[key]} is required and cannot be null or undefined.` });
                return;
            }
        }

        const checkerForInput = await checkEveryInputForSignup(email_address, password_hash);
        if (checkerForInput.message === 'Success') {
            const data = await signupUsertoDatabase(full_name, email_address, password_hash, role, status);
            if (data.httpCode !== 200) {
                res.status(500).json({ error: data.error });
                return;
            }
            res
                .status(200)
                .cookie(
                    "refresh_token",
                    data.refresh_token,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                    }
                )
                .json({ message: "Success", access_token: data.access_token, user_id: data.user_id, role: data.role, full_name: data.full_name, email_address: data.email_address });

            return;
        }

        res.status(checkerForInput.httpCode).json({ error: checkerForInput.error });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const result = await getAllUsers()
        if (result.httpCode === 200) {
            return res.status(result.httpCode).json({ message: result.message });
        }
        return res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const checkCurrentUser = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ 'message': 'valid' });
    } catch {
        res.status(500).json({ 'message': 'Internal Server Error' });
        return;
    }
};
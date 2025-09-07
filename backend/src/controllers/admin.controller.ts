import { Request, Response } from 'express';
import { checkEveryInputForLogin, checkInputType } from '../utils/input.validator';
import { generateAccessAndRefereshTokens, getDataByUserIdentifier, loginUsertoDatabase } from '../services/admin.services';


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
        res.status(500).json({ 'error': 'Internal Server Error' });
    }
};
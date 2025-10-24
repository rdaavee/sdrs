import { Request, Response } from 'express';
import { requestCode, verifyCode } from '../services/verify.services';

export const requestCodeController = async (req: Request, res: Response) => {
    try {
        const { email_address } = req.query;

        const result = await requestCode(email_address as string);
        if (result.httpCode === 200) {
            res.status(result.httpCode)
                .cookie(
                    "identifier",
                    result.message,
                    {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                        path: "/",
                    }
                ).json({ message: result.message });
            return;
        }

        res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const verifyCodeController = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        const identifier = req.cookies.identifier;

        if (!code || !identifier) {
            res.status(400).json({ error: 'Bad Request' });
            return;
        }

        const result = await verifyCode(code, identifier);

        if (result.httpCode === 200) {
            res.clearCookie("identifier", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
            });

            res.status(result.httpCode).json({ message: result.message });
            return;
        }
        res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
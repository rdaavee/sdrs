import { ObjectId } from "mongoose";
import { checkEmailAvailability } from "../services/admin.services";


export interface CustomResponse {
    user_id?: ObjectId,
    message?: string | any[];
    error?: string,
    role?: string,
    access_token?: string,
    refresh_token?: string,
    httpCode: number,
    first_name?: string,
    last_name?: string,
    email_address?: string,
    profile?: string,
}
const USER_IDENTIFIER_CONST = { "email_address": "EMAIL_ADDRESS", "phone_number": "PHONE_NUMBER" };

export const checkEveryInputForSignup = async (email_address: string, password: string): Promise<CustomResponse> => {
    if (!checkEmailValidity(email_address)) {
        return { error: 'Please enter a valid email address', "httpCode": 400 };
    }
    if (!checkPasswordValidity(password)) {
        return { error: 'Password must have at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.', "httpCode": 400 };
    }
    if (!(await checkEmailAvailability(email_address))) {
        return { error: 'This email address is being used.', "httpCode": 409 };
    }
    return { message: 'Success', "httpCode": 200 };
};
export const checkEveryEditInputForSignup = async (email_address: string): Promise<CustomResponse> => {
    if (!checkEmailValidity(email_address)) {
        return { error: 'Please enter a valid email address', "httpCode": 400 };
    }
    return { message: 'Success', "httpCode": 200 };
};

export const checkEveryInputForLogin = async (user_identifier: string, password: string, user_identifier_type: string) => {

    if (!checkEmailValidity(user_identifier)) {
        return { 'error': 'Please enter a valid email address', "httpCode": 400 };
    }
    if (!checkPasswordValidity(password)) {
        return { 'error': 'Sorry, looks like that\'s the wrong email or password.', "httpCode": 401 };
    }
    return { 'message': 'success', "httpCode": 200 };
};

export const checkEmailValidity = (email_address: string) => {
    const regex = /^[\w\+]+([\.-]?[\w\+]+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return regex.test(email_address);
};

export const checkPasswordValidity = (password: string) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)./;
    return regex.test(password);
};

export const validateRequiredFields = (fields: Record<string, any>, fieldLabels: Record<string, string>) => {
    for (const [key, value] of Object.entries(fields)) {
        if (value == null) {
            return { valid: false, error: `${fieldLabels[key]} is required and cannot be null or undefined.` };
        }
    }
    return { valid: true };
};

export const checkInputType = async (user_identifier: string) => {
    return user_identifier.includes('@') ? USER_IDENTIFIER_CONST.email_address : USER_IDENTIFIER_CONST.phone_number;
};
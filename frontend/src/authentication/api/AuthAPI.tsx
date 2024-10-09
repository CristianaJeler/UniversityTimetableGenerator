import axios from "axios";
import {AuthProps, SignupProps} from "../provider/AuthProvider";
import {baseUrl, config, withLogs} from "../../core";

const authURL = `http://${baseUrl}/authentication`;

export const signup: (firstName?: string, lastName?: string, email?: string, userType?: string, username?: string, password?: string)
    => Promise<SignupProps> = ((firstName, lastName,
                                email, userType, username, password) => {
    let response = axios.post(authURL + "/signup", {firstName, lastName, email, userType, username, password}, config)
    return withLogs(response, 'signup')
})

export const login: (username?: string, password?: string) => Promise<AuthProps> = ((username, password) => {
    let response = axios.post(authURL + "/login", {username, password}, config);
    return withLogs(response, 'login');
})
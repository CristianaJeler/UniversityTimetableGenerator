import axios from "axios";
import {UserProps} from "../provider/GenericUserProvider"
import {authorizationConfig, baseUrl, withLogs} from "../../core";

const usersURL = `http://${baseUrl}/users`;

export interface ApiResponse{
    message?:string,
    succeeded?:boolean
}

export const updateProfilePic: (picture?:string, token?:string) => Promise<string> = ((picture, token) => {
    let response = axios.put(usersURL + "/profilePic", {picture}, authorizationConfig(token));
    return withLogs(response, 'updateProfilePic')
})

export const getProfileDetails:(token?:string)=>Promise<UserProps>=((token)=>{
    let response = axios.get(usersURL+"/details", authorizationConfig(token));
    return withLogs(response, 'getProfileDetails')
})

export const updateProfileDetails:(details?:UserProps, token?:string)=>Promise<UserProps>=((details, token)=>{
    let response = axios.put(usersURL+"/details",details, authorizationConfig(token));
    return withLogs(response, 'updateProfileDetails')
})

export const updatePassword:(oldPassword?:string, newPassword?:string, token?:string)=>Promise<ApiResponse>=((oldPassword,newPassword, token)=>{
    let response = axios.put(usersURL+"/pass", {oldPassword, newPassword}, authorizationConfig(token));
    return withLogs(response, 'updatePassword')
})

export const getAllTeachers:(token?:string, page?: number, size?: number)=> Promise<any> = (token, page, size) =>{
    let response = axios.get(usersURL + "/teachers"+"/pg="+page+"&s="+size, authorizationConfig(token));
    return withLogs(response, 'getTeachers')
}
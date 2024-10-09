import axios from "axios";
import {authorizationConfig, baseUrl, withLogs} from "../../core";
import {UserProps} from "../../genericUser/provider/GenericUserProvider";
import {RoomsPreferencesProps, TimePreferencesProps} from "../provider/TeacherProvider";
import {time} from "ionicons/icons";
//
// const subjectsURL = `http://${baseUrl}/subjects`;
const formationsURL = `http://${baseUrl}/formations`;
const solverURL = `http://${baseUrl}/solve`;
export const getClassesByTeacher: (token?: string) => Promise<any> = ((token) => {
    let response = axios.get(formationsURL + "/getAssociationsByTeacher/t="+token, authorizationConfig(token));
    return withLogs(response, 'getClassesByTeacher')
})

export const addRoomPreferences: (token?:string, roomPreferences?: RoomsPreferencesProps[]) => Promise<RoomsPreferencesProps[]> = ((token, roomPreferences)=>{
    let response = axios.post(solverURL + "/addRoomPreferences", roomPreferences,authorizationConfig(token));
    return withLogs(response, 'addRoomPreferences')
})

export const addTimePreferences: (token?:string, timePreferences?: TimePreferencesProps[]) => Promise<any> = ((token, timePreferences)=>{
    let response = axios.post(solverURL + "/addTimePreferences", timePreferences,authorizationConfig(token));
    return withLogs(response, 'addTimePreferences')
})


export const getRoomPreferences: (token?:string) => Promise<RoomsPreferencesProps[]> = ((token)=>{
    let response = axios.get(solverURL + "/getRoomPreferences/t="+token, authorizationConfig(token));
    return withLogs(response, 'getRoomPreferences')
})

export const getTimePreferences: (token?:string) => Promise<TimePreferencesProps[]> = ((token)=>{
    let response = axios.get(solverURL + "/getTimePreferences/t="+token, authorizationConfig(token));
    return withLogs(response, 'getTimePreferences')
})

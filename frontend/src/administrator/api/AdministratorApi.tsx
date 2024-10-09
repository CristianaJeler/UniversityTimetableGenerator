import axios from "axios";
import {authorizationConfig, baseUrl, withLogs} from "../../core";
import {BuildingProps, ClassProps, FormationProps, RoomProps, SubjectProps} from "../provider/AdministratorProvider";
import {UserProps} from "../../genericUser/provider/GenericUserProvider";

const subjectsURL = `http://${baseUrl}/subjects`;
const formationsURL = `http://${baseUrl}/formations`;
const solverURL = `http://${baseUrl}/solve`;
const classesURL = `http://${baseUrl}/classes`;
const roomsURL = `http://${baseUrl}/rooms`;


export const addSubject: (subject?: SubjectProps, token?: string) => Promise<any> = ((subject, token) => {
    let response = axios.post(subjectsURL + "/newSubject", subject, authorizationConfig(token));
    return withLogs(response, 'addNewSubject')
})
export const updateSubject: (subject?: SubjectProps, token?: string) => Promise<any> = ((subject, token) => {
    let response = axios.put(subjectsURL + "/updateSubject", subject, authorizationConfig(token));
    return withLogs(response, 'updateSubject')
})

export const searchSubjects: (searchCriteria?: string, page?: number, size?: number, token?: string) => Promise<SubjectProps[]> = ((searchCriteria, page, size, token) => {
    let response = axios.get(subjectsURL + "/crt=" + searchCriteria + "/pg=" + page + "&s=" + size, authorizationConfig(token));
    return withLogs(response, 'searchSubjects')
})

export const addBuilding: (building?: BuildingProps, token?: string) => Promise<any> = ((building, token) => {
    let response = axios.post(roomsURL + "/newBuilding", building, authorizationConfig(token));
    return withLogs(response, 'addNewSubject')
})

export const getAllBuildings: (token?: string) => Promise<any> = ((token) => {
    let response = axios.get(roomsURL + "/getBuildings", authorizationConfig(token));
    return withLogs(response, 'getBuildings')
})

export const addRoom: (room?: RoomProps, token?: string) => Promise<any> = ((room, token) => {
    let response = axios.post(roomsURL + "/newRoom", room, authorizationConfig(token));
    return withLogs(response, 'addNewSubject')
})

export const getAllRoomsInBuilding: (building?: string, token?: string) => Promise<RoomProps[]> = ((building, token) => {
    let response = axios.get(roomsURL + "/getRoomsInBuilding/building=" + building, authorizationConfig(token));
    return withLogs(response, 'getRooms')
})

export const getAllFormations: (token?: string, classType?: number, page?: number, size?: number) => Promise<any> = (token, classType, page, size) => {
    let response = axios.get(formationsURL + "/type=" + classType + "&pg=" + page + "&s=" + size, authorizationConfig(token));
    return withLogs(response, 'getFormations')
}

export const getYears: (token?: string) => Promise<any> = (token) => {
    let response = axios.get(formationsURL + "/type=1&pg=0&s=0", authorizationConfig(token));
    return withLogs(response, 'getYears')
}

export const getGroups: (token?: string) => Promise<any> = (token) => {
    let response = axios.get(formationsURL + "/type=2&pg=0&s=0", authorizationConfig(token));
    return withLogs(response, 'getGroups')
}

export const generateTimetable: (semester?: number, token?: string) => Promise<RoomProps[]> = ((semester, token) => {
    let response = axios.get(solverURL + "/sem=" + semester+"/t="+token, authorizationConfig(token));
    return withLogs(response, 'generateTimetable')
})

export const fetchTimetable: (token?: string) => Promise<any> = (token) => {
    let response = axios.get(solverURL + "/get-last-timetable", authorizationConfig(token));
    return withLogs(response, 'getLastTimetable')
}
export const associateTeacherClassFormation: (token?: string, teacherId?: string, subjectId?: string, classType?: number, formationId?: string, semester?: number, type?: number)
    => Promise<any> = (token, teacherId, subjectId, classType, formationId, semester, type) => {
    let response = axios.post(classesURL + "/addAssociation", {
        teacherId,
        subjectId,
        classType,
        formationId
    }, authorizationConfig(token));
    return withLogs(response, 'addAssociation')
}

export const addNewFormation: (token?: string, formation?: FormationProps) => Promise<any> = (token, formation) => {
    let response = axios.post(formationsURL + "/addNewFormation", formation,
        authorizationConfig(token));
    return withLogs(response, 'addNewFormation')
}

export const saveAssociation: (token?: string, teacherId?: string, subjectId?:string, formationId?:string, classType?:number) => Promise<any> = (token, teacherId?: string, subjectId?:string, formationId?:string, classType?:number) => {
    let response = axios.post(formationsURL + "/addNewAssociation",
        {teacher:teacherId, subject:subjectId, formation:formationId, classType:classType},
        authorizationConfig(token));
    return withLogs(response, 'addNewAssociation')
}

export const getAllClasses: (token?: string) => Promise<any> = ((token) => {
    let response = axios.get(classesURL + "/getClasses", authorizationConfig(token));
    return withLogs(response, 'getAllClasses')
})

export const getAllAssociations: (token?: string) => Promise<any> = ((token) => {
    let response = axios.get(formationsURL + "/getAllAssociations", authorizationConfig(token));
    return withLogs(response, 'getAllAssociations')
})

export const addNewClass: (token?: string, newClass?:ClassProps) => Promise<any> = ((token, newClass) => {
    let response = axios.post(classesURL+ "/addClass", newClass,authorizationConfig(token));
    return withLogs(response, 'getAllAssociations')
})
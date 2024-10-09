import React, {useCallback, useContext, useReducer} from 'react';
import PropTypes from 'prop-types';
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {
    getClassesByTeacher as getClassesByTeacherAPI,
    addRoomPreferences as addRoomPreferencesAPI,
    addTimePreferences as addTimePreferencesAPI,
    getTimePreferences as getTimePreferencesAPI,
    getRoomPreferences as getRoomPreferencesAPI
} from '../api/TeacherApi'
import {getAllClasses} from "../../administrator/api/AdministratorApi";
import {all} from "axios";

type GetClassesByTeacherFunction = () => void;
type GetTeachersRoomPreferencesFunction = () => void;
type GetTeachersTimePreferencesFunction = () => void;
type AddTeacherPreferencesFunction = (roomPreferences: RoomsPreferencesProps[], timePreferences: TimePreferencesProps[]) => void;

export interface RoomsPreferencesProps {
    id: {
        teacherId: string,
        classId: string
    },
    preferredRooms: string[],
    preferredBoards: string[],
    preferredDevices: string[],
    wantsProjector: number,
    preferredBuildings: string[],
}

export interface TimePreferencesProps {
    id: {
        teacherId: string,
        dayId: number
    },
    availableAllDay: number,
    timeIntervals: number[],
    maxHoursPerDay: number
}

export interface TeacherClassProperty {
    classId: string,
    classType: number,
    subjectId: string,
    subjectName: string

}

export interface TeacherState {
    teachersClasses: TeacherClassProperty[],
    getClassesByTeacher?: GetClassesByTeacherFunction,
    gettingClassesByTeacher: boolean,
    getClassesByTeacherError: Error | null,
    getClassesByTeacherSucceeded: boolean,
    subjects: string[],
    teachersRoomsPreferences: RoomsPreferencesProps[],
    teachersTimePreferences: TimePreferencesProps[],
    savePreferences?: AddTeacherPreferencesFunction,
    getTeachersRoomsPreferences?: GetTeachersRoomPreferencesFunction,
    getTeachersTimePreferences?: GetTeachersTimePreferencesFunction
    // ADD ROOM PREFERENCES
    addingRoomPreferences: boolean,
    addRoomPreferencesError: Error | null,
    addedRoomPreferencesSuccessfully: boolean,
    // GET ROOM PREFERENCES
    gettingRoomPreferences: boolean,
    getRoomPreferencesError: Error|null,
    gotRoomPreferencesSuccessfully: boolean
    // GET TIME PREFERENCES
    gettingTimePreferences: boolean,
    getTimePreferencesError: Error|null,
    gotTimePreferencesSuccessfully: boolean
    // ADD TIME PREFERENCES
    addingTimePreference: boolean,
    addTimePreferenceError: Error|null,
    addedTimePreferenceSuccessfully: boolean
}

const initialState: TeacherState = {
    getClassesByTeacherError: null,
    getClassesByTeacherSucceeded: false,
    gettingClassesByTeacher: false,
    teachersClasses: [],
    subjects: [],
    teachersTimePreferences: [],
    teachersRoomsPreferences: [],
    // ADD ROOM PREFERENCES
    addingRoomPreferences: false,
    addRoomPreferencesError: null,
    addedRoomPreferencesSuccessfully: false,

    // GET ROOM PREFERENCES
    gettingRoomPreferences: false,
    getRoomPreferencesError: null,
    gotRoomPreferencesSuccessfully: false,
    // GET TIME PREFERENCES
    gettingTimePreferences: false,
    getTimePreferencesError: null,
    gotTimePreferencesSuccessfully: false,
    // ADD TIME PREFERENCES
    addingTimePreference: false,
    addTimePreferenceError: null,
    addedTimePreferenceSuccessfully: false

}

export const TeacherContext = React.createContext<TeacherState>(initialState);

interface TeacherProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProperties {
    type: string,
    payload?: any,
}

const GET_CLASSES_BY_TEACHER_STARTED = "GET_CLASSES_BY_TEACHER_STARTED"
const GET_CLASSES_BY_TEACHER_FAILED = 'GET_CLASSES_BY_TEACHER_FAILED'
const GET_CLASSES_BY_TEACHER_SUCCEEDED = "GET_CLASSES_BY_TEACHER_SUCCEEDED"

const ADD_TIME_PREFERENCES_FOR_CLASS_STARTED = "ADD_TIME_PREFERENCES_FOR_CLASS_STARTED"
const ADD_TIME_PREFERENCES_FOR_CLASS_FAILED = 'ADD_TIME_PREFERENCES_FOR_CLASS_FAILED'
const ADD_TIME_PREFERENCES_FOR_CLASS_SUCCEEDED = "ADD_TIME_PREFERENCES_FOR_CLASS_SUCCEEDED"

const ADD_ROOM_PREFERENCES_FOR_CLASS_STARTED = "ADD_ROOM_PREFERENCES_FOR_CLASS_STARTED"
const ADD_ROOM_PREFERENCES_FOR_CLASS_FAILED = 'ADD_ROOM_PREFERENCES_FOR_CLASS_FAILED'
const ADD_ROOM_PREFERENCES_FOR_CLASS_SUCCEEDED = "ADD_ROOM_PREFERENCES_FOR_CLASS_SUCCEEDED"

const GET_TEACHERS_ROOMS_PREFERENCES_STARTED = "GET_TEACHERS_ROOMS_PREFERENCES_STARTED"
const GET_TEACHERS_ROOMS_PREFERENCES_SUCCEEDED = "GET_TEACHERS_ROOMS_PREFERENCES_SUCCEEDED"
const GET_TEACHERS_ROOMS_PREFERENCES_FAILED = "GET_TEACHERS_ROOMS_PREFERENCES_FAILED"

const GET_TEACHERS_TIME_PREFERENCES_STARTED = "GET_TEACHERS_TIME_PREFERENCES_STARTED"
const GET_TEACHERS_TIME_PREFERENCES_SUCCEEDED = "GET_TEACHERS_TIME_PREFERENCES_SUCCEEDED"
const GET_TEACHERS_TIME_PREFERENCES_FAILED = "GET_TEACHERS_TIME_PREFERENCES_FAILED"

const reducer: (state: TeacherState, action: ActionProperties) => TeacherState =
    (state, {type, payload}) => {
        switch (type) {
            case GET_CLASSES_BY_TEACHER_STARTED:
                return {
                    ...state,
                    gettingClassesByTeacher: true,
                    getClassesByTeacherSucceeded: false,
                    getClassesByTeacherError: null
                }
            case GET_CLASSES_BY_TEACHER_FAILED:
                return {
                    ...state,
                    gettingClassesByTeacher: false,
                    getClassesByTeacherSucceeded: false,
                    getClassesByTeacherError: payload.error
                }
            case GET_CLASSES_BY_TEACHER_SUCCEEDED:
                let allSubjects:string[] = []
                for (let c of payload.fetchedClasses) {
                    if (c.subjectName !== undefined && !allSubjects.includes(c.subjectName)) {
                        allSubjects.push(c.subjectName)
                    }
                }
                return {
                    ...state,
                    subjects: allSubjects,
                    teachersClasses: payload.fetchedClasses,
                    gettingClassesByTeacher: false,
                    getClassesByTeacherSucceeded: true,
                    getClassesByTeacherError: null
                }
            case ADD_ROOM_PREFERENCES_FOR_CLASS_STARTED:
                return {
                    ...state,
                    addingRoomPreferences: true,
                    addedRoomPreferencesSuccessfully: false,
                    addRoomPreferencesError: null
                }
            case ADD_ROOM_PREFERENCES_FOR_CLASS_FAILED:
                return {
                    ...state,
                    addingRoomPreferences: false,
                    addedRoomPreferencesSuccessfully: false,
                    addRoomPreferencesError: payload.error
                }
            case ADD_ROOM_PREFERENCES_FOR_CLASS_SUCCEEDED:
                let allPreferences = [... state.teachersRoomsPreferences || []]

                for(let pref of payload.addedRoomPreferences){
                    let prefExists = allPreferences.find(p=>p.id.classId===pref.id.classId);
                    if(prefExists){
                        let idx = allPreferences.indexOf(prefExists);
                        allPreferences.splice(idx, 1, pref)
                    }else{
                        allPreferences.push(pref)
                    }
                }

                return {
                    ...state,
                    teachersRoomsPreferences: allPreferences,
                    addingRoomPreferences: false,
                    addedRoomPreferencesSuccessfully: true,
                    addRoomPreferencesError: null
                }
            case ADD_TIME_PREFERENCES_FOR_CLASS_STARTED:
                return {
                    ...state,
                    addingT: true,
                    addedRoomPreferencesSuccessfully: false,
                    addRoomPreferencesError: null
                }
            case ADD_TIME_PREFERENCES_FOR_CLASS_FAILED:
                return {
                    ...state,
                    addingRoomPreferences: false,
                    addedRoomPreferencesSuccessfully: false,
                    addRoomPreferencesError: payload.error
                }
            case ADD_TIME_PREFERENCES_FOR_CLASS_SUCCEEDED:
                let allTimePreferences = [... state.teachersTimePreferences || []]

                for(let pref of payload.addedTimePreferences){
                    let prefExists = allTimePreferences.find(p=>p.id.dayId===pref.id.dayId);
                    if(prefExists){
                        let idx = allTimePreferences.indexOf(prefExists);
                        allTimePreferences.splice(idx, 1, pref)
                    }else{
                        allTimePreferences.push(pref)
                    }
                }

                return {
                    ...state,
                    teachersTimePreferences: allTimePreferences,
                    addingRoomPreferences: false,
                    addedRoomPreferencesSuccessfully: true,
                    addRoomPreferencesError: null
                }
            case GET_TEACHERS_ROOMS_PREFERENCES_STARTED:
                return {
                    ...state,
                    gettingRoomPreferences: true,
                    gotTimePreferencesSuccessfully: false,
                    getRoomPreferencesError: null
                }
            case GET_TEACHERS_ROOMS_PREFERENCES_FAILED:
                return {
                    ...state,
                    gettingRoomPreferences: false,
                    gotTimePreferencesSuccessfully: false,
                    getRoomPreferencesError: payload.error
                }
            case GET_TEACHERS_ROOMS_PREFERENCES_SUCCEEDED:
                return {
                    ...state,
                    teachersRoomsPreferences: payload.fetchedRoomPreferences,
                    gettingRoomPreferences: false,
                    gotTimePreferencesSuccessfully: true,
                    getRoomPreferencesError: null
                }

            case GET_TEACHERS_TIME_PREFERENCES_STARTED:
                return {
                    ...state,
                    gettingTimePreferences: true,
                    gotTimePreferencesSuccessfully: false,
                    getTimePreferencesError: null
                }
            case GET_TEACHERS_TIME_PREFERENCES_FAILED:
                return {
                    ...state,
                    gettingTimePreferences: false,
                    gotTimePreferencesSuccessfully: false,
                    getTimePreferencesError: payload.error
                }
            case GET_TEACHERS_TIME_PREFERENCES_SUCCEEDED:
                console.log("PREFS FOR TIME: "+JSON.stringify(payload.fetchedTimePreferences))
                let fetchedPreferences:TimePreferencesProps[] = [... payload.fetchedTimePreferences || []]
                for (let d = 1; d < 6; d++) {
                    let teacherDayValue =
                        fetchedPreferences.find(day => day.id.dayId === d)

                    if (!teacherDayValue) {
                        fetchedPreferences.push({id: {teacherId: "", dayId: d}, maxHoursPerDay: 0, availableAllDay: 0, timeIntervals: []})
                    }
                }

                return {
                    ...state,
                    teachersTimePreferences: fetchedPreferences,
                    gettingTimePreferences: false,
                    gotTimePreferencesSuccessfully: true,
                    getTimePreferencesError: null
                }
            default:
                return state;
        }
    }
;


export const TeacherProvider: React.FC<TeacherProviderProps> = ({children}) => {
    const {token} = useContext(LoginContext)
    const getClassesByTeacher = useCallback<GetClassesByTeacherFunction>(getClassesCallback, [token])

    const savePreferences = useCallback<AddTeacherPreferencesFunction>(savePreferencesCallback, [token])
    const getTeachersRoomsPreferences = useCallback<GetTeachersRoomPreferencesFunction>(getRoomPreferencesCallback, [token])
    const getTeachersTimePreferences = useCallback<GetTeachersTimePreferencesFunction>(getTimePreferencesCallback, [token])
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        teachersClasses,
        getClassesByTeacherSucceeded,
        getClassesByTeacherError,
        gettingClassesByTeacher,
        subjects,
        teachersTimePreferences,
        addingRoomPreferences,
        addedRoomPreferencesSuccessfully,
        addRoomPreferencesError,
        getRoomPreferencesError,
        getTimePreferencesError,
        gettingRoomPreferences,
        gettingTimePreferences,
        gotRoomPreferencesSuccessfully,
        gotTimePreferencesSuccessfully,
        teachersRoomsPreferences,
        addingTimePreference,
        addedTimePreferenceSuccessfully,
        addTimePreferenceError
    } = state

    async function savePreferencesCallback(roomPreferences: RoomsPreferencesProps[], timePreferences: TimePreferencesProps[]) {
        let canceled = false;

        if (timePreferences.length > 0) saveTimePreferences();
        if (roomPreferences.length > 0) saveRoomPreferences();
        return () => {
            canceled = true;
        }

        async function saveTimePreferences() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: ADD_TIME_PREFERENCES_FOR_CLASS_STARTED});
                const addedTimePreferences = await addTimePreferencesAPI(token, timePreferences);
                if (!canceled)
                    if (addedTimePreferences) {
                        dispatch({type: ADD_TIME_PREFERENCES_FOR_CLASS_SUCCEEDED, payload: {addedTimePreferences}});
                    }

            } catch (error) {
                dispatch({type: ADD_TIME_PREFERENCES_FOR_CLASS_FAILED, payload: {error}});
            }

        }

        async function saveRoomPreferences() {
            console.log("==== to save rooms prefs: "+ JSON.stringify(roomPreferences))
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: ADD_ROOM_PREFERENCES_FOR_CLASS_STARTED});
                const addedRoomPreferences = await addRoomPreferencesAPI(token, roomPreferences);
                if (!canceled)
                    if (addedRoomPreferences) {
                        dispatch({type: ADD_ROOM_PREFERENCES_FOR_CLASS_SUCCEEDED, payload: {addedRoomPreferences}});
                    }

            } catch (error) {
                dispatch({type: ADD_ROOM_PREFERENCES_FOR_CLASS_FAILED, payload: {error}});
            }

        }
    }
    async function getRoomPreferencesCallback() {
        let canceled = false;
        getRoomPreferences();
        return () => {
            canceled = true;
        }

        async function getRoomPreferences() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: GET_TEACHERS_ROOMS_PREFERENCES_STARTED});
                const fetchedRoomPreferences = await getRoomPreferencesAPI(token);
                if (!canceled)
                    if (fetchedRoomPreferences) {
                        dispatch({type: GET_TEACHERS_ROOMS_PREFERENCES_SUCCEEDED, payload: {fetchedRoomPreferences}});
                    }

            } catch (error) {
                dispatch({type: GET_TEACHERS_ROOMS_PREFERENCES_FAILED, payload: {error}});
            }

        }
    }

    async function getTimePreferencesCallback() {
        let canceled = false;
        getTimePreferences();
        return () => {
            canceled = true;
        }

        async function getTimePreferences() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: GET_TEACHERS_TIME_PREFERENCES_STARTED});
                const fetchedTimePreferences = await getTimePreferencesAPI(token);
                if (!canceled)
                    if (fetchedTimePreferences) {
                        dispatch({type: GET_TEACHERS_TIME_PREFERENCES_SUCCEEDED, payload: {fetchedTimePreferences}});
                    }

            } catch (error) {
                dispatch({type: GET_TEACHERS_TIME_PREFERENCES_FAILED, payload: {error}});
            }

        }
    }

    async function getClassesCallback() {
        let canceled = false;
        getAllClassesByTeacher();
        return () => {
            canceled = true;
        }

        async function getAllClassesByTeacher() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: GET_CLASSES_BY_TEACHER_STARTED});
                const fetchedClasses = await getClassesByTeacherAPI(token);
                if (!canceled)
                    if (fetchedClasses) {
                        dispatch({type: GET_CLASSES_BY_TEACHER_SUCCEEDED, payload: {fetchedClasses}});
                    }

            } catch (error) {
                dispatch({type: GET_CLASSES_BY_TEACHER_FAILED, payload: {error}});
            }

        }
    }

    return (
        <TeacherContext.Provider value={{
            getClassesByTeacher,
            getClassesByTeacherError,
            getClassesByTeacherSucceeded,
            gettingClassesByTeacher,
            teachersClasses,
            subjects,
            savePreferences,
            addingRoomPreferences,
            addedRoomPreferencesSuccessfully,
            addRoomPreferencesError,
            getRoomPreferencesError,
            getTimePreferencesError,
            gettingRoomPreferences,
            gettingTimePreferences,
            getTeachersRoomsPreferences,
            getTeachersTimePreferences,
            gotRoomPreferencesSuccessfully,
            gotTimePreferencesSuccessfully,
            teachersRoomsPreferences,
            teachersTimePreferences,
            addedTimePreferenceSuccessfully,
            addingTimePreference,
            addTimePreferenceError
        }}>
            {children}
        </TeacherContext.Provider>
    );
}

import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {
    addBuilding as addNewBuildingAPI,
    addRoom as addNewRoomAPI,
    addSubject as addSubjectAPI,
    fetchTimetable as fetchTimetableAPI,
    generateTimetable as generateTimetableAPI,
    getAllBuildings as fetchAllBuildingsAPI,
    getAllFormations as getAllFormationsAPI,
    getAllRoomsInBuilding as getAllRoomsAPI,
    searchSubjects as searchSubjectsAPI,
    updateSubject as updateSubjectAPI,
    getYears as getYearsAPI,
    getGroups as getGroupsAPI,
    addNewFormation as addFormationAPI,
    getAllClasses as fetchAllClassesAPI,
    saveAssociation as saveAssociationAPI,
    getAllAssociations as getAssociationsAPI,
    addNewClass as addClassAPI,
} from "../api/AdministratorApi"

import {getAllTeachers as fetchAllTeachersAPI} from "../../genericUser/api/GenericUserApi"
import {UserProps} from "../../genericUser/provider/GenericUserProvider";


type AddNewSubjectFunction = (subject: SubjectProps) => Promise<any>;
type UpdateSubjectFunction = (subject: SubjectProps) => Promise<any>;
type SearchSubjectsFunction = (searchCriteria?: string, page?: number, size?: number) => void;

type AddNewBuildingFunction = (building: BuildingProps) => Promise<any>;
type FetchBuildingsFunction = () => void;

type AddNewRoomFunction = (room: RoomProps) => Promise<any>;
type FetchRoomsFunction = (building: string) => void;
type FetchTeachersFunction = (page: number, size: number) => void;
type FetchFormationsFunction = (classType?: number | undefined, page?: number | undefined, size?: number) => void;
type FetchTimetableFunction = () => void;
type GenerateTimetableFunction = (semester: number) => void;
type AddNewFormationFunction = (formation: FormationProps) => Promise<any>;
type FetchAllClassesFunction = () => void;
type AddNewAssociationFunction = (teacherId?: string, classType?: number, subjectId?: string, formationId?: string) => void;
type FetchAllAssociations = ()=>void;
type AddClassFunction = (newClass?:ClassProps)=>void;

export interface AssociationProps {
    id?: string,
    teacher?: string,
    classType?: number,
    subject?: string,
    formation?: string
}

export interface SubjectProps {
    id?: string,
    code?: string,
    name?: string,
    type?: number
}

export interface BuildingProps {
    id?: string,
    name?: string,
    address?: string
}

export interface RoomProps {
    id?: string,
    buildingId?: string,
    code?: string,
    capacity?: number,
    boards?: string[],
    devices?: string[],
    projector?: number,
    description?: string
}

export interface FormationProps {
    code?: string,
    type?: number,
    year?: string | null,
    group?: string | null,
    members?: number
}

export interface TimetableEntry {
    id?: string,
    teacher?: string,
    subjectName?: string,
    classType?: string,
    formation?: string,
    room?: string,
    day?: number,
    time?: number,
    week?: number
}

export interface ClassProps {
    id?: string,
    subjectId?: string,
    classType?: number,
    frequency?: number
}

export interface AdminState {
    socket:WebSocket | null,
    addNewSubject?: AddNewSubjectFunction,
    subjects: SubjectProps[],
    searchSubjects?: SearchSubjectsFunction,
    updateSubject?: UpdateSubjectFunction,
    buildings?: BuildingProps[],
    rooms?: RoomProps[],
    addNewBuilding?: AddNewBuildingFunction,
    fetchBuildings?: FetchBuildingsFunction,
    addNewRoom?: AddNewRoomFunction,
    fetchRooms?: FetchRoomsFunction,
    teachers?: UserProps[],
    fetchTeachers?: FetchTeachersFunction,
    formations?: FormationProps[],
    groups?: FormationProps[],
    years?: FormationProps[],
    addNewFormation?: AddNewFormationFunction,
    fetchFormations?: FetchFormationsFunction,
    fetchGroups?: FetchFormationsFunction,
    fetchYears?: FetchFormationsFunction,
    fetchTimetable?: FetchTimetableFunction,
    generateTimetable?: GenerateTimetableFunction,
    timetable?: TimetableEntry[],
    progress:number,
    // ADD SUBJECT
    addingNewSubject: boolean,
    subjectAddError: Error | null,
    subjectAddedSuccessfully: boolean,
    // UPDATE SUBJECT
    updatingSubject: boolean,
    subjectUpdateError: Error | null,
    subjectUpdatedSuccessfully: boolean,
    // FETCH SUBJECTS
    fetchingSubjects: boolean,
    fetchSubjectsError: Error | null,
    subjectsFetchedSuccessfully: boolean,
    // FETCH BUILDINGS
    fetchingBuildings: boolean,
    buildingsFetchError: Error | null,
    buildingsFetchedSuccessfully: boolean
    // ADD BUILDING
    addingBuilding: boolean,
    addBuildingError: Error | null,
    buildingAddedSuccessfully: boolean
    // FETCH ROOMS
    fetchingRooms: boolean,
    fetchRoomsError: Error | null,
    roomsFetchedSuccessfully: boolean
    // ADD ROOM
    addingNewRoom: boolean,
    addNewRoomError: Error | null,
    newRoomAddedSuccessfully: boolean
    // FETCH TEACHERS
    fetchingTeachers: boolean,
    fetchTeachersError: Error | null,
    teachersFetchedSuccessfully: boolean
    // FETCH FORMATIONS
    fetchingFormations: boolean,
    fetchFormationsFailed: Error | null,
    formationsFetchedSuccessfully: boolean
    // FETCH TIMETABLE
    fetchingTimetable: boolean,
    timetableFetchError: Error | null,
    timetableFetchedSuccessfully: boolean
    // FETCH YEARS & GROUPS
    yearsFetchedSuccessfully: boolean,
    groupsFetchedSuccessfully: boolean,
    // ADD FORMATION
    addingNewFormation: boolean,
    addNewFormationError: Error | null,
    newFormationAddedSuccessfully: boolean,
    // FETCH CLASSES
    fetchingAllClasses: boolean,
    fetchClassesError: Error | null,
    fetchedCLassesSuccessfully: boolean
    fetchClasses?: FetchAllClassesFunction,
    classes: ClassProps[]
    // ADD ASSOCIATION
    addingNewAssociation: boolean,
    addNewAssociationError: Error | null,
    addNewAssociationSuccessfully: boolean,
    addNewAssociation?: AddNewAssociationFunction,
    associations: AssociationProps[],
    // FETCH ASSOCIATIONS
    fetchingAssociations: boolean,
    fetchAssociationsError: Error | null,
    fetchedAssociationsSuccessfully: boolean,
    fetchAllAssociations?: FetchAllAssociations,
    //ADD CLASS
    addingClass: boolean,
    addClassError: Error | null,
    addedClassSuccessfully: boolean,
    addNewClass?:AddClassFunction,
    // TIMETABLE GENERATION PROGRESS STATUS
    timetableGenerationProgressStatus:string,
}

const initialState: AdminState = {
    socket:null,
    subjects: [],
    buildings: [],
    rooms: [],
    teachers: [],
    formations: [],
    timetable: [],
    groups: [],
    years: [],
    classes: [],
    progress:0,

    // ADD SUBJECT
    addingNewSubject: false,
    subjectAddError: null,
    subjectAddedSuccessfully: false,
    // UPDATE SUBJECT
    updatingSubject: false,
    subjectUpdateError: null,
    subjectUpdatedSuccessfully: false,
    // FETCH SUBJECTS
    fetchingSubjects: false,
    fetchSubjectsError: null,
    subjectsFetchedSuccessfully: false,
    // FETCH BUILDINGS
    fetchingBuildings: false,
    buildingsFetchError: null,
    buildingsFetchedSuccessfully: false,
    // ADD BUILDING
    addingBuilding: false,
    addBuildingError: null,
    buildingAddedSuccessfully: false,
    //FETCH ROOMS
    fetchingRooms: false,
    fetchRoomsError: null,
    roomsFetchedSuccessfully: false,
    // ADD ROOM
    addingNewRoom: false,
    addNewRoomError: null,
    newRoomAddedSuccessfully: false,
    // FETCH TEACHERS
    fetchingTeachers: false,
    fetchTeachersError: null,
    teachersFetchedSuccessfully: false,
    // FETCH FORMATIONS
    fetchingFormations: false,
    fetchFormationsFailed: null,
    formationsFetchedSuccessfully: false,
    // FETCH TIMETABLE
    fetchingTimetable: false,
    timetableFetchError: null,
    timetableFetchedSuccessfully: false,
    // FETCH GROUPS & YEARS
    yearsFetchedSuccessfully: false,
    groupsFetchedSuccessfully: false,
    // ADD FORMATION
    addingNewFormation: false,
    addNewFormationError: null,
    newFormationAddedSuccessfully: false,
    // FETCH CLASSES
    fetchingAllClasses: false,
    fetchClassesError: null,
    fetchedCLassesSuccessfully: false,
    // ADD ASSOCIATION
    addingNewAssociation: false,
    addNewAssociationError: null,
    addNewAssociationSuccessfully: false,
    associations: [],
    // FETCH ASSOCIATIONS
    fetchingAssociations: false,
    fetchAssociationsError: null,
    fetchedAssociationsSuccessfully: false,
    //ADD CLASS
    addingClass: false,
    addClassError:  null,
    addedClassSuccessfully: false,
    // TIMETABLE GENERATION PROGRESS STATUS
    timetableGenerationProgressStatus:"Timetable generation status...",

}

export const AdminContext = React.createContext<AdminState>(initialState);

interface AdminProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProperties {
    type: string,
    payload?: any,
}

const ADD_SUBJECT_SUCCEEDED = 'ADD_SUBJECT_SUCCEEDED'
const ADD_SUBJECT_FAILED = 'ADD_SUBJECT_FAILED'
const ADD_SUBJECT_STARTED = 'ADD_SUBJECT_STARTED'

const UPDATE_SUBJECT_SUCCEEDED = 'UPDATE_SUBJECT_SUCCEEDED'
const UPDATE_SUBJECT_FAILED = 'UPDATE_SUBJECT_FAILED'
const UPDATE_SUBJECT_STARTED = 'UPDATE_SUBJECT_STARTED'

const FETCH_SUBJECTS_SUCCEEDED = 'FETCH_SUBJECTS_SUCCEEDED'
const FETCH_SUBJECTS_FAILED = 'FETCH_SUBJECTS_FAILED'
const FETCH_SUBJECTS_STARTED = 'FETCH_SUBJECTS_STARTED'

const FETCH_BUILDINGS_SUCCEEDED = 'FETCH_BUILDINGS_SUCCEEDED'
const FETCH_BUILDINGS_FAILED = 'FETCH_BUILDINGS_FAILED'
const FETCH_BUILDINGS_STARTED = 'FETCH_BUILDINGS_STARTED'

const ADD_BUILDINGS_SUCCEEDED = 'ADD_BUILDINGS_SUCCEEDED'
const ADD_BUILDINGS_FAILED = 'ADD_BUILDINGS_FAILED'
const ADD_BUILDINGS_STARTED = 'ADD_BUILDINGS_STARTED'

const FETCH_ROOMS_SUCCEEDED = 'FETCH_ROOMS_SUCCEEDED'
const FETCH_ROOMS_FAILED = 'FETCH_ROOMS_FAILED'
const FETCH_ROOMS_STARTED = 'FETCH_ROOMS_STARTED'

const ADD_ROOMS_SUCCEEDED = 'ADD_ROOMS_SUCCEEDED'
const ADD_ROOMS_FAILED = 'ADD_ROOMS_FAILED'
const ADD_ROOMS_STARTED = 'ADD_ROOMS_STARTED'

const FETCH_TEACHERS_SUCCEEDED = 'FETCH_TEACHERS_SUCCEEDED'
const FETCH_TEACHERS_FAILED = 'FETCH_TEACHERS_FAILED'
const FETCH_TEACHERS_STARTED = 'FETCH_TEACHERS_STARTED'

const FETCH_FORMATIONS_SUCCEEDED = 'FETCH_FORMATIONS_SUCCEEDED'
const FETCH_YEARS_SUCCEEDED = 'FETCH_YEARS_SUCCEEDED'
const FETCH_GROUPS_SUCCEEDED = 'FETCH_GROUPS_SUCCEEDED'
const FETCH_FORMATIONS_FAILED = 'FETCH_FORMATIONS_FAILED'
const FETCH_FORMATIONS_STARTED = 'FETCH_FORMATIONS_STARTED'

const FETCH_TIMETABLE_SUCCEEDED = 'FETCH_TIMETABLE_SUCCEEDED'
const FETCH_TIMETABLE_FAILED = 'FETCH_TIMETABLE_FAILED'
const FETCH_TIMETABLE_STARTED = 'FETCH_TIMETABLE_STARTED'


const GENERATE_TIMETABLE_SUCCEEDED = 'GENERATE_TIMETABLE_SUCCEEDED'
const GENERATE_TIMETABLE_FAILED = 'GENERATE_TIMETABLE_FAILED'
const GENERATE_TIMETABLE_STARTED = 'GENERATE_TIMETABLE_STARTED'

const ADD_NEW_FORMATION_STARTED = 'ADD_NEW_FORMATION_STARTED'
const ADD_NEW_FORMATION_FAILED = 'ADD_NEW_FORMATION_FAILED'
const ADD_NEW_FORMATION_SUCCEEDED = 'ADD_NEW_FORMATION_SUCCEEDED'

const FETCH_CLASSES_STARTED = 'FETCH_CLASSES_STARTED'
const FETCH_CLASSES_FAILED = 'FETCH_CLASSES_FAILED'
const FETCH_CLASSES_SUCCEEDED = 'FETCH_CLASSES_SUCCEEDED'

const ADD_ASSOCIATION_STARTED = 'ADD_ASSOCIATION_STARTED'
const ADD_ASSOCIATION_FAILED = 'ADD_ASSOCIATION_FAILED'
const ADD_ASSOCIATION_SUCCEEDED = 'ADD_ASSOCIATION_SUCCEEDED'

const FETCH_ASSOCIATIONS_STARTED = 'FETCH_ASSOCIATIONS_STARTED'
const FETCH_ASSOCIATIONS_FAILED = 'FETCH_ASSOCIATIONS_FAILED'
const FETCH_ASSOCIATIONS_SUCCEEDED = 'FETCH_ASSOCIATIONS_SUCCEEDED'

const ADD_CLASS_STARTED = 'ADD_CLASS_STARTED'
const ADD_CLASS_FAILED = 'ADD_CLASS_FAILED'
const ADD_CLASS_SUCCEEDED = 'ADD_CLASS_SUCCEEDED'

const TIMETABLE_GENERATION_MESSAGE="TIMETABLE_GENERATION_MESSAGE"
const reducer: (state: AdminState, action: ActionProperties) => AdminState =
    (state, {type, payload}) => {
        switch (type) {
            case ADD_SUBJECT_STARTED:
                return {
                    ...state,
                    addingNewSubject: true,
                    subjectAddError: null,
                    subjectAddedSuccessfully: false
                };
            case ADD_SUBJECT_FAILED:
                return {
                    ...state,
                    addingNewSubject: false,
                    subjectAddError: payload.error,
                    subjectAddedSuccessfully: false
                };
            case ADD_SUBJECT_SUCCEEDED:
                var allSubjects = [... state.subjects || []]
                if(payload.subject!==null) allSubjects.unshift(payload.subject)
                return {
                    ...state,
                    subjects:allSubjects,
                    addingNewSubject: false,
                    subjectAddError: null,
                    subjectAddedSuccessfully: true
                };
            case UPDATE_SUBJECT_STARTED:
                return {
                    ...state,
                    updatingSubject: true,
                    subjectUpdateError: null,
                    subjectUpdatedSuccessfully: false
                };
            case UPDATE_SUBJECT_FAILED:
                return {
                    ...state,
                    updatingSubject: false,
                    subjectUpdateError: payload.error,
                    subjectUpdatedSuccessfully: false
                };
            case UPDATE_SUBJECT_SUCCEEDED:
                let subjects = [...(state.subjects || [])]
                let subIdx = subjects.findIndex(s => s.code === payload.subject.code)
                subjects[subIdx].name = payload.subject.name;
                subjects[subIdx].type = payload.subject.type;
                return {
                    ...state,
                    subjects: subjects,
                    updatingSubject: false,
                    subjectUpdateError: null,
                    subjectUpdatedSuccessfully: true
                };
            case FETCH_SUBJECTS_STARTED:
                return {
                    ...state,
                    fetchingSubjects: true,
                    fetchSubjectsError: null,
                    subjectsFetchedSuccessfully: false
                };
            case FETCH_SUBJECTS_SUCCEEDED:
                if (payload.page > 0) {
                    let subjects = [...state.subjects || []]
                    for (let s of payload.searchResult)
                        if (subjects.find(sb => sb.code === s.code) === undefined) subjects.push(s)

                    return {
                        ...state,
                        subjects: subjects,
                        fetchSubjectsError: null,
                        fetchingSubjects: false,
                        subjectsFetchedSuccessfully: true
                    }
                } else
                    return {
                        ...state,
                        subjects: payload.searchResult,
                        fetchSubjectsError: null,
                        fetchingSubjects: false,
                        subjectsFetchedSuccessfully: true
                    }

            case FETCH_BUILDINGS_STARTED:
                return {
                    ...state,
                    fetchingBuildings: true,
                    buildingsFetchError: null,
                    buildingsFetchedSuccessfully: false
                };
            case FETCH_BUILDINGS_SUCCEEDED:
                return {
                    ...state,
                    buildings: payload.result,
                    fetchingBuildings: false,
                    buildingsFetchError: null,
                    buildingsFetchedSuccessfully: true
                };
            case FETCH_BUILDINGS_FAILED:
                return {
                    ...state,
                    fetchingBuildings: false,
                    buildingsFetchError: payload.error,
                    buildingsFetchedSuccessfully: false
                };
            case ADD_BUILDINGS_STARTED:
                return {
                    ...state,
                    addingBuilding: true,
                    addBuildingError: null,
                    buildingAddedSuccessfully: false
                };
            case ADD_BUILDINGS_FAILED:
                return {
                    ...state,
                    addingBuilding: false,
                    addBuildingError: payload.error,
                    buildingAddedSuccessfully: false
                };
            case ADD_BUILDINGS_SUCCEEDED:
                let allBuildings: BuildingProps[] = [];
                if (state.buildings) {
                    allBuildings = [...state.buildings]
                }
                allBuildings.push(payload.building)
                return {
                    ...state,
                    buildings: allBuildings,
                    addingBuilding: false,
                    addBuildingError: null,
                    buildingAddedSuccessfully: true
                };
            case FETCH_ROOMS_STARTED:
                return {
                    ...state,
                    fetchingRooms: true,
                    fetchRoomsError: null,
                    roomsFetchedSuccessfully: false
                };
            case FETCH_ROOMS_SUCCEEDED:
                return {
                    ...state,
                    rooms: payload.fetchedRooms,
                    fetchingRooms: false,
                    fetchRoomsError: null,
                    roomsFetchedSuccessfully: true
                };
            case FETCH_ROOMS_FAILED:
                return {
                    ...state,
                    fetchingRooms: false,
                    fetchRoomsError: payload.error,
                    roomsFetchedSuccessfully: false
                };
            case ADD_ROOMS_STARTED:
                return {
                    ...state,
                    addingNewRoom: true,
                    addNewRoomError: null,
                    newRoomAddedSuccessfully: false
                };
            case ADD_ROOMS_SUCCEEDED:
                let allRooms: RoomProps[] = [];
                if (state.rooms) {
                    allRooms = [...state.rooms]
                }
                allRooms.push(payload.room)
                return {
                    ...state,
                    rooms: allRooms,
                    addingNewRoom: false,
                    addNewRoomError: null,
                    newRoomAddedSuccessfully: true
                };
            case ADD_ROOMS_FAILED:
                return {
                    ...state,
                    addingNewRoom: false,
                    addNewRoomError: payload.error,
                    newRoomAddedSuccessfully: false
                };
            case FETCH_TEACHERS_STARTED:
                return {
                    ...state,
                    fetchingTeachers: true,
                    fetchTeachersError: null,
                    teachersFetchedSuccessfully: false
                };
            case FETCH_TEACHERS_SUCCEEDED:
                if (payload.page > 0) {
                    let teachers = [...state.teachers || []]
                    for (let t of payload.fetchedTeachers)
                        if (teachers.find(tch => tch.username === t.username) === undefined) teachers.push(t)
                    return {
                        ...state,
                        teachers: teachers,
                        fetchingTeachers: false,
                        fetchTeachersError: null,
                        teachersFetchedSuccessfully: true
                    }
                } else
                    return {
                        ...state,
                        teachers: payload.fetchedTeachers,
                        fetchingTeachers: false,
                        fetchTeachersError: null,
                        teachersFetchedSuccessfully: true
                    }
            case FETCH_TEACHERS_FAILED:
                return {
                    ...state,
                    fetchingTeachers: false,
                    fetchTeachersError: payload.error,
                    teachersFetchedSuccessfully: false
                };
            case FETCH_FORMATIONS_STARTED:
                return {
                    ...state,
                    fetchingFormations: true,
                    fetchFormationsFailed: null,
                    formationsFetchedSuccessfully: false,
                    yearsFetchedSuccessfully: false,
                    groupsFetchedSuccessfully: false
                };

            case FETCH_FORMATIONS_SUCCEEDED:
                if (payload.page > 0) {
                    let formations = [...state.formations || []]
                    for (let f of payload.fetchedFormations)
                        if (formations.find(frm => frm.code === f.code) === undefined) formations.push(f)
                    return {
                        ...state,
                        formations: formations,
                        fetchingFormations: false,
                        fetchFormationsFailed: null,
                        formationsFetchedSuccessfully: true
                    }
                }
                return {
                    ...state,
                    formations: payload.fetchedFormations,
                    fetchingFormations: false,
                    fetchFormationsFailed: null,
                    formationsFetchedSuccessfully: true
                }
            case FETCH_YEARS_SUCCEEDED:
                if (payload.page > 0) {
                    let yrs = [...state.years || []]
                    for (let f of payload.fetchedYears)
                        if (yrs.find(frm => frm.code === f.code) === undefined) yrs.push(f)
                    return {
                        ...state,
                        years: yrs,
                        fetchingFormations: false,
                        fetchFormationsFailed: null,
                        formationsFetchedSuccessfully: false,
                        yearsFetchedSuccessfully: true
                    }
                }

                return {
                    ...state,
                    years: payload.fetchedYears,
                    fetchingFormations: false,
                    fetchFormationsFailed: null,
                    formationsFetchedSuccessfully: false,
                    yearsFetchedSuccessfully: true
                }
            case FETCH_GROUPS_SUCCEEDED:
                if (payload.page > 0) {
                    let grps = [...state.groups || []]
                    for (let f of payload.fetchedGroups)
                        if (grps.find(frm => frm.code === f.code) === undefined) grps.push(f)
                    return {
                        ...state,
                        groups: grps,
                        fetchingFormations: false,
                        fetchFormationsFailed: null,
                        formationsFetchedSuccessfully: false,
                        yearsFetchedSuccessfully: true
                    }
                }
                return {
                    ...state,
                    groups: payload.fetchedGroups,
                    fetchingFormations: false,
                    fetchFormationsFailed: null,
                    formationsFetchedSuccessfully: false,
                    yearsFetchedSuccessfully: true
                }
            case FETCH_FORMATIONS_FAILED:
                return {
                    ...state,
                    fetchingFormations: false,
                    fetchFormationsFailed: payload.error,
                    formationsFetchedSuccessfully: false
                };
            case FETCH_TIMETABLE_STARTED:
                return {
                    ...state,
                    fetchingTimetable: true,
                    timetableFetchError: null,
                    timetableFetchedSuccessfully: false
                };
            case FETCH_TIMETABLE_SUCCEEDED:
                return {
                    ...state,
                    timetable: payload.fetchedTimetable,
                    fetchingTimetable: false,
                    timetableFetchError: null,
                    timetableFetchedSuccessfully: true
                };
            case FETCH_TIMETABLE_FAILED:
                return {
                    ...state,
                    fetchingTimetable: false,
                    timetableFetchError: payload.error,
                    timetableFetchedSuccessfully: false
                };
            case ADD_NEW_FORMATION_STARTED:
                return {
                    ...state,
                    addingNewFormation: true,
                    addNewFormationError: null,
                    newFormationAddedSuccessfully: false
                };
            case ADD_NEW_FORMATION_FAILED:
                return {
                    ...state,
                    addingNewFormation: false,
                    addNewFormationError: payload.error,
                    newFormationAddedSuccessfully: false
                };
            case ADD_NEW_FORMATION_SUCCEEDED:
                let allFormations = [...state.formations || []]
                allFormations.unshift(payload.addedFormation)
                let allGroups = [...state.groups || []]
                let allYears = [...state.years || []]

                if (payload.addedFormation.type === 1) {
                    allYears.unshift(payload.addedFormation)
                } else if (payload.addedFormation.type === 2) {
                    allGroups.unshift(payload.addedFormation)
                }
                return {
                    ...state,
                    years: allYears,
                    groups: allGroups,
                    formations: allFormations,
                    addingNewFormation: false,
                    addNewFormationError: null,
                    newFormationAddedSuccessfully: true
                };
            case FETCH_CLASSES_STARTED:
                return {
                    ...state,
                    fetchingAllClasses: true,
                    fetchClassesError: null,
                    fetchedCLassesSuccessfully: false
                };
            case FETCH_CLASSES_SUCCEEDED:
                return {
                    ...state,
                    classes: payload.classes,
                    fetchingAllClasses: false,
                    fetchClassesError: null,
                    fetchedCLassesSuccessfully: true
                };
            case FETCH_CLASSES_FAILED:
                return {
                    ...state,
                    fetchingAllClasses: false,
                    fetchClassesError: payload.error,
                    fetchedCLassesSuccessfully: false
                };
            case ADD_ASSOCIATION_STARTED:
                return {
                    ...state,
                    addingNewAssociation: true,
                    addNewAssociationError: null,
                    addNewAssociationSuccessfully: false
                };
            case ADD_ASSOCIATION_FAILED:
                return {
                    ...state,
                    addingNewAssociation: false,
                    addNewAssociationError: payload.error,
                    addNewAssociationSuccessfully: false
                };
            case ADD_ASSOCIATION_SUCCEEDED:
                let allAssociations = [...state.associations || []]
                allAssociations.unshift(payload.addedAssociation)

                return {
                    ...state,
                    associations: allAssociations,
                    addingNewAssociation: false,
                    addNewAssociationError: null,
                    addNewAssociationSuccessfully: true
                };
            case FETCH_ASSOCIATIONS_STARTED:
                return {
                    ...state,
                    fetchingAssociations: true,
                    fetchAssociationsError: null,
                    fetchedAssociationsSuccessfully: false
                };
            case FETCH_ASSOCIATIONS_SUCCEEDED:
                    let associations = [...state.associations || []]
                    for (let s of payload.fetchedAssociations)
                        if (associations.find(sb => sb.id === s.id) === undefined) associations.unshift(s)

                    return {
                        ...state,
                        associations: associations,
                        fetchingAssociations: false,
                        fetchAssociationsError: null,
                        fetchedAssociationsSuccessfully: true
                    }

            case FETCH_ASSOCIATIONS_FAILED:
                return {
                    ...state,
                    fetchingAssociations: false,
                    fetchAssociationsError: payload.error,
                    fetchedAssociationsSuccessfully: false
                };
            case ADD_CLASS_STARTED:
                return {
                    ...state,
                    addingClass: true,
                    addClassError: null,
                    addedClassSuccessfully: false
                };
            case ADD_CLASS_FAILED:
                return {
                    ...state,
                    addingClass: false,
                    addClassError: payload.error,
                    addedClassSuccessfully: false
                };
            case ADD_CLASS_SUCCEEDED:
                let allClasses = [...state.classes || []]
                allClasses.unshift(payload.addedClass)

                return {
                    ...state,
                    classes: allClasses,
                    addingNewAssociation: false,
                    addNewAssociationError: null,
                    addNewAssociationSuccessfully: true
                };
            case GENERATE_TIMETABLE_STARTED:
                return {
                    ...state,
                    fetchingTimetable: true,
                    timetableFetchError: null,
                    timetableFetchedSuccessfully: false,
                    timetableGenerationProgressStatus: "Started generating timetable...",
                    progress:0
                };
            case GENERATE_TIMETABLE_SUCCEEDED:
                return {
                    ...state,
                    timetable: payload.generatedTimetable,
                    fetchingTimetable: false,
                    timetableFetchError: null,
                    timetableFetchedSuccessfully: true,
                    timetableGenerationProgressStatus: "Timetable generated successfully!",
                    progress:1
                };
            case GENERATE_TIMETABLE_FAILED:
                return {
                    ...state,
                    fetchingTimetable: false,
                    timetableFetchError: payload.error,
                    timetableFetchedSuccessfully: false
                };
            case TIMETABLE_GENERATION_MESSAGE:
                console.log("LA MESAJ "+payload)
                let prevProgress = state.progress
                return{
                    ... state,
                    timetableGenerationProgressStatus:payload.message,
                    progress:prevProgress+0.33
                }
            case "SOCKET_CREATED":
                return {
                    ... state,
                    socket: payload.socket
                }
            default:
                return state;
        }
    };


export const AdministratorProvider: React.FC<AdminProviderProps> = ({children}) => {
    const {token} = useContext(LoginContext)
    const addNewSubject = useCallback<AddNewSubjectFunction>(addNewSubjectCallback, [token])
    const searchSubjects = useCallback<SearchSubjectsFunction>(searchSubjectsCallback, [token])
    const updateSubject = useCallback<UpdateSubjectFunction>(updateSubjectCallback, [token])

    const addNewBuilding = useCallback<AddNewBuildingFunction>(addNewBuildingCallback, [token])
    const fetchBuildings = useCallback<FetchBuildingsFunction>(fetchBuildingsCallback, [token])


    const addNewRoom = useCallback<AddNewRoomFunction>(addNewRoomCallback, [token])
    const fetchRooms = useCallback<FetchRoomsFunction>(fetchRoomsCallback, [token])
    const fetchTeachers = useCallback<FetchTeachersFunction>(fetchTeachersCallback, [token])
    const fetchFormations = useCallback<FetchFormationsFunction>(fetchFormationsCallback, [token])
    const fetchYears = useCallback<FetchFormationsFunction>(fetchYearsCallback, [token])
    const fetchGroups = useCallback<FetchFormationsFunction>(fetchGroupsCallback, [token])
    const fetchTimetable = useCallback<FetchTimetableFunction>(fetchTimetableCallback, [token])
    const generateTimetable = useCallback<GenerateTimetableFunction>(generateTimetableCallback, [token])
    const addFormation = useCallback<AddNewFormationFunction>(addNewFormationCallback, [token])

    const fetchClasses = useCallback<FetchAllClassesFunction>(fetchClassesCallback, [token])

    const fetchAllAssociations = useCallback<FetchAllAssociations>(fetchAssociationsCallback, [token])
    const addNewAssociation = useCallback<AddNewAssociationFunction>(addAssociationCallback, [token])

    const addNewClass = useCallback<AddClassFunction>(addClassCallback, [token])

    const [state, dispatch] = useReducer(reducer, initialState);

    const {
        subjects,
        rooms,
        buildings,
        teachers,
        formations,
        timetable,
        progress,
        years,
        groups,
        classes,
        // ADD SUBJECT
        addingNewSubject,
        subjectAddError,
        subjectAddedSuccessfully,
        // UPDATE SUBJECT
        updatingSubject,
        subjectUpdateError,
        subjectUpdatedSuccessfully,
        // FETCH SUBJECTS
        fetchingSubjects,
        fetchSubjectsError,
        subjectsFetchedSuccessfully,
        // FETCH BUILDINGS
        fetchingBuildings,
        buildingsFetchError,
        buildingsFetchedSuccessfully,
        // ADD BUILDING
        addingBuilding,
        addBuildingError,
        buildingAddedSuccessfully,
        //FETCH ROOMS
        fetchingRooms,
        fetchRoomsError,
        roomsFetchedSuccessfully,
        // ADD ROOM
        addingNewRoom,
        addNewRoomError,
        newRoomAddedSuccessfully,
        // FETCH TEACHERS
        fetchingTeachers,
        fetchTeachersError,
        teachersFetchedSuccessfully,
        // FETCH FORMATIONS
        fetchingFormations,
        fetchFormationsFailed,
        formationsFetchedSuccessfully,
        // FETCH TIMETABLE
        fetchingTimetable,
        timetableFetchError,
        timetableFetchedSuccessfully,
        // FETCH YEARS & GROUPS
        groupsFetchedSuccessfully,
        yearsFetchedSuccessfully,
        // ADD NEW FORMATION
        addingNewFormation,
        addNewFormationError,
        newFormationAddedSuccessfully,
        // FETCH CLASSES
        fetchingAllClasses,
        fetchClassesError,
        fetchedCLassesSuccessfully,
        // ADD ASSOCIATION
        addingNewAssociation,
        addNewAssociationError,
        addNewAssociationSuccessfully,
        associations,
        //FETCH ASSOCIATIONS
        fetchingAssociations,
        fetchedAssociationsSuccessfully,
        fetchAssociationsError,
        // ADD CLASS
        addingClass,
        addClassError,
        addedClassSuccessfully,
        socket,
        timetableGenerationProgressStatus
    } = state

    // useEffect(() => {
    //     if (token.trim() && !socket) {
    //         let sock = new WebSocket(`ws://localhost:8080/timetable-ws`)
    //         sock.onopen = () => {
    //             console.log("readyState" + sock.readyState)
    //             sock.send(token);
    //         }
    //         sock.onclose = () => {
    //             console.log('web socket onclose');
    //         };
    //         sock.onerror = error => {
    //             console.log('web socket onerror', error);
    //         };
    //
    //         dispatch({type:"SOCKET_CREATED", payload:{socket: sock}})
    //
    //         return () => {
    //             // if(socket!=null) socket.close();
    //         }
    //     }
    // }, [token])

    useEffect(() => {
        let canceled = false;
        if (token?.trim()) {
            if (canceled) {
                return;
            }
            if (socket !== null) {
                socket.onmessage= (messageEvent) => {
                    console.log('web socket onmessage ' + messageEvent.data);
                    let res = JSON.parse(messageEvent.data);
                    console.log(res.result)
                    /*switch (res.type) {
                        case "collectingData":
                            */dispatch({ type: TIMETABLE_GENERATION_MESSAGE, payload: { message: res.result} })
                           /* break;
                        case "addingConstraints":
                            dispatch({ type: RECEIVED_NEW_BADGE, payload: { message: "Adding constraints to the model!" } })
                            break;
                        case "generatingTimetable":
                            dispatch({ type: RECEIVED_NEW_ANSWER, payload: { answer: res.result } })
                            break;*/
                    console.log(`ws message, item ${res.type}`);
                    }
                }
                // }
                return () => {

                }
            }
        }

    )


    async function fetchAssociationsCallback() {
        let canceled = false;
        getAllAssociations();
        return () => {
            canceled = true;
        }

        async function getAllAssociations() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_ASSOCIATIONS_STARTED});
                const fetchedAssociations = await getAssociationsAPI(token);
                if (!canceled)
                    if (fetchedAssociations) {
                        dispatch({type: FETCH_ASSOCIATIONS_SUCCEEDED, payload: {fetchedAssociations}});
                    }

            } catch (error) {
                dispatch({type: FETCH_ASSOCIATIONS_FAILED, payload: {error}});
            }

        }
    }


    async function addClassCallback(newClass?:ClassProps) {
        try {
            dispatch({type: ADD_CLASS_STARTED})
            const addedClass = await addClassAPI(token, newClass);
            // console.log(s)
            if (addedClass.succeeded !== false) {
                dispatch({type: ADD_CLASS_SUCCEEDED, payload: {addedClass}})
            } else {
                console.log("Dispatch error")
                dispatch({
                    type: ADD_CLASS_FAILED,
                    payload: {error: new Error("Adding failed!\nTry another subject code.")}
                })
            }
        } catch (error) {
            dispatch({type: ADD_CLASS_FAILED, payload: {error}})
        }
    }
    async function updateSubjectCallback(subject: SubjectProps) {
        try {
            dispatch({type: UPDATE_SUBJECT_STARTED})
            const s = await updateSubjectAPI(subject, token);
            // console.log(s)
            if (s.succeeded !== false) {
                dispatch({type: UPDATE_SUBJECT_SUCCEEDED, payload: {subject}})
            } else {
                console.log("Dispatch error")
                dispatch({
                    type: UPDATE_SUBJECT_FAILED,
                    payload: {error: new Error("Adding failed!\nTry another subject code.")}
                })
            }
        } catch (error) {
            // dispatch({type: ADD_SUBJECT_FAILED, payload: {error}})
        }
    }

    async function searchSubjectsCallback(searchCriteria?: string, page?: number, size?: number) {
        let canceled = false;
        searchSubjects();
        return () => {
            canceled = true;
        }

        async function searchSubjects() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_SUBJECTS_STARTED});
                if (searchCriteria !== undefined) {
                    if (searchCriteria === '') searchCriteria = "000";
                    const searchResult = await searchSubjectsAPI(searchCriteria, page, size, token);
                    if (!canceled)
                        if (searchResult) {
                            dispatch({type: FETCH_SUBJECTS_SUCCEEDED, payload: {searchResult, page}});
                        }
                } else {
                    dispatch({type: FETCH_SUBJECTS_SUCCEEDED, payload: {searchResult: [], page}});
                }

            } catch (error) {
                dispatch({type: FETCH_SUBJECTS_FAILED, payload: {error}});
            }

        }
    }

    async function addNewSubjectCallback(subject: SubjectProps) {
        try {
            dispatch({type: ADD_SUBJECT_STARTED})
            const s = await addSubjectAPI(subject, token);
            // console.log(s)
            if (s.succeeded !== false) {
                dispatch({type: ADD_SUBJECT_SUCCEEDED, payload: {subject: s}})
            } else {
                console.log("Dispatch error")
                dispatch({
                    type: ADD_SUBJECT_FAILED,
                    payload: {error: new Error("Adding failed!\nTry another subject code.")}
                })
            }
        } catch (error) {
            // dispatch({type: ADD_SUBJECT_FAILED, payload: {error}})
        }

    }

    const classTypes = ['', "Lecture", "Seminar", "Laboratory"]


    async function addAssociationCallback(teacherId?: string, classType?: number, subjectId?: string, formationId?: string) {
        try {
            dispatch({type: ADD_ASSOCIATION_STARTED})
            const s = await saveAssociationAPI(token, teacherId, subjectId, formationId, classType);
            console.log("========== AICI: " +s)
            if (s) {
                dispatch({
                    type: ADD_ASSOCIATION_SUCCEEDED,
                    payload: {addedAssociation: s}
                })
            } else {
                console.log("Dispatch error")
                dispatch({
                    type: ADD_SUBJECT_FAILED,
                    payload: {error: new Error("Adding failed!\nTry another subject code.")}
                })
            }
        } catch (error) {
            dispatch({type: ADD_ASSOCIATION_FAILED, payload: {error}})
        }

    }

    async function addNewFormationCallback(formation: FormationProps) {
        try {
            dispatch({type: ADD_NEW_FORMATION_STARTED})
            const f = await addFormationAPI(token, formation);
            // console.log(s)
            if (f) {
                dispatch({type: ADD_NEW_FORMATION_SUCCEEDED, payload: {addedFormation: f}})
            } else {
                console.log("Dispatch error")
                dispatch({
                    type: ADD_NEW_FORMATION_FAILED,
                    payload: {error: new Error("Adding failed!\nTry another formation code.")}
                })
            }
        } catch (error) {
            // dispatch({type: ADD_SUBJECT_FAILED, payload: {error}})
        }

    }

    async function fetchBuildingsCallback() {
        let canceled = false;
        getAllBuildings();
        return () => {
            canceled = true;
        }

        async function getAllBuildings() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_BUILDINGS_STARTED});
                const result = await fetchAllBuildingsAPI(token);
                if (!canceled)
                    if (result) {
                        dispatch({type: FETCH_BUILDINGS_SUCCEEDED, payload: {result}});
                    }

            } catch (error) {
                dispatch({type: FETCH_BUILDINGS_FAILED, payload: {error}});
            }

        }
    }

    async function fetchClassesCallback() {
        let canceled = false;
        getAllClasses();
        return () => {
            canceled = true;
        }

        async function getAllClasses() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_CLASSES_STARTED});
                const classes = await fetchAllClassesAPI(token);
                if (!canceled)
                    if (classes) {
                        dispatch({type: FETCH_CLASSES_SUCCEEDED, payload: {classes}});
                    }

            } catch (error) {
                dispatch({type: FETCH_CLASSES_FAILED, payload: {error}});
            }

        }
    }

    async function fetchTeachersCallback(page?: number, size?: number) {
        let canceled = false;
        getAllTeachers();
        return () => {
            canceled = true;
        }

        async function getAllTeachers() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_TEACHERS_STARTED});
                const fetchedTeachers = await fetchAllTeachersAPI(token, page, size);
                if (!canceled)
                    if (fetchedTeachers) {
                        dispatch({type: FETCH_TEACHERS_SUCCEEDED, payload: {fetchedTeachers, page}});
                    }

            } catch (error) {
                dispatch({type: FETCH_TEACHERS_FAILED, payload: {error}});
            }

        }
    }

    async function addNewBuildingCallback(building: BuildingProps) {
        try {
            dispatch({type: ADD_BUILDINGS_STARTED})
            const b = await addNewBuildingAPI(building, token);
            if (b.succeeded !== false) {
                dispatch({type: ADD_BUILDINGS_SUCCEEDED, payload: {building: b}})
            } else {
                console.log("Dispatch error")
                dispatch({
                    type: ADD_BUILDINGS_FAILED,
                    payload: {error: new Error("Adding failed!\nTry another building code.")}
                })
            }
        } catch (error) {
            // dispatch({type: ADD_SUBJECT_FAILED, payload: {error}})
        }

    }

    async function fetchRoomsCallback(building: string) {
        let canceled = false;
        getAllRooms(building);
        return () => {
            canceled = true;
        }

        async function getAllRooms(building: string) {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_ROOMS_STARTED});
                const fetchedRooms = await getAllRoomsAPI(building, token);
                if (!canceled)
                    if (fetchedRooms) {
                        dispatch({type: FETCH_ROOMS_SUCCEEDED, payload: {fetchedRooms}});
                    }

            } catch (error) {
                dispatch({type: FETCH_ROOMS_FAILED, payload: {error}});
            }

        }
    }

    async function addNewRoomCallback(room: RoomProps) {
        try {
            dispatch({type: ADD_ROOMS_STARTED})
            const r = await addNewRoomAPI(room, token);
            if (r.succeeded !== false) {
                dispatch({type: ADD_ROOMS_SUCCEEDED, payload: {room: r}})
            } else {
                console.log("Dispatch error")
                dispatch({
                    type: ADD_ROOMS_FAILED,
                    payload: {error: new Error("Adding failed!\nTry another room code.")}
                })
            }
        } catch (error) {
            dispatch({type: ADD_SUBJECT_FAILED, payload: {error}})
        }

    }

    async function fetchFormationsCallback(classType?: number, page?: number, size?: number) {
        let canceled = false;
        await getAllFormations();
        return () => {
            canceled = true;
        }

        async function getAllFormations() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_FORMATIONS_STARTED});
                const fetchedFormations = await getAllFormationsAPI(token, classType, page, size);

                if (!canceled)
                    if (fetchedFormations) {
                        dispatch({type: FETCH_FORMATIONS_SUCCEEDED, payload: {fetchedFormations, page}});
                    }
            } catch (error) {
                dispatch({type: FETCH_FORMATIONS_FAILED, payload: {error}});
            }

        }
    }

    async function fetchGroupsCallback() {
        let canceled = false;
        getGroups();
        return () => {
            canceled = true;
        }

        async function getGroups() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_FORMATIONS_STARTED});
                const fetchedGroups = await getGroupsAPI(token);

                if (!canceled)
                    if (fetchedGroups) {
                        dispatch({type: FETCH_GROUPS_SUCCEEDED, payload: {fetchedGroups}});
                    }
            } catch (error) {
                dispatch({type: FETCH_FORMATIONS_FAILED, payload: {error}});
            }

        }
    }

    async function fetchYearsCallback() {
        let canceled = false;
        getYears();
        return () => {
            canceled = true;
        }

        async function getYears() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_FORMATIONS_STARTED});
                const fetchedYears = await getYearsAPI(token);

                if (!canceled)
                    if (fetchedYears) {
                        dispatch({type: FETCH_YEARS_SUCCEEDED, payload: {fetchedYears}});
                    }
            } catch (error) {
                dispatch({type: FETCH_FORMATIONS_FAILED, payload: {error}});
            }

        }
    }

    function createWebSocket(){
        if (token.trim() && !socket) {
            let sock = new WebSocket(`ws://localhost:8080/timetable-ws`)
            sock.onopen = () => {
                console.log("readyState" + sock.readyState)
                sock.send(token);
            }
            sock.onclose = () => {
                console.log('web socket onclose');
            };
            sock.onerror = error => {
                console.log('web socket onerror', error);
            };

            dispatch({type:"SOCKET_CREATED", payload:{socket: sock}})

            return () => {
                // if(socket!=null) socket.close();
            }
        }
    }
    function generateTimetableCallback(semester?: number) {
        createWebSocket()

        let canceled = false;
        generateTimetable();

        return () => {
            if(socket!==null) socket.close();
            canceled = true;
        }

        async function generateTimetable() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: GENERATE_TIMETABLE_STARTED});
                const generatedTimetable = await generateTimetableAPI(semester, token);

                if (!canceled)
                    if (generatedTimetable) {
                        dispatch({type: GENERATE_TIMETABLE_SUCCEEDED, payload: {generatedTimetable}});
                    }

            } catch (error) {
                dispatch({type: GENERATE_TIMETABLE_FAILED, payload: {error}});
            }

        }
    }

    function fetchTimetableCallback() {
        let canceled = false;
        getLastTimetable();
        return () => {
            canceled = true;
        }

        async function getLastTimetable() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: FETCH_TIMETABLE_STARTED});
                const fetchedTimetable = await fetchTimetableAPI(token);

                if (!canceled)
                    if (fetchedTimetable) {
                        dispatch({type: FETCH_TIMETABLE_SUCCEEDED, payload: {fetchedTimetable}});
                    }

            } catch (error) {
                dispatch({type: FETCH_TIMETABLE_FAILED, payload: {error}});
            }

        }
    }

    return (
        <AdminContext.Provider value={{
            subjects,
            buildings,
            addNewSubject,
            searchSubjects,
            updateSubject,
            addNewBuilding,
            fetchBuildings,
            fetchRooms,
            addNewRoom,
            rooms,
            fetchTeachers,
            teachers,
            fetchFormations,
            formations,
            timetable,
            fetchTimetable,
            generateTimetable,
            years,
            groups,

            // ADD SUBJECT
            addingNewSubject,
            subjectAddError,
            subjectAddedSuccessfully,
            // UPDATE SUBJECT
            updatingSubject,
            subjectUpdateError,
            subjectUpdatedSuccessfully,
            // FETCH SUBJECTS
            fetchingSubjects,
            fetchSubjectsError,
            subjectsFetchedSuccessfully,
            // FETCH BUILDINGS
            fetchingBuildings,
            buildingsFetchError,
            buildingsFetchedSuccessfully,
            // ADD BUILDING
            addingBuilding,
            addBuildingError,
            buildingAddedSuccessfully,
            //FETCH ROOMS
            fetchingRooms,
            fetchRoomsError,
            roomsFetchedSuccessfully,
            // ADD ROOM
            addingNewRoom,
            addNewRoomError,
            newRoomAddedSuccessfully,
            // FETCH TEACHERS
            fetchingTeachers,
            fetchTeachersError,
            teachersFetchedSuccessfully,
            // FETCH FORMATIONS
            fetchingFormations,
            fetchFormationsFailed,
            formationsFetchedSuccessfully,
            // FETCH TIMETABLE
            fetchingTimetable,
            timetableFetchError,
            timetableFetchedSuccessfully,
            // FETCH YEARS & GROUPS
            groupsFetchedSuccessfully,
            yearsFetchedSuccessfully,
            // ADD NEW FORMATION
            addingNewFormation,
            addNewFormationError,
            newFormationAddedSuccessfully,
            fetchGroups,
            fetchYears,
            addNewFormation: addFormation,
            classes,
            fetchedCLassesSuccessfully,
            fetchClassesError,
            fetchingAllClasses,
            fetchClasses,
            // ADD NEW ASSOCIATION
            addingNewAssociation,
            addNewAssociationSuccessfully,
            addNewAssociationError,
            addNewAssociation,
            associations,
            fetchingAssociations,
            fetchedAssociationsSuccessfully,
            fetchAssociationsError,
            fetchAllAssociations,
            // ADD CLASS
            addingClass,
            addClassError,
            addedClassSuccessfully,
            addNewClass,
            socket,
            timetableGenerationProgressStatus,
            progress
        }}>
            {children}
        </AdminContext.Provider>
    );
}

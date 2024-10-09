import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';

import {
    getProfileDetails,
    updatePassword as updatePasswordAPI,
    updateProfileDetails as updateProfileDetailsAPI,
    updateProfilePic as updateProfilePicAPI,
} from "../api/GenericUserApi"
import {LoginContext} from "../../authentication/provider/AuthProvider";


type UpdateProfilePicFunction = (picture?: string) => Promise<any>;
type UpdateProfileDetailsFunction = (details?: UserProps) => Promise<any>;
type UpdatePasswordFunction = (oldPswd?: string, newPswd?: string) => Promise<any>;

export interface UserProps {
    username?: string,
    email?: string,
    kindergarten?: string,
    firstName?: string,
    picture?: string,
    lastName?: string,
    phone?: string
    userType?: string
}

export interface UserState {
    gettingAccountDetails: boolean,
    updatingProfileDetails: boolean,
    updatingProfilePicture: boolean,
    updatingPassword: boolean,
    passwordUpdatedSuccessfully: boolean,
    passwordUpdateError: Error | null
    getAccountDetailsError: Error | null,
    profilePicUpdateError: Error | null,
    profileDetailsUpdateError: Error | null,
    username?: string,
    email?: string,
    firstName?: string,
    picture?: string,
    lastName?: string,
    phone?: string,
    userType?: string,
    updateProfilePic?: UpdateProfilePicFunction,
    updateProfileDetails?: UpdateProfileDetailsFunction,
    updatePassword?: UpdatePasswordFunction,
}

const initialState: UserState = {
    gettingAccountDetails: false,
    getAccountDetailsError: null,
    profilePicUpdateError: null,
    profileDetailsUpdateError: null,
    updatingProfileDetails: false,
    updatingProfilePicture: false,
    updatingPassword: false,
    passwordUpdateError: null,
    passwordUpdatedSuccessfully: false,
}

export const UserContext = React.createContext<UserState>(initialState);

interface UserProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProperties {
    type: string,
    payload?: any,
}

const GET_ACCOUNT_DETAILS_STARTED = 'GET_ACCOUNT_DETAILS_STARTED'
const GET_ACCOUNT_DETAILS_FAILED = 'GET_ACCOUNT_DETAILS_FAILED'
const GET_ACCOUNT_DETAILS_SUCCEEDED = 'GET_ACCOUNT_DETAILS_SUCCEEDED'

const PROFILE_PICTURE_UPDATE_SUCCEEDED = 'PROFILE_PICTURE_UPDATE_SUCCEEDED'
const PROFILE_PICTURE_UPDATE_FAILED = 'PROFILE_PICTURE_UPDATE_FAILED'
const PROFILE_PICTURE_UPDATE_STARTED = 'PROFILE_PICTURE_UPDATE_STARTED'

const PROFILE_DETAILS_UPDATE_SUCCEEDED = 'PROFILE_DETAILS_UPDATE_SUCCEEDED'
const PROFILE_DETAILS_UPDATE_FAILED = 'PROFILE_DETAILS_UPDATE_FAILED'
const PROFILE_DETAILS_UPDATE_STARTED = 'PROFILE_DETAILS_UPDATE_STARTED'

const PASSWORD_UPDATE_SUCCEEDED = 'PASSWORD_UPDATE_SUCCEEDED'
const PASSWORD_UPDATE_FAILED = 'PASSWORD_UPDATE_FAILED'
const PASSWORD_UPDATE_STARTED = 'PASSWORD_UPDATE_STARTED'
const reducer: (state: UserState, action: ActionProperties) => UserState =
    (state, {type, payload}) => {
        switch (type) {
            case GET_ACCOUNT_DETAILS_STARTED:
                return {
                    ...state,
                    gettingAccountDetails: true,
                    fetchingError: null,
                    passwordUpdatedSuccessfully: false
                };
            case GET_ACCOUNT_DETAILS_SUCCEEDED:
                return {
                    ...state,
                    username: payload.details.username,
                    email: payload.details.email,
                    firstName: payload.details.firstName,
                    picture: payload.details.picture,
                    lastName: payload.details.lastName,
                    phone: payload.details.phone,
                    userType: payload.details.userType,
                    gettingAccountDetails: false
                };
            case GET_ACCOUNT_DETAILS_FAILED:
                return {...state, getAccountDetailsError: payload.error, gettingAccountDetails: false};
            case PROFILE_PICTURE_UPDATE_SUCCEEDED:
                return {...state, picture: payload.picture, updatingProfilePicture: false}
            case PROFILE_PICTURE_UPDATE_FAILED:
                return {...state, profilePicUpdateError: payload.error}

            case PROFILE_DETAILS_UPDATE_SUCCEEDED:
                return {
                    ...state,
                    username: payload.details.username,
                    email: payload.details.email,
                    firstName: payload.details.firstName,
                    lastName: payload.details.lastName,
                    phone: payload.details.phone,
                    userType: payload.details.userType,
                    updatingProfileDetails: false
                };
            case PROFILE_DETAILS_UPDATE_STARTED:
                return {...state, updatingProfileDetails: true, profileDetailsUpdateError: null}
            case PROFILE_PICTURE_UPDATE_STARTED:
                return {...state, updatingProfilePicture: true, profilePicUpdateError: null}
            case PASSWORD_UPDATE_SUCCEEDED:
                return {...state, updatingPassword: false, passwordUpdateError: null, passwordUpdatedSuccessfully: true}
            case PASSWORD_UPDATE_STARTED:
                return {...state, updatingPassword: true, passwordUpdateError: null, passwordUpdatedSuccessfully: false}
            case PASSWORD_UPDATE_FAILED:
                return {
                    ...state,
                    updatingPassword: false,
                    passwordUpdateError: payload.error,
                    passwordUpdatedSuccessfully: false
                }
            default:
                return state;
        }
    };


export const GenericUserProvider: React.FC<UserProviderProps> = ({children}) => {
    const {token} = useContext(LoginContext)
    const updateProfilePic = useCallback<UpdateProfilePicFunction>(updateProfilePicCallback, [token])
    const updateProfileDetails = useCallback<UpdateProfileDetailsFunction>(updateProfileDetailsCallback, [token])
    const updatePassword = useCallback<UpdatePasswordFunction>(updatePasswordCallback, [token])
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        updatingProfileDetails,
        passwordUpdatedSuccessfully,
        updatingProfilePicture,
        profileDetailsUpdateError,
        gettingAccountDetails,
        getAccountDetailsError,
        profilePicUpdateError,
        passwordUpdateError,
        updatingPassword,
        phone,
        username,
        lastName,
        firstName,
        picture,
        email
    } = state;


    useEffect(() => {
        let canceled = false;
        getDetails();
        return () => {
            canceled = true;
        }

        async function getDetails() {
            if (!token?.trim()) {
                return;
            }
            try {
                console.log('getAccountDetails started');
                dispatch({type: GET_ACCOUNT_DETAILS_STARTED});
                const details = await getProfileDetails(token);
                console.log('getAccountDetails succeeded');
                if (!canceled) {
                    dispatch({type: GET_ACCOUNT_DETAILS_SUCCEEDED, payload: {details}});
                }
            } catch (error) {
                dispatch({type: GET_ACCOUNT_DETAILS_FAILED, payload: {error}});
            }

        }
    }, [token])

    async function updateProfilePicCallback(picture?: string) {
        try {
            dispatch({type: PROFILE_PICTURE_UPDATE_STARTED})
            await updateProfilePicAPI(picture, token)
            dispatch({type: PROFILE_PICTURE_UPDATE_SUCCEEDED, payload: {picture}})
        } catch (error) {
            dispatch({type: PROFILE_PICTURE_UPDATE_FAILED, payload: {error}})
        }

    }

    async function updateProfileDetailsCallback(details?: UserProps) {
        try {
            dispatch({type: PROFILE_DETAILS_UPDATE_STARTED})
            let updated = await updateProfileDetailsAPI(details, token)
            dispatch({type: PROFILE_DETAILS_UPDATE_SUCCEEDED, payload: {details: updated}})
        } catch (error) {
            dispatch({type: PROFILE_DETAILS_UPDATE_FAILED, payload: {error}})
        }
    }

    async function updatePasswordCallback(oldPswd?: string, newPswd?: string) {
        dispatch({type: PASSWORD_UPDATE_STARTED})
        let updated = await updatePasswordAPI(oldPswd, newPswd, token)
        if (updated.succeeded === true) {
            dispatch({type: PASSWORD_UPDATE_SUCCEEDED})
        } else {
            dispatch({type: PASSWORD_UPDATE_FAILED, payload: {error: new Error(updated.message)}})
        }
    }

    return (
        <UserContext.Provider value={{
            passwordUpdatedSuccessfully,
            updatingProfileDetails,
            updatingProfilePicture,
            updateProfileDetails,
            profileDetailsUpdateError,
            gettingAccountDetails,
            updateProfilePic,
            getAccountDetailsError,
            profilePicUpdateError,
            updatingPassword,
            passwordUpdateError,
            updatePassword,
            phone,
            username,
            lastName,
            firstName,
            picture,
            email
        }}>
            {children}
        </UserContext.Provider>
    );
}

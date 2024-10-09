import React, {useContext, useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {LoginContext, LoginState} from "../authentication/provider/AuthProvider";
import {Storage} from "@capacitor/storage";

export interface PrivateRouteProps {
    component: React.ComponentType<any>;
    path: string;
    exact?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component, ...rest}) => {
    const {isAuthenticated, token} = useContext<LoginState>(LoginContext);

    return (
        <Route {...rest} render={props => {
            if (isAuthenticated) {
                return <Component {...props} />;
            } else {
                return <Redirect to={{pathname: '/'}}/>
            }
        }}/>
    );
}
import React, {useContext, useEffect, useState} from 'react';
import {Redirect, RouteComponentProps} from 'react-router-dom';
import {IonAlert, IonButton, IonCard, IonContent, IonIcon, IonInput, IonLoading, IonPage} from "@ionic/react";


import "../../style/authentication.css"
import {AuthHeader} from "./AuthHeader";
import {lockOpen, person} from "ionicons/icons";
import {getLogger} from "../../core";
import {LoginContext} from "../provider/AuthProvider";
import Footer from "../../genericUser/components/Footer";

const log = getLogger("Login");

interface LoginState {
    username?: string;
    password?: string;
}
export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const {isAuthenticated, isAuthenticating, login, authenticationError} = useContext(LoginContext);
    const [loginState, setState] = useState<LoginState>({});
    const {username, password} = loginState;
    useEffect(() => {
        return () => {
            console.log("cleaned up");
        };
    }, []);

    const handleLogin = () => {
        log('handleLogin...');
        login?.(username, password);
    };

    log('render');
    if (isAuthenticated) {
        return <Redirect to={{pathname: '/home'}}/>
    }

    return (
        <IonPage>
            <AuthHeader/>
            <IonContent id={"auth_page"}>
                <div id={"login_card"}>
                    <IonInput
                        type={"text"}
                        className={"login_input"}
                        placeholder="Username"
                        value={username}
                        onIonChange={e => setState({...loginState, username: e.detail.value || ''})}>
                        <IonIcon icon={person}/>
                    </IonInput>
                    <IonInput
                        type={"password"}
                        id={"password"}
                        className={"login_input"}
                        placeholder="Password"
                        value={password}
                        onIonChange={e => setState({...loginState, password: e.detail.value || ''})}>
                        <IonIcon icon={lockOpen}/>
                    </IonInput>

                    <IonButton onClick={handleLogin} id={"authButton"} color={"default"}>LOGIN</IonButton>
                    <br/>
                    <a href={"/signup"} id={"link"}>Create an account</a>
                </div>

                <IonLoading isOpen={isAuthenticating}/>
                {authenticationError && (
                    // <div>{authenticationError.message || 'Failed to authenticate'}</div>
                    <IonAlert isOpen={true}
                              cssClass={"ion-alert"}
                              header={'Eroare de autentificare!'}
                              message={'Nume de utilizator incorect sau parolă incorectă!'}
                    />
                )}
                <Footer/>
            </IonContent>
        </IonPage>
    )
};
export default Login;
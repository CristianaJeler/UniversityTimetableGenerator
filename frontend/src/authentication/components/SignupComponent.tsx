import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from "react-router-dom";
import {
    CreateAnimation,
    createAnimation,
    IonAlert,
    IonButton,
    IonCard,
    IonContent,
    IonIcon,
    IonInput,
    IonLoading,
    IonPage,
    IonRouterLink,
    IonSelect,
    IonSelectOption
} from "@ionic/react";
import "../../style/authentication.css"
import {eye, lockOpen, mail, person} from "ionicons/icons";
// import "./design/authentication.css"
import {AuthHeader} from "./AuthHeader";
import {SignupContext, SignupState} from "../provider/AuthProvider";
import {getLogger} from "../../core";
import Footer from "../../genericUser/components/Footer";

const log = getLogger("Login");

const signupInitialState: SignupState = {
    isSigned: false,
    pendingSignup: false,
    signupError: null
}

export const SignupComponent: React.FC<RouteComponentProps> = ({ history }) => {
    const { isSigned, pendingSignup, signupError, signup } = useContext(SignupContext);
    const [signupState, setState] = useState<SignupState>(signupInitialState);
    const { firstName, lastName, email, userType, username, password, password_check } = signupState;
    const [passState, setPassState] = useState<boolean>(true)
    const [showSignupError, setShowSignupError] = useState(false)

    useEffect(() => {
        return () => {
            console.log("cleaned up");
            setShowSignupError(false)
        };
    }, []);
    const handleSignup = () => {
        log('handleSignup...')
        if (password_check !== password) setPassState(false);
        else {
            setPassState(true);
            signup && signup({
                firstName: firstName || '', lastName: lastName || '', email: email || '', userType: userType || '',
                username: username || '', password: password || ''
            })
        }
    }
    const animation = function simpleAnimation() {
        const el = document.querySelector('#passwordCheck');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(200)
                .direction('alternate')
                .iterations(1)
                .fromTo("background", 'rgb(255, 204, 204)', 'white')
                .onFinish(() => {setPassState(true); });
            animation.play();
        }
    }
    return (
        <IonPage>
            <AuthHeader />
            <IonContent id={"auth_page"}>
                <IonCard id={"auth_grid"}>
                    <IonSelect interface={"popover"} placeholder={"User type (Teacher, Database administrator, Timetable manager)"}
                               class={"auth_input"} value={userType}
                               onIonChange={e => setState({ ...signupState, userType: e.detail.value || '' })} >
                        <IonSelectOption value={"1"} class = {"selectOtpion"}>
                            Teacher
                        </IonSelectOption>
                        <IonSelectOption value={"2"} class = {"selectOtpion"}>
                            Database Administrator
                        </IonSelectOption>
                        <IonSelectOption value={"3"} class = {"selectOtpion"}>
                            Timetable Manager
                        </IonSelectOption>
                    </IonSelect>
                    <IonInput
                        className={"auth_input"}
                        placeholder="First Name"
                        value={firstName}
                        onIonChange={e => setState({ ...signupState, firstName: e.detail.value || '' })}>
                        <IonIcon icon={person} />
                    </IonInput>
                    <IonInput
                        className={"auth_input"}
                        placeholder="Last name"
                        value={lastName}
                        onIonChange={e => setState({ ...signupState, lastName: e.detail.value || '' })}>
                        <IonIcon icon={person} />
                    </IonInput>
                    <IonInput
                        className={"auth_input"}
                        placeholder="Email"
                        value={email}
                        onIonChange={e => setState({ ...signupState, email: e.detail.value || '' })}>
                        <IonIcon icon={mail} />
                    </IonInput>

                    <IonInput
                        type={"text"}
                        id={"username"}
                        className={"auth_input"}
                        placeholder="Username"
                        value={username}
                        onIonChange={e => {
                            setPassState(true);
                            setState({ ...signupState, username: e.detail.value || '' })
                        }}>
                        <IonIcon icon={person} />
                        {/*<IonIcon className={"icon"} icon={eye} />*/}
                        {!passState && (<CreateAnimation
                            ref={animation}
                        />)
                        }
                    </IonInput>

                    <IonInput
                        className={"auth_input"}
                        placeholder="Password"
                        value={password}
                        type={"password"}
                        onIonChange={e => {
                            setPassState(true);
                            setState({ ...signupState, password: e.detail.value || '' })
                        }}>
                        <IonIcon icon={lockOpen} />
                        <IonIcon className={"icon"} icon={eye}/>
                    </IonInput>
                    <IonInput
                        type={"password"}
                        id={"passwordCheck"}
                        className={"auth_input"}
                        placeholder="Password check"
                        value={password_check}
                        onIonChange={e => {
                            setPassState(true);
                            setState({ ...signupState, password_check: e.detail.value || '' })
                        }}>
                        <IonIcon icon={lockOpen} />
                        <IonIcon className={"icon"} icon={eye} />
                        {!passState && (<CreateAnimation
                            ref={animation}
                        />)
                        }
                    </IonInput>
                    <IonButton onClick={handleSignup} id={"authButton"} color={"default"}>Signup</IonButton>
                    <br />
                    <IonRouterLink routerLink={"/login"} id={"link"}><u>Already have an account?<br/>Go to the login page!</u></IonRouterLink>
                </IonCard>

                <IonLoading cssClass="ion-loading" isOpen={pendingSignup} message={"Signup pending ..."} />
                <IonAlert cssClass="ion-alert" isOpen={signupError != null} header="Signup failed!" message={signupError?.message} />
                <IonAlert isOpen={isSigned} header={"Congrats!"} message={"Welcome to Orario!\nGo to the login page?"} buttons={[
                    {
                        text: 'YES',
                        handler: () => {
                            history.push("/login");
                            setState({... signupState, isSigned: false})
                        }
                    },
                    {
                        text: 'NO'
                    }
                ]} />
                <Footer/>
            </IonContent>
        </IonPage>
    );
};

export default SignupComponent;
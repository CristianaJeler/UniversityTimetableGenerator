import React from "react";
import {IonButton, IonButtons, IonHeader, IonImg, IonToolbar} from "@ionic/react";

// @ts-ignore
import logo from "../../images/icon/icon.png"
import "../../style/header.css"

export const HeaderMain: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={logo} onClick={() => window.location.href = "/home"} />

                    <IonButtons slot="end">
                        <IonButton routerLink={"/login"} id={"loginBtn"}>
                            LOGIN
                        </IonButton>
                        <IonButton routerLink={"/signup"} id={"signupBtn"}>
                            SIGNUP
                        </IonButton>
                    </IonButtons>

                </IonToolbar>
            </IonHeader>
        </>
    )
};
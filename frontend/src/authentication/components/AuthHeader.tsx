import React from "react";
import {IonHeader, IonImg, IonToolbar} from "@ionic/react";
import "../../style/header.css"
// @ts-ignore
import logo from "../../images/icon/icon.png"

export const AuthHeader: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={logo} onClick={()=>window.location.href="/home"}/>
                </IonToolbar>
            </IonHeader>
        </>
    )
};
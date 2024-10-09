import React, {useContext} from "react";
import {IonButton, IonButtons, IonHeader, IonIcon, IonImg, IonToolbar} from "@ionic/react";
import {logOut,} from "ionicons/icons";
import "../../style/header.css"
// @ts-ignore
import logo from "../../images/icon/icon.png";
import {LoginContext} from "../../authentication/provider/AuthProvider";
// @ts-ignore
import defaultProfilePic from "../../images/profile.png";

export const HeaderLoggedUser: React.FC = () => {
    const {logout} = useContext(LoginContext)
    const handleLogout = () => {
        logout && logout();
    }

    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={logo} onClick={() => window.location.href = "/home"} title={"Home"} />
                    <IonButtons  slot="end">
                        <IonButton onClick={handleLogout} id={"logoutBtn"}>
                                            <IonIcon slot="start" icon={logOut}/> Logout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
        </>
    )
};
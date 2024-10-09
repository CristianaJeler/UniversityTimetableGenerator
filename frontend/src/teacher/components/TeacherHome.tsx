import React, {useEffect} from "react";
import {IonCard, IonCardContent, IonCardTitle, IonContent, IonGrid, IonImg, IonPage, IonRow,} from "@ionic/react";
import "../../style/teachers.home.css"
import Footer from "../../genericUser/components/Footer";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
// @ts-ignore
import settingsImg from "../../images/settings.jpg"
// @ts-ignore
import preferencesImg from "../../images/preferences.jpg"
// @ts-ignore
import yesNoImg from "../../images/yes_no.jpg"

export const TeacherHome: React.FC = () => {
    useEffect(() => {
        return () => {
            console.log("Unmounted AdminHome component");
        };
    }, []);

    return (
        <IonPage>
            <HeaderLoggedUser />
            <IonContent id="contentPage">
                <IonGrid id={"grid"}>
                    <IonRow>
                <IonCard class={"cardTeacherHome"}  routerLink = {"/manage_prefs"} >
                    <IonCardContent>
                        <IonImg src={preferencesImg} class={"cardImg"}/>
                    </IonCardContent>
                    <IonCardTitle class={"ion-text-center"}>
                        Add preferences
                    </IonCardTitle>
                </IonCard>
                <IonCard class={"cardTeacherHome"}  routerLink = {"/your_prefs"} >
                    <IonCardContent>
                        <IonImg src={yesNoImg} class={"cardImg"}/>
                    </IonCardContent>
                    <IonCardTitle class={"ion-text-center"}>
                        Your preferences
                    </IonCardTitle>
                </IonCard>
                <IonCard class={"cardTeacherHome"} routerLink = {"/settings"}>
                    <IonCardContent>
                        <IonImg src={settingsImg} class={"cardImg"}/>
                    </IonCardContent>
                    <IonCardTitle class={"ion-text-center"}>
                        Account settings
                    </IonCardTitle>
                </IonCard>
                    </IonRow>
                </IonGrid>

            </IonContent>
            <Footer />

        </IonPage>
    )
};
export default TeacherHome;
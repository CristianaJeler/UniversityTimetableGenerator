import React, {useEffect} from "react";
import {
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonImg,
    IonPage,
    IonRow,
} from "@ionic/react";
import Footer from "../../genericUser/components/Footer";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
import "../../style/timetable.css"
// @ts-ignore
import settingsImg from "../../images/settings.jpg"
// @ts-ignore
import timetableImg from "../../images/generateTimetable.jpg"

export const TimetableGeneratorHome: React.FC = () => {
    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id="contentPage" scrollY={false}>
                <IonCard routerLink={"/generate_timetable"} class={"actionCardGenerator"}>
                    <IonCardContent>
                        <IonImg src={timetableImg} class={"cardImg"}/>
                    </IonCardContent>
                    <IonCardTitle class={"ion-text-center"}>
                        Generate the Timetable
                    </IonCardTitle>
                </IonCard>

                <IonCard routerLink={"/settings"} class={"actionCardGenerator"}>
                    <IonCardContent>
                        <IonImg src={settingsImg} class={"cardImg"}/>
                    </IonCardContent>
                    <IonCardTitle class={"ion-text-center"}>
                        Account settings
                    </IonCardTitle>
                </IonCard>
            </IonContent>
            <Footer/>
        </IonPage>
    )
};
export default TimetableGeneratorHome;
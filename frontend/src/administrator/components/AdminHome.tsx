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
import "../../style/admin.home.css"
import Footer from "../../genericUser/components/Footer";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
// @ts-ignore
import settingsImg from "../../images/settings.jpg"
// @ts-ignore
import subjectsImg from "../../images/subjects.jpg"
// @ts-ignore
import classesImg from "../../images/classes.jpg"
// @ts-ignore
import buildingImg from "../../images/building.jpg"
// @ts-ignore
import studentsImg from "../../images/students.jpg"
// @ts-ignore
import formationsImg from "../../images/studentFormations.jpg"
// @ts-ignore
import teacherImg from "../../images/teachers.jpg"
// @ts-ignore
import auditoriumImg from "../../images/auditorium.jpg"

export const AdminHome: React.FC = () => {
    useEffect(() => {
        return () => {
            console.log("Unmounted AdminHome component");
        };
    }, []);

    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id="pgContentAdmin" scrollY={true}>
                {/*<IonGrid id={"grid"} class="ion-content-scroll-host">*/}
                    {/*<IonRow class={"row"}>*/}
                    {/*    <IonCol class={"colUp"}>*/}
                            <IonCard routerLink={"/manage_subjects"} class={"actionCardAdmin"}>
                                {/*<IonCardContent>*/}
                                    <IonImg src={subjectsImg} class={"cardImg"}/>
                                {/*</IonCardContent>*/}
                                <IonCardTitle class={"ion-text-center"}>
                                    Manage subjects
                                </IonCardTitle>
                            </IonCard>
                        {/*</IonCol>*/}
                        {/*<IonCol class={"colUp"}>*/}
                            <IonCard routerLink={"/manage_classes"} class={"actionCardAdmin"}>
                                {/*<IonCardContent>*/}
                                    <IonImg src={classesImg} class={"cardImg"}/>
                                {/*</IonCardContent>*/}
                                <IonCardTitle class={"ion-text-center"}>
                                    Manage classes
                                </IonCardTitle>
                            </IonCard>
                        {/*</IonCol>*/}
                        {/*<IonCol class={"colUp"}>*/}
                            <IonCard routerLink={"/buildings_rooms"} class={"actionCardAdmin"}>
                                {/*<IonCardContent>*/}
                                    <IonImg src={buildingImg} class={"cardImg"}/>
                                {/*</IonCardContent>*/}
                                <IonCardTitle class={"ion-text-center"}>
                                    Buildings & Rooms
                                </IonCardTitle>
                            </IonCard>
                        {/*</IonCol>*/}
                    {/*</IonRow>*/}
                    {/*<IonRow class={"rowDown"}>*/}
                    {/*    <IonCol class={"colUp"}>*/}
                            <IonCard routerLink={"/manage_formations"} class={"actionCardAdmin"}>
                                {/*<IonCardContent>*/}
                                    <IonImg src={formationsImg} class={"cardImg"}/>
                                {/*</IonCardContent>*/}
                                <IonCardTitle class={"ion-text-center"}>
                                    Study formations
                                </IonCardTitle>
                            </IonCard>
                        {/*</IonCol>*/}
                        {/*<IonCol class={"col"}>*/}
                        {/*    <IonCard routerLink={"/teachers_courses"}>*/}
                        {/*        <IonCardContent>*/}
                        {/*            <IonImg src={teacherImg} class={"cardImg"}/>*/}
                        {/*        </IonCardContent>*/}
                        {/*        <IonCardTitle class={"ion-text-center"}>*/}
                        {/*            Teachers & courses*/}
                        {/*        </IonCardTitle>*/}
                        {/*    </IonCard>*/}
                        {/*</IonCol>*/}
                        {/*<IonCol class={"col"}>*/}
                        {/*    <IonCard routerLink={"/years_subjects"} class={"actionCard"}>*/}
                        {/*        <IonCardContent>*/}
                        {/*            <IonImg src={studentsImg} class={"cardImg"}/>*/}
                        {/*        </IonCardContent>*/}
                        {/*        <IonCardTitle class={"ion-text-center"}>*/}
                        {/*            Subjects & Years*/}
                        {/*        </IonCardTitle>*/}
                        {/*    </IonCard>*/}
                        {/*</IonCol>*/}
                        {/*<IonCol class={"colUp"}>*/}
                            <IonCard routerLink={"/settings"} class={"actionCardAdmin"}>
                                {/*<IonCardContent>*/}
                                    <IonImg src={settingsImg} class={"cardImg"}/>
                                {/*</IonCardContent>*/}
                                <IonCardTitle class={"ion-text-center"}>
                                    Account settings
                                </IonCardTitle>
                            </IonCard>
                        {/*</IonCol>*/}
                    {/*</IonRow>*/}
                {/*</IonGrid>*/}
            </IonContent>
            <Footer/>
        </IonPage>
    )
};
export default AdminHome;
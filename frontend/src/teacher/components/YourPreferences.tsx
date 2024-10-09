import React, {useContext, useEffect, useState} from "react";

import {
    IonCol,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonRippleEffect,
    IonRow,
    IonTitle,
} from "@ionic/react";
// @ts-ignore
import unknownProfile from "../../images/profile.png"
import "../../style/preferences.css"

import {RouteComponentProps} from "react-router";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
import Footer from "../../genericUser/components/Footer";
import {TeacherContext} from "../provider/TeacherProvider";
import {LoginContext} from "../../authentication/provider/AuthProvider";

const days = ["", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
const timeIntervals = ["", "08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"]
let roomAssetsList = [{key: "Computers", value: false},
    {key: "Microscopes", value: false},
    {key: "Maps", value: false},
    {key: "Physics equipment", value: false},
    {key: "Chemistry equipment", value: false},
    {key: "Biology equipment", value: false}]

const classTypes = ["", "LECTURE", "SEMINAR", "LABORATORY"]

export const YourPreferences: React.FC<RouteComponentProps> = () => {
    const {
        teachersTimePreferences, teachersRoomsPreferences,
        getTeachersTimePreferences, getTeachersRoomsPreferences,
        getClassesByTeacher, teachersClasses
    }
        = useContext(TeacherContext)

    const {token} = useContext(LoginContext)

    useEffect(() => {
        getTeachersRoomsPreferences && getTeachersRoomsPreferences()
        getTeachersTimePreferences && getTeachersTimePreferences()
        getClassesByTeacher && getClassesByTeacher()
    }, [token])

    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id={"pageContent"}>
                <IonTitle class={"preferencesSectionTitle"}>Your Time Preferences</IonTitle>
                <IonList id={"intervalsList"}>
                    {teachersTimePreferences && teachersTimePreferences.sort((a, b) => a.id.dayId - b.id.dayId)
                        .map(ttp => {
                            let availabilityInfo = <IonCol>N/A</IonCol>;
                            if (ttp.availableAllDay) availabilityInfo = <IonCol>ALL DAY</IonCol>;
                            else if (ttp.timeIntervals.length > 0) {
                                availabilityInfo = <IonCol>
                                    {ttp.timeIntervals.map(int => <IonRow>{timeIntervals[int]}</IonRow>)}
                                </IonCol>
                            }

                            return <IonItem>
                                <IonRow class={"timeIntervalsRow"}>
                                    <IonCol class={"availabilityDayCol"}>{days[ttp.id.dayId]}</IonCol>
                                    <IonCol class={"availabilityTextCol"}>Your are available for: </IonCol>
                                    {availabilityInfo}
                                </IonRow>
                            </IonItem>
                        })}
                </IonList>

                <IonTitle class={"preferencesSectionTitle"}>Room Preferences</IonTitle>
                <IonList id={"roomsPrefsList"}>
                    <IonItem>
                        <IonRow class={"roomPrefsRow"}>
                            <IonCol class={"roomPrefsSubject"}><b>SUBJECT</b></IonCol>
                            <IonCol class={"roomPrefsClass"}><b>CLASS TYPE</b></IonCol>
                            <IonCol class={"roomPrefsRooms"}><b>PREFERRED ROOMS</b></IonCol>
                            <IonCol class={"roomPrefsDevices"}><b>PREFERRED DEVICES</b></IonCol>
                            <IonCol class={"roomPrefsBoards"}><b>PREFERRED BOARDS</b></IonCol>
                            <IonCol class={"roomPrefsProjector"}><b>PROJECTOR</b></IonCol>
                        </IonRow>
                    </IonItem>
                    {teachersRoomsPreferences && teachersRoomsPreferences
                        .map(trp => {
                            let cls = teachersClasses.find(c => c.classId === trp.id.classId)
                            let subjectName = ""
                            let classType = ""
                            if (cls) {
                                subjectName = cls.subjectName
                                classType = classTypes[cls.classType]
                            }

                            return <IonItem>
                                <IonRow class={"roomPrefsRow"}>
                                    <IonCol class={"roomPrefsSubject"}>{subjectName}</IonCol>
                                    <IonCol class={"roomPrefsClass"}>{classType}</IonCol>
                                    <IonCol class={"roomPrefsRooms"}>{trp.preferredRooms.map((r, idx) => {
                                        if (idx < trp.preferredRooms.length-1) return r + ", "
                                        else return r
                                    })}</IonCol>
                                    <IonCol class={"roomPrefsDevices"}>{trp.preferredDevices.map((d, idx) => {
                                        if (idx < trp.preferredDevices.length-1) return d + ", "
                                        else return d
                                    })}</IonCol>
                                    <IonCol class={"roomPrefsBoards"}>{trp.preferredBoards.map((b, idx) => {
                                        if (idx < trp.preferredBoards.length-1) return b + ", "
                                        else return b
                                    })}</IonCol>
                                    <IonCol class={"roomPrefsProjector"}>{trp.wantsProjector ? "YES" : "NO"}</IonCol>
                                </IonRow>
                            </IonItem>
                        })}
                </IonList>
            </IonContent>
            <Footer/>
        </IonPage>
    )
}

export default YourPreferences;
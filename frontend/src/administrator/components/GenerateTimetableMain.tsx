import React, {useContext, useEffect, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardTitle, IonCol,
    IonContent,
    IonGrid, IonHeader, IonIcon,
    IonImg, IonModal,
    IonPage, IonProgressBar, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonText
} from "@ionic/react";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
import Footer from "../../genericUser/components/Footer";
import {AdminContext} from "../provider/AdministratorProvider";
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {documentText, filterCircle, filterSharp, tabletLandscapeOutline, timeOutline} from "ionicons/icons";

import "../../style/timetable.css"

const DAYS = ["", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
const TIME_INTERVALS = ["", "08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"]
const WEEKS = ["-", "WEEK 1", "WEEK 2"]
export const TimetableGeneratorMain: React.FC = () => {
    const {
        timetable,
        generateTimetable,
        fetchTimetable,
        timetableFetchedSuccessfully, timetableGenerationProgressStatus,
        progress
    } = useContext(AdminContext);
    const {token} = useContext(LoginContext)

    let teachers: string[] = []

    useEffect(() => {
        fetchTimetable && fetchTimetable()
    }, [token])

    useEffect(() => {
        timetable?.forEach(e => {
            if (e.teacher && !teachers.includes(e.teacher)) teachers.push(e.teacher);
        })

    }, [timetableFetchedSuccessfully])

    const [openFiltersModal, setOpenFiltersModal] = useState(false)


    function generateNewTimetable() {
        generateTimetable && generateTimetable(2)
    }

    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id="contentPage" scrollY={true}>

                <IonButtons id={"ionButtonsGenerator"}>
                    <IonText>Generate a new table... </IonText>
                    <IonButton class={"generatorButton"} fill={"outline"} style={{"margin-left": "2%"}}
                               onClick={() => generateNewTimetable()}>
                        Generate New Timetable<IonIcon icon={timeOutline}/>
                    </IonButton>
                    {/*<IonButton class={"generatorButton"} style={{"margin-left": "2%"}} fill={"outline"} slot={"end"}*/}
                    {/*           onClick={() => setOpenFiltersModal(true)}>Filters <IonIcon*/}
                    {/*    icon={filterSharp}/> </IonButton>*/}
                    <IonGrid class={"progressGrid"}>
                        <IonCol>
                            <IonRow class={"progressRow"}> {timetableGenerationProgressStatus}</IonRow>
                            <IonRow class={"progressRow"}><IonProgressBar value={progress} id={"progressBar"}> </IonProgressBar></IonRow>
                        </IonCol>
                    </IonGrid>
                </IonButtons>
                <div id={"timetable"}>
                    <IonRow id={"tableHeader"}>
                        <IonCol>Day</IonCol>
                        <IonCol>Time</IonCol>
                        <IonCol>Week</IonCol>
                        <IonCol>Room</IonCol>
                        <IonCol>Formation</IonCol>
                        <IonCol>Class</IonCol>
                        <IonCol>Subject</IonCol>
                        <IonCol>Teacher</IonCol>
                    </IonRow>
                    {timetable && timetable.map(entry => {
                            return <IonRow key={entry.id} class={"timetableRow"}>
                                <IonCol>{DAYS[entry.day || 0]}</IonCol>
                                <IonCol>{TIME_INTERVALS[entry.time || 0]}</IonCol>
                                <IonCol>{WEEKS[entry.week || 0]}</IonCol>
                                <IonCol>{entry.room}</IonCol>
                                <IonCol>{entry.formation}</IonCol>
                                <IonCol>{entry.classType}</IonCol>
                                <IonCol>{entry.subjectName}</IonCol>
                                <IonCol>{entry.teacher}</IonCol>
                            </IonRow>
                        }
                    )}
                </div>

                <IonModal isOpen={openFiltersModal} onDidDismiss={() => setOpenFiltersModal(false)}>
                    <IonSelect>
                        {teachers && teachers.map(t => <IonSelectOption>{t}</IonSelectOption>)}
                    </IonSelect>
                </IonModal>
                <Footer/>

            </IonContent>
        </IonPage>
    )
};
export default TimetableGeneratorMain;
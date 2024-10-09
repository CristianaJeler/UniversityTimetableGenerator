import React, {useContext, useEffect, useRef, useState} from "react";

import {
    createAnimation,
    IonAlert,
    IonButton,
    IonButtons,
    IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol,
    IonContent, IonGrid,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonInput,
    IonItem,
    IonItemDivider, IonItemGroup,
    IonLabel,
    IonList, IonListHeader,
    IonModal,
    IonPage,
    IonRadio,
    IonRadioGroup, IonRow,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
// @ts-ignore
import unknownProfile from "../../images/profile.png"
import "../../style/classesPage.css"

import {RouteComponentProps} from "react-router";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
import {
    addSharp,
    build,
    eyedropSharp,
    eyeOutline,
    eyeSharp,
    pencilSharp,
    saveSharp,
    trendingDown
} from "ionicons/icons";
import Footer from "../../genericUser/components/Footer";
import {AdminContext, FormationProps, SubjectProps} from "../provider/AdministratorProvider";
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {UserProps} from "../../genericUser/provider/GenericUserProvider";
import {enterAnimation, leaveAnimation} from "../../core/animations";
import {addNewClass} from "../api/AdministratorApi";

const PAGE_SIZE = 10;
export const ManageClasses: React.FC<RouteComponentProps> = () => {
    const [openAddClassModal, setOpenAddClassModal] = useState(false)
    const [openViewAssociationsModal, setOpenViewAssociationsModal] = useState(false)
    const [currentSubjectsPage, setCurrentSubjectsPage] = useState(0)
    const [currentTeachersPage, setCurrentTeachersPage] = useState(0)
    const [selectedTeacher, setSelectedTeacher] = useState<UserProps>()
    const [selectedSubject, setSelectedSubject] = useState<SubjectProps>()
    const [selectedClass, setSelectedClass] = useState<number>(0)
    const [selectedFormation, setSelectedFormation] = useState<FormationProps>()
    const [currentFormationsPage, setCurrentFormationsPage] = useState(0)
    const classTypes = ['', "Lecture", "Seminar", "Laboratory"]

    const [selectedSubjectLect, setSelectedSubjectLect] = useState(true)
    const [selectedSubjectSem, setSelectedSubjectSem] = useState(true)
    const [selectedSubjectLab, setSelectedSubjectLab] = useState(true)

    const [newClassSubject, setNewClassSubject] = useState('')
    const [newClassType, setNewClassType] = useState(0)
    const [newClassFrequency, setNewClassFrequency] = useState(0)

    const [openAddAlert, setOpenAddAlert] = useState(false)
    const [openSavedAssocAlert, setOpenSavedAssocAlert] = useState(false)


    const {
        addNewRoom, searchSubjects,
        addNewBuilding, fetchBuildings,
        subjects,
        fetchTeachers,
        teachers,
        formations,
        fetchFormations,
        fetchClasses,
        classes,
        addNewAssociation, associations,
        fetchAllAssociations,
        addNewAssociationSuccessfully,
        addNewAssociationError,
        fetchedCLassesSuccessfully,
        fetchClassesError,
        addNewClass
    } = useContext(AdminContext);
    const {token} = useContext(LoginContext)


    useEffect(() => {
            let canceled = false;
            fetchBuildings && fetchBuildings();
            return () => {
                canceled = true;
            }
        }, [token]
    )

    useEffect(() => {
            if (addNewAssociationError !== null) {
                setOpenAddAlert(true)
            } else {
                setOpenAddAlert(false)
            }
        }, [addNewAssociationError]
    )

    useEffect(() => {
            if (addNewAssociationSuccessfully) {
                setOpenSavedAssocAlert(true)
            } else {
                setOpenSavedAssocAlert(false)
            }
        }, [addNewAssociationSuccessfully]
    )

    useEffect(() => {
            let canceled = false;
            searchNextTeachersPage && searchNextTeachersPage()
            // setCurrentTeachersPage(currentTeachersPage + 1)
            return () => {
                canceled = true;
            }
        }, [token]
    )
    useEffect(() => {
            let canceled = false;
            searchNextSubjectsPage && searchNextSubjectsPage();
            // setCurrentSubjectsPage(currentSubjectsPage + 1)
            return () => {
                canceled = true;
            }
        }, [token]
    )

    useEffect(() => {
            let canceled = false;
            searchNextFormationsPage && searchNextFormationsPage();
            // setCurrentFormationsPage(currentFormationsPage + 1)
            return () => {
                canceled = true;
            }
        }, [token]
    )

    useEffect(() => {
            let canceled = false;
            fetchClasses && fetchClasses();
            // setCurrentFormationsPage(currentFormationsPage + 1)
            return () => {
                canceled = true;
            }
        }, [token]
    )

    useEffect(() => {
            let canceled = false;
            fetchAllAssociations && fetchAllAssociations();
            // setCurrentFormationsPage(currentFormationsPage + 1)
            return () => {
                canceled = true;
            }
        }, [token]
    )

    async function searchNextSubjectsPage(event?: CustomEvent<void>) {
        searchSubjects && searchSubjects('', currentSubjectsPage, PAGE_SIZE)
        // setCurrentSubjectsPage(currentSubjectsPage + 1)
        event && await (event.target as HTMLIonInfiniteScrollElement).complete();
    }

    async function searchNextTeachersPage(event?: CustomEvent<void>) {
        fetchTeachers && fetchTeachers(currentTeachersPage, PAGE_SIZE)
        event && await (event.target as HTMLIonInfiniteScrollElement).complete();
        // setCurrentTeachersPage(currentTeachersPage + 1)

    }

    async function searchNextFormationsPage(event?: CustomEvent<void>) {
        fetchFormations && fetchFormations(selectedClass, currentFormationsPage, 500)
        // setCurrentFormationsPage(currentFormationsPage + 1)

        console.log(formations)
        event && await (event.target as HTMLIonInfiniteScrollElement).complete();
    }

    function setSelectedSubjectClasses(subjectId: string) {
        setSelectedSubjectLect(true)
        setSelectedSubjectSem(true)
        setSelectedSubjectLab(true)
        classes.filter(c => c.subjectId === subjectId)
            .forEach(c => {
                if (c.classType === 1) setSelectedSubjectLect(false)
                if (c.classType === 2) setSelectedSubjectSem(false)
                if (c.classType === 3) setSelectedSubjectLab(false)
            })
    }

    function saveAssociation() {
        addNewAssociation && addNewAssociation(selectedTeacher?.username, selectedClass, selectedSubject?.id, selectedFormation?.code)
    }

    function saveClass() {
        addNewClass && addNewClass({classType: newClassType, subjectId:newClassSubject, frequency:newClassFrequency})
    }

    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id={"pageContentClasses"} scrollY={false}>
                {/*ADD NEW CLASS MODAL*/}
                <IonModal isOpen={openAddClassModal} onDidDismiss={() => setOpenAddClassModal(false)}
                          enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                    <IonLabel class={"classesSectionTitle"}>Subjects</IonLabel>
                    <IonContent placeholder={"Select a subject"} id={"subjectsListClassesInModal"} scrollY={true}>
                        <IonRadioGroup onIonChange={(e) => setNewClassSubject(e.detail.value)}>
                            {subjects && subjects.map(s => {
                                return (<IonItem class={"searchedSubjectClasses"} key={s.id}>
                                    <IonRadio style={{"color": "#3c0085", "margin-right": "2%"}}
                                              value={s.id}></IonRadio>
                                    <IonText>{s.name}</IonText>
                                </IonItem>)
                            })
                            }
                        </IonRadioGroup>
                        <IonInfiniteScroll
                            style={{"width": "100%", "height": "100vh"}}
                            threshold="100%"
                            disabled={false}
                            onIonInfinite={(e) => {
                                searchNextSubjectsPage(e);
                                setCurrentSubjectsPage(currentSubjectsPage + 1)
                            }}>
                            <IonInfiniteScrollContent
                                loadingSpinner={"bubbles"}
                                loadingText="Loading subjects...">
                            </IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                    </IonContent>

                    <IonItemDivider class={"dividerClasses"}/>
                    <IonLabel class={"classesSectionTitle"} slot={"end"}>Class type</IonLabel>
                    <IonSelect id="classTypeSelect"
                               placeholder={"Select the type of the class..."}
                               style={{"color": "#1d013f", "width": "70%", "margin": "auto"}}
                               onIonChange={(e) => setNewClassType(e.detail.value)}>
                        <IonSelectOption value={1}>Lecture</IonSelectOption>
                        <IonSelectOption value={2}>Seminar</IonSelectOption>
                        <IonSelectOption value={3}>Laboratory</IonSelectOption>
                    </IonSelect>
                    <IonItemDivider class={"dividerClasses"}/>
                    <IonLabel class={"classesSectionTitle"}>Frequency</IonLabel>
                    <IonSelect placeholder={"The frequency of the class..."}
                               style={{"color": "#1d013f", "width": "70%", "margin": "auto"}}
                               onIonChange={(e) => setNewClassFrequency(e.detail.value)}>
                        <IonSelectOption value={1}>Weekly</IonSelectOption><br/>
                        <IonSelectOption value={2}>Biweekly</IonSelectOption>
                    </IonSelect>
                    <IonItemDivider class={"dividerClasses"}/>

                    <IonButton onClick={() => {saveClass(); setOpenAddClassModal(false);}} id={"addClassBtn"}> ADD CLASS </IonButton>
                </IonModal>

                <IonModal isOpen={openViewAssociationsModal} onDidDismiss={() => setOpenViewAssociationsModal(false)}
                          enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                    <IonContent placeholder={"Select a subject"}>
                        <IonTitle style={{"text-align": "center"}}>CLASSES SITUATION</IonTitle>
                        {associations && associations.map(a => {
                            return (<div className={"divAssociations ion-text-wrap"} key={a.id}>
                                    <IonItemDivider class={"associationItemDivider"}/>
                                    <IonLabel class={"assocLabel"}>Teacher:</IonLabel> <IonText
                                    class={"associationsDetails"}>  {a.teacher}</IonText><br/>
                                    <IonLabel class={"assocLabel"}>Class:</IonLabel> <IonText
                                    class={"associationsDetails"}>  {a.subject + ": " + classTypes[a.classType || 0]}</IonText><br/>
                                    <IonLabel class={"assocLabel"}>Formation:</IonLabel> <IonText
                                    class={"associationsDetails"}>  {a.formation}</IonText>
                                </div>
                            )
                        })
                        }
                        <IonInfiniteScroll
                            style={{"width": "100%", "height": "100vh"}}
                            threshold="100%"
                            disabled={false}
                            onIonInfinite={(e) => {
                                searchNextSubjectsPage(e);
                                setCurrentSubjectsPage(currentSubjectsPage + 1)
                            }}>
                            <IonInfiniteScrollContent
                                loadingSpinner={"bubbles"}
                                loadingText="Loading subjects...">
                            </IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                    </IonContent>
                </IonModal>

                <IonCardTitle class={"mainPageClassSectionTitle"}>Associate teachers with classes with
                    formations</IonCardTitle>

                <IonRow class={"upperGridRow"}>
                    <IonCol class={"gridCol"}>
                        <IonRow class={"classesTitleText"}><IonText>Teachers</IonText></IonRow>
                        <IonContent placeholder={"Select a teacher"} id={"teachersListClasses"}>
                            <IonRadioGroup onIonChange={(e) => setSelectedTeacher(e.target.value)}>
                                {teachers && teachers.map(t => {
                                    return (<IonItem key={t.email}>
                                        <IonText>{t.firstName + " " + t.lastName}</IonText>
                                        <IonRadio value={t} slot={"end"}></IonRadio>
                                    </IonItem>)
                                })
                                }
                            </IonRadioGroup>
                            <IonInfiniteScroll
                                // style={{"width": "100%", "height": "100vh"}}
                                threshold="80%"
                                disabled={false}
                                onIonInfinite={(e) => {
                                    searchNextTeachersPage(e);
                                    setCurrentTeachersPage(currentTeachersPage + 1)

                                }}>
                                <IonInfiniteScrollContent
                                    loadingSpinner={"bubbles"}
                                    loadingText="Loading subjects...">
                                </IonInfiniteScrollContent>
                            </IonInfiniteScroll>
                        </IonContent>
                    </IonCol>
                    <IonCol class={"gridCol"}>
                        <IonRow class={"classesTitleText"}><IonText>Subjects</IonText></IonRow>
                        <IonContent placeholder={"Select a teacher"} id={"subjectsListClasses"}>
                            <IonRadioGroup onIonChange={(e) => {
                                setSelectedSubject(e.target.value);
                                setSelectedSubjectClasses(e.target.value.id);
                            }}>
                                {subjects && subjects.map(s => {
                                    return (<IonItem key={s.code}>
                                        <IonText style={{"width": "95%"}}>{s.code + ": " + s.name}</IonText>
                                        <IonRadio value={s} slot={"end"}></IonRadio>
                                    </IonItem>)
                                })
                                }
                            </IonRadioGroup>
                            <IonInfiniteScroll
                                // style={{"width": "100%", "height": "100vh"}}
                                threshold="80%"
                                disabled={false}
                                onIonInfinite={(e) => {
                                    searchNextSubjectsPage(e);
                                    setCurrentSubjectsPage(currentSubjectsPage + 1)

                                }}>
                                <IonInfiniteScrollContent
                                    loadingSpinner={"bubbles"}
                                    loadingText="Loading subjects...">
                                </IonInfiniteScrollContent>
                            </IonInfiniteScroll>
                        </IonContent>
                        <IonRow>
                            <IonCol id={"classTypeText"}>
                                <IonText>Class Type: </IonText>
                            </IonCol>
                            <IonCol>
                                <IonRadioGroup onIonChange={(e) => {
                                    setSelectedClass(e.detail.value); /*setCurrentFormationsPage(0);*/
                                    /*searchNextFormationsPage();*/
                                }}>
                                    <IonRow class={"radioClassTypes"}><IonRadio value={1}
                                                                                disabled={selectedSubjectLect}></IonRadio><IonLabel
                                        class={"radioLabelClasses"}>Lecture</IonLabel></IonRow>
                                    <IonRow class={"radioClassTypes"}><IonRadio value={2}
                                                                                disabled={selectedSubjectSem}></IonRadio><IonLabel
                                        class={"radioLabelClasses"}>Seminar</IonLabel></IonRow>
                                    <IonRow class={"radioClassTypes"}><IonRadio value={3}
                                                                                disabled={selectedSubjectLab}></IonRadio><IonLabel
                                        class={"radioLabelClasses"}>Laboratory</IonLabel></IonRow>
                                </IonRadioGroup>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                    <IonCol class={"gridCol"}>
                        <IonRow class={"classesTitleText"}><IonText>Formations</IonText></IonRow>
                        <IonContent placeholder={"Select a formation"} id={"formationsListClasses"}>
                            <IonRadioGroup onIonChange={(e) => setSelectedFormation(e.target.value)}>
                                {formations && formations.filter(f => {
                                    if (selectedClass === 0) return true;
                                    return f.type === selectedClass
                                })
                                    .map(f => {
                                        return (<IonItem key={f.code} disabled={selectedClass===0}>
                                            <IonText style={{"width": "95%"}}>{f.code}</IonText>
                                            <IonRadio value={f} slot={"end"}></IonRadio>
                                        </IonItem>)
                                    })
                                }
                            </IonRadioGroup>
                            <IonInfiniteScroll
                                // style={{"width": "100%", "height": "100vh"}}
                                threshold="80%"
                                disabled={false}
                                onIonInfinite={(e) => {
                                    searchNextFormationsPage(e);
                                    setCurrentFormationsPage(currentFormationsPage + 1)

                                }}>
                                <IonInfiniteScrollContent
                                    loadingSpinner={"bubbles"}
                                    loadingText="Loading subjects...">
                                </IonInfiniteScrollContent>
                            </IonInfiniteScroll>
                        </IonContent>
                    </IonCol>
                </IonRow>


                {/*SELECTED ASSOCIATION SECTION*/}
                <IonRow class={"lowerGridRow"}>
                    <IonCol class={"lowerGridCol1"}><IonText>SELECTED ASSOCIATION</IonText></IonCol>

                    <IonCol class={"lowerGridCol2"}>
                        <IonRow>
                            <IonCol class={"lowerGridColNames"}>
                                <IonLabel>Teacher</IonLabel>
                            </IonCol>
                            <IonCol class={"lowerGridColValues"}>
                                <IonInput type={"text"} disabled={true} key={selectedTeacher?.username}>
                                    {selectedTeacher && selectedTeacher.firstName + " " + selectedTeacher.lastName}
                                </IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol class={"lowerGridColNames"}>
                                <IonLabel>Class</IonLabel>
                            </IonCol>
                            <IonCol class={"lowerGridColValues"}>
                                <IonInput type={"text"} disabled={true} key={selectedSubject?.id + ";" + selectedClass}>
                                    {selectedSubject && selectedSubject.name + " : " + classTypes[selectedClass]}
                                </IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol class={"lowerGridColNames"}>
                                <IonLabel>Formation</IonLabel>
                            </IonCol>
                            <IonCol class={"lowerGridColValues"}>
                                <IonInput type={"text"} disabled={true} key={selectedFormation?.code}>
                                    {selectedFormation && selectedFormation.code}
                                </IonInput>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                    <IonCol class={"lowerGridCol3"}>
                        <IonRow>
                            {/* SAVE ASSOCIATION BUTTON */}
                            <IonButton class={"classesPageBtn"}
                                       onClick={() => saveAssociation()}
                                       disabled={(selectedClass === undefined
                                           || selectedFormation === undefined
                                           || selectedSubject === undefined) && true}>
                                SAVE SELECTED ASSOCIATION <IonIcon icon={saveSharp} class={"btnIconClasses"}
                                                                   key={"addAssocBtn"}/>
                            </IonButton>
                        </IonRow>
                        <IonRow>
                            {/* OPEN ADD NEW CLASS MODAL BUTTON*/}
                            <IonButton onClick={() => {
                                setOpenViewAssociationsModal(true)
                            }} id={"openAddModalBtn"} class={"classesPageBtn"}>
                                VIEW ALL ASSOCIATIONS <IonIcon icon={eyeSharp} class={"btnIconClasses"}/>
                            </IonButton>
                        </IonRow>
                        <IonRow>
                            {/* OPEN ADD NEW CLASS MODAL BUTTON*/}
                            <IonButton onClick={() => {
                                setOpenAddClassModal(true)
                            }} id={"openAddModalBtn"} class={"classesPageBtn"}>
                                ADD A NEW CLASS <IonIcon icon={addSharp} class={"btnIconClasses"}/>
                            </IonButton>
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonContent>
            <IonAlert isOpen={openSavedAssocAlert} key="alertAdd" message={"Association added successfully!"}
                      header={"Success"} animated={true}
                      buttons={[
                          {
                              text: "Cancel",
                              role: "cancel",
                              cssClass: "cancel-t-button",
                              handler: () => {
                                  setOpenSavedAssocAlert(false)
                              },
                          }]}/>
            {/*<IonAlert isOpen={openAddAlert} key="alertAdd" message={"Association already exists!"} header={"Failed"}*/}
            {/*          animated={true} buttons={[*/}
            {/*    {*/}
            {/*        text: "Cancel",*/}
            {/*        role: "cancel",*/}
            {/*        cssClass: "cancel-t-button",*/}
            {/*        handler: () => {*/}
            {/*            setOpenAddAlert(false)*/}
            {/*        },*/}
            {/*    }]}/>*/}
            <Footer/>
        </IonPage>
    )
}

export default ManageClasses;
import React, {useContext, useEffect, useState} from "react";

import {
    createAnimation,
    IonAlert,
    IonButton,
    IonButtons,
    IonCardSubtitle,
    IonContent,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonInput,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonModal,
    IonPage,
    IonRadio,
    IonRadioGroup,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
// @ts-ignore
import unknownProfile from "../../images/profile.png"
import "../../style/subjectsPage.css"
import {enterAnimation, leaveAnimation} from "../../core/animations";

import {RouteComponentProps} from "react-router";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
import {addSharp, pencilSharp, searchCircle} from "ionicons/icons";
import Footer from "../../genericUser/components/Footer";
import {AdminContext} from "../provider/AdministratorProvider";
import {LoginContext} from "../../authentication/provider/AuthProvider";

const PAGE_SIZE = 10;
export const ManageSubjects: React.FC<RouteComponentProps> = () => {
    const [openAddModal, setOpenAddModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [newSubjectName, setNewSubjectName] = useState("")
    const [newSubjectType, setNewSubjectType] = useState(1)
    const [newSubjectCode, setNewSubjectCode] = useState('')
    const [toUpdateSubjectName, setToUpdateSubjectName] = useState("")
    const [toUpdateSubjectType, setToUpdateSubjectType] = useState(1)
    const [toUpdateSubjectCode, setToUpdateSubjectCode] = useState('')

    const {addNewSubject, subjects, searchSubjects,
        subjectAddError, updateSubject,
        subjectAddedSuccessfully,
        subjectUpdatedSuccessfully} = useContext(AdminContext);
    const {token} = useContext(LoginContext)
    const [generalSearchCriteria, setGeneralSearchCriteria] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    // const [filterValue, setFilterValue] = useState(0);


    let addSubject = () => {
        addNewSubject && addNewSubject({code: newSubjectCode, name: newSubjectName})
        setOpenAddModal(false)
        setCurrentPage(0)
        searchNextPage();
    }

    let update=()=>{
        updateSubject && updateSubject({code: toUpdateSubjectCode, name: toUpdateSubjectName})
        setOpenUpdateModal(false)
    }

    useEffect(() => {
        searchNextPage();
    }, [generalSearchCriteria])


    useEffect(() => {
            let canceled = false;
            searchNextPage && searchNextPage();
            return () => {
                canceled = true;
            }
        }, [token]
    )

    async function searchNextPage(event?: CustomEvent<void>) {
        console.log(generalSearchCriteria + " "+currentPage+ " "+PAGE_SIZE)
        searchSubjects && searchSubjects(generalSearchCriteria, currentPage, PAGE_SIZE)
        setCurrentPage(currentPage + 1)
        event && await (event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id={"pgContentSubjects"}>
                <IonItemDivider class={"mainTitle"}>
                    <IonTitle class={"mainTitle"}>MANAGE SUBJECTS</IonTitle>
                </IonItemDivider>

                {/*SUBJECTS LIST*/}
                <IonToolbar style={{"textAlign":"center"}}>
                    <IonSearchbar placeholder={"Search for subjects ..."}
                                  id={"searchbar"}
                                  animated={true}
                                  debounce={100}
                                  showClearButton="focus"
                                  onIonChange={(e) => {
                                      console.log(e.detail.value)
                                      setCurrentPage(0)
                                      if (e.detail.value) setGeneralSearchCriteria(e.detail.value)
                                      else setGeneralSearchCriteria('')
                                    }
                                  }
                    />
                    <IonButtons id={"ionButtons"}>
                        <IonButton onClick={() => setOpenAddModal(true)} id={"openAddModalBtn"}>
                            <IonIcon icon={addSharp}/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>

                {/*ADD MODAL*/}
                <IonModal id="addSubjectModal" isOpen={openAddModal} onDidDismiss={() => setOpenAddModal(false)}
                          enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                    <IonContent class={"subjectsModalContent"}>
                        <IonItem class={"subjectInput"}>
                            <IonLabel position={"floating"}>Code</IonLabel>
                            <IonInput type={"text"} placeholder={"Code"} onIonChange={(e) => {
                                setNewSubjectCode(e.detail.value ? e.detail.value : "")
                            }}/>
                        </IonItem>
                        <IonItem class={"subjectInput"}>
                            <IonLabel position={"floating"}>Name</IonLabel>
                            <IonInput type={"text"} placeholder={"Name"} onIonChange={(e) => {
                                setNewSubjectName(e.detail.value ? e.detail.value : "")
                            }}/>
                        </IonItem>
                        <IonButton id={"addSubjectBtn"} onClick={addSubject}>SAVE</IonButton>
                    </IonContent>
                </IonModal>

                {/*UPDATE MODAL*/}
                <IonModal id="addSubjectModal" isOpen={openUpdateModal} onDidDismiss={() => setOpenUpdateModal(false)}  enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                    <IonContent class={"subjectsModalContent"}>
                        <IonItem class={"subjectInput"}>
                            <IonLabel position={"floating"}>Code</IonLabel>
                            <IonInput type={"text"} placeholder={"Code"} value = {toUpdateSubjectCode} readonly/>
                        </IonItem>
                        <IonItem class={"subjectInput"}>
                            <IonLabel position={"floating"}>Name</IonLabel>
                            <IonInput type={"text"} placeholder={"Name"} value = {toUpdateSubjectName} onIonChange={(e) => {
                                setToUpdateSubjectName(e.detail.value ? e.detail.value : "")
                            }}/>
                        </IonItem>
                        <IonButton id={"addSubjectBtn"} onClick={update}>UPDATE</IonButton>
                    </IonContent>
                </IonModal>
                <IonList style={{"textAlign": "center"}}>
                    {subjects.length === 0 && <IonText id={"searchSubjectsTitle"}>No subjects found</IonText>}
                    {subjects && subjects.map(sub => {
                        return (<IonItem class={"searchedSubject"} key={sub.code}>
                            <IonIcon icon={pencilSharp} slot={"end"} className={"subjectEditIcon"}
                                     title={"Edit subject"}
                                     onClick={() => {
                                         setOpenUpdateModal(true)
                                         sub.code && setToUpdateSubjectCode(sub.code)
                                         sub.name && setToUpdateSubjectName(sub.name)
                                         sub.type && setToUpdateSubjectType(sub.type)
                                     }}/>
                            <div>
                                <IonCardSubtitle className = "subjectCode">{sub.code}</IonCardSubtitle>
                            </div>
                            <div className={"subjectName"}>
                                {sub.name}
                            </div>
                        </IonItem>)
                    })}

                </IonList>
                <IonInfiniteScroll
                    threshold="20px"
                    disabled={false}
                    onIonInfinite={(e) => {
                        searchNextPage(e);
                    }}>
                    <IonInfiniteScrollContent
                        loadingSpinner={"bubbles"}
                        loadingText="Loading subjects...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

                {subjectAddError && <IonAlert isOpen={true} message={subjectAddError.message}/>}
                <IonAlert isOpen={subjectAddedSuccessfully} message={"Subject added successfully!"}/>
                <IonAlert isOpen={subjectUpdatedSuccessfully} message={"Subject updated successfully!"}/>
            </IonContent>
            <Footer/>
        </IonPage>
    )
}

export default ManageSubjects;
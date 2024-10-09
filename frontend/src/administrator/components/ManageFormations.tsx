import React, {useContext, useEffect, useState} from "react";

import {
    IonAlert,
    IonButton, IonButtons, IonCardSubtitle, IonCardTitle,
    IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem,
    IonItemDivider,
    IonItemGroup,
    IonLabel, IonList, IonListHeader,
    IonModal,
    IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption,
    IonTitle,
} from "@ionic/react";
// @ts-ignore
import "../../style/formationsPage.css"
import {RouteComponentProps} from "react-router";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
import Footer from "../../genericUser/components/Footer";
import {AdminContext} from "../provider/AdministratorProvider";
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {medical} from "ionicons/icons";
import {addNewFormation} from "../api/AdministratorApi";

export const ManageFormations: React.FC<RouteComponentProps> = () => {
    const {
        formations, fetchFormations,
        years, groups,
        fetchYears, fetchGroups,
        groupsFetchedSuccessfully, yearsFetchedSuccessfully, formationsFetchedSuccessfully,
        addNewFormationError,
        addNewFormation
    } = useContext(AdminContext)
    const {token} = useContext(LoginContext)

    const [openYearModal, setOpenYearModal] = useState(false)
    const [openGroupsModal, setOpenGroupsModal] = useState(false)
    const [currentFormationsPage, setCurrentFormationsPage] = useState(0)

    const [newFormationsType, setNewFormationType] = useState(0)
    const [newFormationCode, setNewFormationCode] = useState('')
    const [newFormationMembers, setNewFormationMembers] = useState(0)
    const [newFormationGroup, setNewFormationGroup] = useState<string | null>(null)
    const [newFormationYear, setNewFormationYear] = useState<string | null>(null)

    const TYPES = ["-", "YEAR", "GROUP", "SUBGROUP"]

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
            fetchYears && fetchYears()

            // setCurrentFormationsPage(currentFormationsPage + 1)
            return () => {
                canceled = true;
            }
        }, [token]
    )
    useEffect(() => {
            let canceled = false;
            fetchGroups && fetchGroups()
            // setCurrentFormationsPage(currentFormationsPage + 1)
            return () => {
                canceled = true;
            }
        }, [token]
    )

    async function searchNextFormationsPage(event?: CustomEvent<void>) {
        fetchFormations && fetchFormations(0, currentFormationsPage, 10)
        setCurrentFormationsPage(currentFormationsPage + 1)

        event && await (event.target as HTMLIonInfiniteScrollElement).complete();
    }


    let addFormation = ()=>{
        let formation = {type: newFormationsType, code:newFormationCode,
                group:newFormationGroup, year:newFormationYear, members:newFormationMembers}
        addNewFormation && addNewFormation(formation)

        setNewFormationCode('')
        setNewFormationMembers(0)
        setNewFormationGroup('')
        setNewFormationYear('')
        setNewFormationType(1)
    };
    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id={"pageContentFormations"} scrollY={false}>
                <IonItemDivider>
                    <IonTitle className={"formationsTitle"}>MANAGE FORMATIONS</IonTitle>
                </IonItemDivider>
                <IonItemDivider className={"formationSectionTitle"}>
                    <IonCardTitle className={"formationSectionTitle"}>Type</IonCardTitle>
                    <IonSelect placeholder={"Formation type"} interface={"popover"} class={"formationInput"}
                               onIonChange={(e) => setNewFormationType(e.detail.value)}
                               value={newFormationsType}
                    >
                        <IonSelectOption value={1}>Year</IonSelectOption>
                        <IonSelectOption value={2}>Group</IonSelectOption>
                        <IonSelectOption value={3}>Semigroup</IonSelectOption>
                    </IonSelect>
                </IonItemDivider>

                <IonItemDivider className={"formationSectionTitle"}>
                    <IonCardTitle className={"formationSectionTitle"}>Code</IonCardTitle>
                    <IonInput class={"formationInput"} style={{"marginRight": "11%"}}
                              onIonChange={(e)=>setNewFormationCode(e.detail.value||'')}
                              value={newFormationCode}
                    />
                </IonItemDivider>

                <IonItemDivider className={"formationSectionTitle"}>
                    <IonCardTitle className={"formationSectionTitle"}>Members</IonCardTitle>
                    <IonInput type={"number"} inputMode={"search"} min={10} max={300}
                              class={"formationInput"} style={{"marginRight": "10%"}}
                              onIonChange={(e)=>setNewFormationMembers(parseInt(e.detail.value||'0'))}
                              value={newFormationMembers}
                    />
                </IonItemDivider>

                <IonItemDivider className={"formationSectionTitle"}>
                    <IonCardTitle className={"yearsAndGroupsLabel"}>Year</IonCardTitle>
                    <IonButton className="yearsAndGroupsBtn" onClick={() => setOpenYearModal(true)}
                               disabled={newFormationsType <= 1}>
                        Select year</IonButton>
                    <IonModal isOpen={openYearModal} onDidDismiss={() => setOpenYearModal(false)}>
                        <IonContent>
                            <IonRadioGroup onIonChange={(e) => setNewFormationYear(e.detail.value)}>
                                {years && years
                                    .map(f => {
                                        return <IonItem key={f.code + "_years"}>{f.code}
                                            <IonRadio value={f.code} slot={"end"}/></IonItem>
                                    })}
                            </IonRadioGroup>
                        </IonContent>
                    </IonModal>
                </IonItemDivider>

                <IonItemDivider className={"formationSectionTitle"}>
                    <IonCardTitle className={"yearsAndGroupsLabel"}>Group</IonCardTitle>
                    <IonButton className="yearsAndGroupsBtn" onClick={() => setOpenGroupsModal(true)}
                               disabled={newFormationsType <= 2}>
                        Select group
                    </IonButton>
                    <IonModal isOpen={openGroupsModal} onDidDismiss={() => setOpenGroupsModal(false)}>
                        <IonContent>
                            <IonRadioGroup onIonChange={(e) => setNewFormationGroup(e.detail.value)}>
                                {groups && groups
                                    .map(f => {
                                        return <IonItem key={f.code + "_groups"}>{f.code}
                                            <IonRadio value={f.code} slot={"end"}/></IonItem>
                                    })}
                            </IonRadioGroup>
                        </IonContent>
                    </IonModal>
                </IonItemDivider>
                <IonButtons id={"ionButtons"}>
                    <IonButton id={"addFormationBtn"} onClick={addFormation}>ADD FORMATION</IonButton>
                </IonButtons>


                <IonCardTitle id={"formationListSectionTitle"}>Formations List</IonCardTitle>
                <div id={"div"}>
                    <IonContent id={"formationsLst"}>
                        {formations && formations.map(f => {
                            return <IonItem key={f.code}>
                                <IonCardTitle class={"formationCode"}>{f.code}</IonCardTitle>
                                <IonCardSubtitle class={"formationInfo"}>Type: {TYPES[f.type || 0]}, Members
                                    No.: {f.members}, Year: {f.year || '-'}, Group: {f.group || '-'}</IonCardSubtitle>
                            </IonItem>
                        })}
                        <IonInfiniteScroll
                            // style={{"width": "100%", "height": "100vh"}}
                            threshold="100%"
                            disabled={false}
                            onIonInfinite={(e) => {
                                searchNextFormationsPage(e);
                            }}>
                            <IonInfiniteScrollContent
                                loadingSpinner={"bubbles"}
                                loadingText="Loading subjects...">
                            </IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                    </IonContent>
                </div>
                {/*</IonItemDivider>*/}
                {addNewFormationError && <IonAlert isOpen={true} message={addNewFormationError.message}/>}
            </IonContent>
            <Footer/>

        </IonPage>
    )
}

export default ManageFormations;
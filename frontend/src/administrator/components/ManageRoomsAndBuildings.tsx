import React, {useContext, useEffect, useRef, useState} from "react";

import {
    IonAlert,
    IonButton,
    IonButtons,
    IonCardSubtitle, IonCardTitle, IonCol,
    IonContent, IonGrid,
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
    IonRadioGroup, IonRow,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonText, IonTextarea,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
// @ts-ignore
import unknownProfile from "../../images/profile.png"
import "../../style/roomsPage.css"

import {RouteComponentProps} from "react-router";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
import {addSharp, build, medical, pencilSharp, trashBin} from "ionicons/icons";
import Footer from "../../genericUser/components/Footer";
import {AdminContext} from "../provider/AdministratorProvider";
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {enterAnimation, leaveAnimation} from "../../core/animations";

export const ManageRoomsAndBuildings: React.FC<RouteComponentProps> = () => {
    const [openAddBuildingModal, setOpenAddBuildingModal] = useState(false)
    const [openAddRoomModal, setOpenAddRoomModal] = useState(false)
    const [newBuildingAddress, setNewBuildingAddress] = useState("")
    const [newBuildingName, setNewBuildingName] = useState('')
    const [selectedBuildingId, setSelectedBuildingIdId] = useState('')
    const [selectedBuildingName, setSelectedBuildingName] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const [roomCapacity, setRoomCapacity] = useState(0)
    const [roomBoards, setRoomBoards] = useState<string[]>([])
    const [roomDevices, setRoomDevices] = useState<string[]>([])
    const [roomProjector, setRoomProjector] = useState<number>(-1)
    const [roomDescription, setRoomDescription] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const {
        addNewRoom, fetchRooms,
        addNewBuilding, fetchBuildings,
        buildings, rooms, buildingsFetchedSuccessfully
    } = useContext(AdminContext);
    const {token} = useContext(LoginContext)


    let addBuilding = () => {
        if (newBuildingName=='' || newBuildingAddress=='') {
            setShowAlert(true)
            setAlertMessage("Complete all the mandatory fields!")
        } else {
            addNewBuilding && addNewBuilding({id: undefined, name: newBuildingName, address: newBuildingAddress})
            setOpenAddBuildingModal(false)
        }
    }

    let addRoom = () => {
        if (roomCode === "" || roomCapacity === 0 || roomProjector === -1) {
            setShowAlert(true)
            setAlertMessage("Complete all the mandatory fields!")
        } else {
            addNewRoom && addNewRoom({
                id: undefined, buildingId: selectedBuildingId, code: roomCode,
                description: roomDescription, boards: roomBoards, capacity: roomCapacity, devices: roomDevices,
                projector: roomProjector
            })
            setOpenAddRoomModal(false)

            setRoomCode('')
            setRoomCapacity(0)
            setRoomBoards([])
            setRoomDevices([])
            setRoomProjector(-1)
            setRoomDescription("")
        }
    }

    useEffect(() => {
            let canceled = false;
            fetchBuildings && fetchBuildings();

            return () => {
                canceled = true;
            }
        }, [token]
    )


    useEffect(() => {
            fetchRooms && fetchRooms(selectedBuildingId);
        }, [selectedBuildingId]
    )

    useEffect(() => {
        buildings && buildings.length > 0 && setSelectedBuildingIdId(buildings[0].id || '')
        buildings && buildings.length > 0 && setSelectedBuildingName(buildings[0].name || '')

    }, [token, buildingsFetchedSuccessfully])


    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id={"pageContentRooms"}>
                <IonItemDivider class={"mainTitleRooms"}>
                    <IonTitle class={"mainTitleRooms"}>MANAGE ROOMS & BUILDINGS</IonTitle>
                </IonItemDivider>


                {/*BUILDINGS LIST*/}
                <IonToolbar class={"toolbarBuildings"}>
                    <IonCardTitle class={"categTitle"}>Buildings</IonCardTitle>

                    {/*<IonButtons class={"openAddModalBtn"} >*/}
                    <IonButton onClick={() => setOpenAddBuildingModal(true)} class={"openAddModalBtn"} fill={"outline"}>
                        ADD BUILDING <IonIcon icon={addSharp} style={{"margin-left": "1%"}}/>
                    </IonButton>
                    {/*</IonButtons>*/}
                </IonToolbar>

                <IonSelect placeholder={"Select a building"}
                           onIonChange={(e) => {
                               setSelectedBuildingIdId(e.detail.value.split(";")[0]);
                               setSelectedBuildingName(e.detail.value.split(";")[1])
                           }}
                           id={"buildingsSelect"}
                           interface={"action-sheet"}
                           cancelText={"CANCEL"} selectedText={selectedBuildingName}>
                    {buildings && buildings.map(b => {
                        return (<IonSelectOption class={"searchedSubject"} key={b.id} value={b.id+";"+b.name}>
                            <IonCardTitle>{b.name}</IonCardTitle>
                        </IonSelectOption>)
                    })
                    }
                </IonSelect>

                {/*ROOMS LIST*/}

                <IonToolbar class={"toolbarBuildings"}>
                    <IonCardTitle class={"categTitle"}>Rooms</IonCardTitle>

                    <IonButton onClick={() => setOpenAddRoomModal(true)} class={"openAddModalBtn"} fill={"outline"}>
                        ADD ROOM <IonIcon icon={addSharp} style={{"margin-left": "1%"}}/>
                    </IonButton>
                </IonToolbar>
                <div id={"roomsList"}><IonContent>
                    {rooms && rooms.map(r => {
                        return (<IonItem class={"searchedRoom"} key={r.id}>
                            <IonCardTitle class={"roomCode"}>{r.code}</IonCardTitle>
                            <IonCardSubtitle>{r.description}</IonCardSubtitle>
                        </IonItem>)
                    })
                    }
                </IonContent></div>
            </IonContent>


            {/*ADD Building MODAL*/}
            <IonModal id="addSubjectModal" isOpen={openAddBuildingModal}
                      onDidDismiss={() => setOpenAddBuildingModal(false)} enterAnimation={enterAnimation}
                      leaveAnimation={leaveAnimation}>
                <IonContent>
                    <IonItem class={"subjectInput"}>
                        <IonLabel position={"floating"}>Code
                            <IonIcon color={"danger"} icon={medical}/></IonLabel>
                        <IonInput type={"text"} placeholder={"Building name"} onIonChange={(e) => {
                            setNewBuildingName(e.detail.value ? e.detail.value : "")
                        }}/>
                    </IonItem>
                    <IonItem class={"subjectInput"}>
                        <IonLabel position={"floating"}>Address <IonIcon color={"danger"} icon={medical}/></IonLabel>
                        <IonInput type={"text"} placeholder={"Address"} onIonChange={(e) => {
                            setNewBuildingAddress(e.detail.value ? e.detail.value : "")
                        }}/>
                    </IonItem>
                    <IonButton id={"addSubjectBtn"} onClick={addBuilding}>SAVE</IonButton>
                </IonContent>
            </IonModal>

            {/*ADD ROOM MODAL*/}
            <IonModal id="addRoomModal" isOpen={openAddRoomModal}
                      onDidDismiss={() => {
                          setOpenAddRoomModal(false);
                      }}
                      enterAnimation={enterAnimation}
                      leaveAnimation={leaveAnimation}>
                <IonContent id={"roomModalContent"}>
                    <IonItem class={"roomInput"}>
                        <IonLabel position={"floating"}>Building</IonLabel>
                        <IonInput readonly type={"text"} placeholder={"Building name"}
                                  value={selectedBuildingName} key={selectedBuildingId}>
                        </IonInput>

                    </IonItem>
                    <IonItem class={"roomInput"}>
                        <IonLabel position={"floating"}>Room Code
                            <IonIcon color={"danger"} icon={medical}/></IonLabel>
                        <IonInput type={"text"} placeholder={"Building name"}
                                  value={roomCode}
                                  onIonChange={(e) => setRoomCode(e.detail.value || '')}>
                        </IonInput>

                    </IonItem>
                    <IonItem class={"roomInput"}>
                        <IonLabel position={"floating"}>Capacity
                            <IonIcon color={"danger"} icon={medical}/></IonLabel>
                        <IonInput min={10} max={300} type={"number"}
                                  placeholder={"No. of students that fit in"}
                                  inputMode={"search"} value={roomCapacity}
                                  onIonChange={(e) => setRoomCapacity(parseInt(e.detail.value || '0'))}/>
                    </IonItem>

                    <IonItem class={"roomInput"}>
                        <IonLabel position={"floating"}>Boards</IonLabel>
                        <IonSelect interface={"popover"} multiple={true}
                                   onIonChange={(e) => setRoomBoards(e.detail.value)}>
                            <IonSelectOption value={"Magnetic"}>MAGNETIC</IonSelectOption>
                            <IonSelectOption value={"Interactive"}>INTERACTIVE</IonSelectOption>
                            <IonSelectOption value={"Blackboard"}>BLACKBOARD</IonSelectOption>
                            <IonSelectOption value={"Smart"}>SMART</IonSelectOption>
                            <IonSelectOption value={"None"}>NONE</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem class={"roomInput"}>
                        <IonLabel position={"floating"}>Devices </IonLabel>
                        <IonSelect interface={"popover"} multiple={true}
                                   onIonChange={(e) => setRoomDevices(e.detail.value)}>
                            <IonSelectOption value={"Laptops"}>Laptops</IonSelectOption>
                            <IonSelectOption value={"Computers"}>Computers</IonSelectOption>
                            <IonSelectOption value={"VR"}>VR</IonSelectOption>
                            <IonSelectOption value={"Desktops"}>Desktops</IonSelectOption>
                            <IonSelectOption value={"None"}>None</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem class={"roomInput"}>
                        <IonLabel id={"projectorLabel"} >Projector <IonIcon color={"danger"} icon={medical}/></IonLabel>
                        <IonRadioGroup id={"radioGroup"} onIonChange={(e) => setRoomProjector(e.detail.value)}>
                            <IonItem class="radioInput"><IonLabel>YES</IonLabel><IonRadio
                                value={1}/></IonItem>
                            <IonItem class="radioInput" lines={"none"}> <IonLabel>NO</IonLabel><IonRadio
                                value={0}/></IonItem>
                        </IonRadioGroup>
                    </IonItem>
                    <IonItem class={"roomInput"}>
                        <IonLabel id={"projectorLabel"} position={"floating"}>Description</IonLabel>
                        <IonTextarea id={"textareaDescription"}
                                     onIonChange={(e) => setRoomDescription(e.detail.value || '')}>
                        </IonTextarea>
                    </IonItem>
                    <IonItem class={"roomInput"} lines={"none"}>
                        <IonButton id={"addRoomBtn"} onClick={addRoom}>SAVE</IonButton>
                    </IonItem>
                </IonContent>
            </IonModal>
            <IonAlert message={alertMessage} isOpen={showAlert} onDidDismiss={()=>setShowAlert(false)}></IonAlert>
            <Footer/>
        </IonPage>
    )
}

export default ManageRoomsAndBuildings;
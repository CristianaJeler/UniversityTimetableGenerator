import React, {useContext, useEffect, useState} from "react";

import {
    IonButton,
    IonCard,
    IonCardSubtitle,
    IonCardTitle,
    IonCheckbox,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonInfiniteScroll,
    IonInput,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonPage, IonPopover,
    IonRow,
    IonSelect,
    IonSelectOption, IonText,
    IonTitle,
} from "@ionic/react";
// @ts-ignore
import unknownProfile from "../../images/profile.png"
import "../../style/preferences.css"

import {RouteComponentProps} from "react-router";
import {HeaderLoggedUser} from "../../genericUser/components/HeaderLoggedUser";
import {addSharp} from "ionicons/icons";
import {AdminContext} from "../../administrator/provider/AdministratorProvider";
import Footer from "../../genericUser/components/Footer";
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {TimePreferencesProps, RoomsPreferencesProps, TeacherContext} from "../provider/TeacherProvider";
import {queries} from "@testing-library/react";


let daysInitialState = [
    {id: {teacherId: "", dayId: 1}, maxHoursPerDay: 0, availableAllDay: 0, timeIntervals: []},
    {id: {teacherId: "", dayId: 2}, maxHoursPerDay: 0, availableAllDay: 0, timeIntervals: []},
    {id: {teacherId: "", dayId: 3}, maxHoursPerDay: 0, availableAllDay: 0, timeIntervals: []},
    {id: {teacherId: "", dayId: 4}, maxHoursPerDay: 0, availableAllDay: 0, timeIntervals: []},
    {id: {teacherId: "", dayId: 5}, maxHoursPerDay: 0, availableAllDay: 0, timeIntervals: []},
]

let boards = [
    {key: "BLACKBOARD", requestMapping: "Blackboard", value: false},
    {key: "MAGNETIC BOARD", requestMapping: "Magnetic", value: false},
    {key: "INTERACTIVE BOARD", requestMapping: "Interactive", value: false},
]

let assets = [{key: "COMPUTERS", requestMapping: "Computers", value: false},
    {key: "VR HEADSETS", requestMapping: "VR", value: false}]

let projector = {key: "PROJECTOR", value: false}
export const PreferencesComponent: React.FC<RouteComponentProps> = () => {
    const [newTimeIntervalPrefs, setNewTimeIntervalPrefs] = useState<TimePreferencesProps[]>([])
    const [newRoomsPrefs, setNewRoomsPrefs] = useState<RoomsPreferencesProps[]>([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedClassType, setSelectedClassType] = useState(0)
    const [selectedBuilding, setSelectedBuilding] = useState("")
    const [currentClassPrefs, setCurrentClassPrefs] = useState<RoomsPreferencesProps>({
        preferredDevices: [],
        preferredBoards: [],
        preferredRooms: [],
        id: {
            teacherId: "",
            classId: ""
        },
        wantsProjector: 0,
        preferredBuildings: []
    })
    const {token, username} = useContext(LoginContext)
    const {
        buildings,
        rooms,
        fetchBuildings,
        fetchRooms,
    } = useContext(AdminContext);

    const {
        getClassesByTeacher,
        teachersClasses, getClassesByTeacherSucceeded,
        subjects,
        teachersRoomsPreferences,
        teachersTimePreferences,
        getTeachersRoomsPreferences,
        getTeachersTimePreferences,
        savePreferences,
        gotTimePreferencesSuccessfully
    } = useContext(TeacherContext)

    const clsTypes = ["", "LECTURE", "SEMINAR", "LABORATORY"]
    const Days = ["", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]

    let [selectClassTypeOptions, setSelectClassTypesOptions] = useState<number[]>([])

    let updateDays = (day: TimePreferencesProps) => {
        let allDays = [...newTimeIntervalPrefs];
        let dayExists = allDays.find(d=>d.id.dayId === day.id.dayId)
        if(dayExists) {
            let idx= allDays.findIndex(d=>d.id.dayId===day.id.dayId)
            allDays[idx] = day
        }else{
            allDays.push(day)
        }
        setNewTimeIntervalPrefs(allDays)
    }

    let updateRoomPrefs = (roomPref: RoomsPreferencesProps, idx: number) => {
        let allPrefs = [...newRoomsPrefs];
        allPrefs[idx] = roomPref
        setNewRoomsPrefs(allPrefs)
    }

    useEffect(() => {
        fetchBuildings && fetchBuildings()
        getClassesByTeacher && getClassesByTeacher()
        getTeachersRoomsPreferences && getTeachersRoomsPreferences()
        getTeachersTimePreferences && getTeachersTimePreferences()
    }, [token])



    useEffect(() => {
        if (selectedClassType !== 0) {
            let clsId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
            let prefs = newRoomsPrefs.find(p => p.id.classId === clsId)
            if (prefs === undefined) prefs = teachersRoomsPreferences.find(p => p.id.classId === clsId)
            if (prefs) {
                setCurrentClassPrefs(prefs)
            } else {
                setCurrentClassPrefs({
                    preferredDevices: [],
                    preferredBoards: [],
                    preferredRooms: [],
                    id: {
                        teacherId: token,
                        classId: clsId || ""
                    },
                    wantsProjector: 0,
                    preferredBuildings: []
                })
            }
        }

        setClassTypesOfSubject(selectedSubject);
    }, [selectedSubject])

    useEffect(() => {
        if (selectedSubject !== '') {
            let clsId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
            let prefs = newRoomsPrefs.find(p => p.id.classId === clsId)
            if (!prefs) prefs = teachersRoomsPreferences.find(p => p.id.classId === clsId)
            console.log("PREF=" + JSON.stringify(teachersRoomsPreferences))

            if (prefs) {
                setCurrentClassPrefs(prefs)
            } else {
                setCurrentClassPrefs({
                    preferredDevices: [],
                    preferredBoards: [],
                    preferredRooms: [],
                    id: {
                        teacherId: token,
                        classId: clsId || ""
                    },
                    wantsProjector: 0,
                    preferredBuildings: []
                })
            }
        }
    }, [selectedClassType])


    function getRooms(building: string) {
        fetchRooms && fetchRooms(building)
    }

    function setClassTypesOfSubject(subject: string) {
        let classTypes: number[] = []
        for (let cls of teachersClasses) {
            if (cls.subjectName === subject && cls.classType && !classTypes.includes(cls.classType)) {
                classTypes.push(cls.classType)
            }
        }

        setSelectClassTypesOptions(classTypes)
    }

    function intervalFrom(interval: number) {
        switch (interval) {
            case 1:
                return "08";
            case 2:
                return "10";
            case 3:
                return "12";
            case 4:
                return "14";
            case 5:
                return "16";
            case 6:
                return "18";
            default:
                return "";
        }
    }

    function intervalTo(interval: number) {
        switch (interval) {
            case 1:
                return "10";
            case 2:
                return "12";
            case 3:
                return "14";
            case 4:
                return "16";
            case 5:
                return "18";
            case 6:
                return "20";
            default:
                return "";
        }
    }

    function addPreferredRoom(room: string) {
        let classId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
        if (classId) {
            let preference = newRoomsPrefs.find(pref => pref.id.classId === classId)
            if (!preference) {
                preference = teachersRoomsPreferences.find(pref => pref.id.classId === classId)
                if (preference)
                    newRoomsPrefs.push(preference)
            }
            if (!preference) {
                preference = {
                    id: {
                        classId,
                        teacherId: token
                    },
                    preferredRooms: [room],
                    preferredBoards: [],
                    preferredBuildings: [],
                    preferredDevices: [],
                    wantsProjector: 0
                }
                newRoomsPrefs.push(preference)
            } else {
                let idPref = newRoomsPrefs.indexOf(preference);

                if (!preference.preferredRooms.includes(room)) preference.preferredRooms.push(room)
                updateRoomPrefs(preference, idPref)
            }
            setCurrentClassPrefs(preference)

        }
    }

    function removePreferredRoom(room: string) {
        let classId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
        if (classId) {
            let preference = newRoomsPrefs.find(pref => pref.id.classId === classId)
            if (!preference) {
                preference = teachersRoomsPreferences.find(pref => pref.id.classId === classId)
                if (preference)
                    newRoomsPrefs.push(preference)
            }
            if (preference) {
                let idPref = newRoomsPrefs.indexOf(preference);
                preference.preferredRooms.splice(preference.preferredRooms.indexOf(room), 1)
                updateRoomPrefs(preference, idPref)
                setCurrentClassPrefs(preference)

            }
        }
    }


    function addBoard(board: string) {
        let classId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
        if (classId) {
            let preference = newRoomsPrefs.find(pref => pref.id.classId === classId)
            if (!preference) {
                preference = teachersRoomsPreferences.find(pref => pref.id.classId === classId)
                if (preference)
                    newRoomsPrefs.push(preference)
            }
            if (!preference) {
                preference = {
                    id: {
                        classId,
                        teacherId: token
                    },
                    preferredRooms: [],
                    preferredBoards: [board],
                    preferredBuildings: [],
                    preferredDevices: [],
                    wantsProjector: 0
                }
                newRoomsPrefs.push(preference)
            } else {
                let idPref = newRoomsPrefs.indexOf(preference);

                if (!preference.preferredBoards.includes(board)) preference.preferredBoards.push(board)
                updateRoomPrefs(preference, idPref)
            }
            setCurrentClassPrefs(preference)

        }
    }

    function removeBoard(board: string) {
        let classId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
        if (classId) {
            let preference = newRoomsPrefs.find(pref => pref.id.classId === classId)
            if (!preference) {
                preference = teachersRoomsPreferences.find(pref => pref.id.classId === classId)
                if (preference)
                    newRoomsPrefs.push(preference)
            }
            if (preference) {
                let idPref = newRoomsPrefs.indexOf(preference);

                preference.preferredBoards.splice(preference.preferredBoards.indexOf(board), 1)
                updateRoomPrefs(preference, idPref)
                setCurrentClassPrefs(preference)

            }
        }
    }

    function addDevice(device: string) {
        let classId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
        if (classId) {
            let preference = newRoomsPrefs.find(pref => pref.id.classId === classId)
            if (!preference) {
                preference = teachersRoomsPreferences.find(pref => pref.id.classId === classId)
                if (preference)
                    newRoomsPrefs.push(preference)
            }
            if (!preference) {
                preference = {
                    id: {
                        classId,
                        teacherId: token
                    },
                    preferredRooms: [],
                    preferredBoards: [],
                    preferredBuildings: [],
                    preferredDevices: [device],
                    wantsProjector: 0
                }
                newRoomsPrefs.push(preference)
            } else {
                let idPref = newRoomsPrefs.indexOf(preference);

                if (!preference.preferredDevices.includes(device)) preference.preferredDevices.push(device)
                updateRoomPrefs(preference, idPref)
            }
            setCurrentClassPrefs(preference)

        }
    }

    function removeDevice(device: string) {
        let classId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
        if (classId) {
            let preference = newRoomsPrefs.find(pref => pref.id.classId === classId)
            if (!preference) {
                preference = teachersRoomsPreferences.find(pref => pref.id.classId === classId)
                if (preference)
                    newRoomsPrefs.push(preference)
            }
            if (preference) {
                let idPref = newRoomsPrefs.indexOf(preference);

                preference.preferredDevices.splice(preference.preferredDevices.indexOf(device), 1)
                updateRoomPrefs(preference, idPref)
                setCurrentClassPrefs(preference)
            }
        }
    }

    function setWantsProjector(set: boolean) {
        let classId = teachersClasses.find(c => c.classType === selectedClassType && c.subjectName === selectedSubject)?.classId
        if (classId) {
            let preference = newRoomsPrefs.find(pref => pref.id.classId === classId)
            if (!preference) {
                preference = teachersRoomsPreferences.find(pref => pref.id.classId === classId)
                if (preference)
                    newRoomsPrefs.push(preference)
            }
            if (!preference) {
                preference = {
                    id: {
                        classId,
                        teacherId: token
                    },
                    preferredRooms: [],
                    preferredBoards: [],
                    preferredBuildings: [],
                    preferredDevices: [],
                    wantsProjector: set ? 1 : 0
                }
                newRoomsPrefs.push(preference)
            } else {
                let idPref = newRoomsPrefs.indexOf(preference);

                preference.wantsProjector = set ? 1 : 0;
                updateRoomPrefs(preference, idPref)
            }
            setCurrentClassPrefs(preference)

        }
    }

    function submitPrefs() {
        let allRoomPrefs = [...newRoomsPrefs]
        let allTimeIntervalPrefs = [...newTimeIntervalPrefs]

        setCurrentClassPrefs({
            preferredDevices: [],
            preferredBoards: [],
            preferredRooms: [],
            id: {
                teacherId: token,
                classId: ""
            },
            wantsProjector: 0,
            preferredBuildings: []
        })

        setSelectedSubject("")
        setSelectedClassType(0)
        setNewRoomsPrefs([])
        setSelectedBuilding("")


        for (let pref of allRoomPrefs) pref.id.teacherId = token
        for (let pref of allTimeIntervalPrefs) pref.id.teacherId = token
        savePreferences && savePreferences(allRoomPrefs, allTimeIntervalPrefs)
    }

    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent id={"pageContent"}>
                <IonItemDivider class={"mainTitle"}>
                    <IonTitle class={"mainTitle"}>AVAILABILITY</IonTitle>
                </IonItemDivider>
                <IonGrid class="grid">
                    <IonRow>
                        {teachersTimePreferences && teachersTimePreferences.map((day) => {
                            return <IonCard key={day.id.dayId} class="availabilityCard">
                                <IonCardTitle class="cardTitle">{Days[day.id.dayId]}</IonCardTitle>
                                <IonCardSubtitle class={"cardSubtitle"}>Availability time intervals</IonCardSubtitle>
                                <IonLabel position="fixed">Available all day </IonLabel>
                                <IonCheckbox value={day.availableAllDay} checked={day.availableAllDay == 1}
                                             class={"intervalsCheckbox"}
                                             onIonChange={(e) => {
                                                 day.availableAllDay = e.target.checked ? 1 : 0;
                                                 day.timeIntervals.splice(0, day.timeIntervals.length)
                                                 updateDays(day)
                                             }}></IonCheckbox>
                                <br/>
                                <IonButton disabled={day.availableAllDay == 1} class={"addIntervalBtn"}
                                           id={day.id.dayId + "click-trigger"}>Add time interval <IonIcon
                                    icon={addSharp}/></IonButton>
                                <IonPopover trigger={day.id.dayId + "click-trigger"} triggerAction="click">
                                    <IonContent class="ion-padding">
                                        <IonItem>08:00-10:00
                                            <IonCheckbox checked={day.timeIntervals.includes(1)} value={1}
                                                         class={"intervalsCheckbox"}
                                                         onIonChange={(e) => {
                                                             if (e.target.checked) {
                                                                 day.timeIntervals.push(1)
                                                             } else {
                                                                 day.timeIntervals.splice(day.timeIntervals.indexOf(1), 1)
                                                             }
                                                             updateDays(day)
                                                         }}/>
                                        </IonItem>
                                        <IonItem>10:00-12:00 <IonCheckbox checked={day.timeIntervals.includes(2)}
                                                                          class={"intervalsCheckbox"}
                                                                          value={2}
                                                                          onIonChange={(e) => {
                                                                              if (e.target.checked) {
                                                                                  day.timeIntervals.push(2)
                                                                              } else {
                                                                                  day.timeIntervals.splice(day.timeIntervals.indexOf(2), 1)
                                                                              }
                                                                              updateDays(day)
                                                                          }}/></IonItem>
                                        <IonItem>12:00-14:00 <IonCheckbox checked={day.timeIntervals.includes(3)}
                                                                          class={"intervalsCheckbox"}
                                                                          value={3}
                                                                          onIonChange={(e) => {
                                                                              if (e.target.checked) {
                                                                                  day.timeIntervals.push(3)
                                                                              } else {
                                                                                  day.timeIntervals.splice(day.timeIntervals.indexOf(3), 1)
                                                                              }
                                                                              updateDays(day)
                                                                          }}/></IonItem>
                                        <IonItem>14:00-16:00 <IonCheckbox checked={day.timeIntervals.includes(4)}
                                                                          class={"intervalsCheckbox"}
                                                                          value={4}
                                                                          onIonChange={(e) => {
                                                                              if (e.target.checked) {
                                                                                  day.timeIntervals.push(4)
                                                                              } else {
                                                                                  day.timeIntervals.splice(day.timeIntervals.indexOf(4), 1)
                                                                              }
                                                                              updateDays(day)
                                                                          }}/></IonItem>
                                        <IonItem>16:00-18:00 <IonCheckbox checked={day.timeIntervals.includes(5)}
                                                                          class={"intervalsCheckbox"}
                                                                          value={5}
                                                                          onIonChange={(e) => {
                                                                              if (e.target.checked) {
                                                                                  day.timeIntervals.push(5)
                                                                              } else {
                                                                                  day.timeIntervals.splice(day.timeIntervals.indexOf(5), 1)
                                                                              }
                                                                              updateDays(day)
                                                                          }}/></IonItem>
                                        <IonItem>18:00-20:00 <IonCheckbox checked={day.timeIntervals.includes(6)}
                                                                          class={"intervalsCheckbox"}
                                                                          value={6}
                                                                          onIonChange={(e) => {
                                                                              if (e.target.checked) {
                                                                                  day.timeIntervals.push(6)
                                                                              } else {
                                                                                  day.timeIntervals.splice(day.timeIntervals.indexOf(6), 1)
                                                                              }
                                                                              updateDays(day)
                                                                          }}/></IonItem>
                                    </IonContent>
                                </IonPopover>
                                <br/>
                                <IonGrid class="grid">
                                    <IonRow>
                                        <IonCol>
                                            <IonLabel>From</IonLabel>
                                        </IonCol>
                                        <IonCol>
                                            <IonLabel>To</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                    <IonContent style={{"height": "100px"}}>
                                        {day.timeIntervals.sort().map((interval, idx) => {
                                            return <IonRow key={day.id.dayId + idx}>
                                                <IonCol>
                                                    <IonInput readonly
                                                              value={intervalFrom(interval)}
                                                    />
                                                </IonCol>
                                                <IonCol>
                                                    <IonInput readonly
                                                              value={intervalTo(interval)}/>
                                                </IonCol>
                                            </IonRow>;
                                        })
                                        }
                                    </IonContent>
                                </IonGrid>
                            </IonCard>
                        })}
                    </IonRow>
                </IonGrid>
                <IonItemDivider>
                    <IonTitle class={"mainTitle"}>ROOMS PREFERENCES</IonTitle>
                </IonItemDivider>
                <IonGrid class={"grid"}>
                    <IonRow>
                        <IonCol>
                            <IonSelect interface="popover" placeholder={"Subject"} class={"select"}
                                       value={selectedSubject}
                                       onIonChange={(e) => {
                                           setClassTypesOfSubject(e.detail.value);
                                           setSelectedSubject(e.detail.value)
                                           setSelectedBuilding("")
                                           // resetRoomItems()
                                       }
                                       }>
                                {subjects && subjects.map(s =>
                                    <IonSelectOption key={s} class={"selectOtpion"} value={s}>
                                        {s}
                                    </IonSelectOption>)}

                            </IonSelect>
                        </IonCol>
                        <IonCol>
                            <IonSelect interface="popover" placeholder={"Type of class"} class={"select"}
                                       value={selectedClassType}
                                       onIonChange={(e) => {
                                           setSelectedBuilding("")
                                           setSelectedClassType(parseInt(e.detail.value))
                                           // resetRoomItems()
                                       }}>
                                {selectClassTypeOptions.map(t =>
                                    <IonSelectOption key={t} value={t}>{clsTypes[t]}</IonSelectOption>)}
                            </IonSelect>
                        </IonCol>
                    </IonRow>
                    <IonItemDivider class={"secondaryTitle"}>
                        <IonTitle style={{"font-weight": "bold"}}>Preferred Rooms</IonTitle>
                    </IonItemDivider>
                    <IonRow id={"preferredRoomsList"}>
                        <IonCol style={{"maxWidth": "20%"}}>
                            <IonSelect placeholder={"Building"} interface={"popover"} class={"select"}
                                       value={selectedBuilding}
                                       onIonChange={(e) => {
                                           setSelectedBuilding(e.detail.value);
                                           getRooms(e.detail.value)
                                       }}>
                                {buildings && buildings.map(b => {
                                    return <IonSelectOption key={b.id} value={b.id}>{b.name}</IonSelectOption>
                                })}
                            </IonSelect>
                        </IonCol>
                        <IonCol>
                            <IonContent style={{"border": "solid grey 1px"}}>
                                {rooms && rooms.map(r => {
                                    return <IonItem style={{"width": "100%"}}>
                                        {/*<IonGrid>*/}
                                        <IonRow style={{"width": "100%"}}>
                                            <IonCol style={{"max-width": "10%"}}>
                                                <IonCheckbox class={"roomsCheckboxes"}
                                                             onClick={(e) => {
                                                                 if (e.currentTarget.checked) {
                                                                     addPreferredRoom(e.currentTarget.value)
                                                                 } else {
                                                                     removePreferredRoom(e.currentTarget.value)
                                                                 }
                                                             }}
                                                             value={r.code}
                                                             checked={currentClassPrefs.preferredRooms.includes(r.code || "")}
                                                />
                                            </IonCol>
                                            <IonCol style={{"max-width": "20%"}}>
                                                <h4 className={"roomsTitles"}>
                                                    {r.code}
                                                </h4>
                                            </IonCol>
                                            <IonCol style={{"max-width": "30%"}}>
                                                <IonRow><IonCardSubtitle>Projector: {r.projector === 1 ? "YES" : "NO"}</IonCardSubtitle></IonRow>
                                                <IonRow><IonCardSubtitle>Devices: {r.devices?.map((d, idx)=>{
                                                    if(r.devices!== undefined && r.devices.length-1>idx)
                                                        return d +","
                                                    return d
                                                })}</IonCardSubtitle></IonRow>
                                                <IonRow><IonCardSubtitle>Boards: {r.boards?.map((b, idx)=>{
                                                    if(r.boards!== undefined && r.boards.length-1>idx)
                                                        return b +","
                                                    return b
                                                })}</IonCardSubtitle></IonRow>
                                                <IonRow><IonCardSubtitle>Capacity: {r.capacity}</IonCardSubtitle></IonRow>
                                            </IonCol>
                                            <IonCol style={{"max-width": "40%"}}>
                                                <IonCardSubtitle>{r.description}</IonCardSubtitle>
                                            </IonCol>
                                        </IonRow>
                                        {/*</IonGrid>*/}
                                    </IonItem>
                                })}
                            </IonContent>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <div className={"grid"}>
                    <IonItemDivider class={"secondaryTitle"}>
                        <IonTitle style={{"font-weight": "bold"}}>Room equipments</IonTitle>
                    </IonItemDivider>
                    <IonRow>
                        {boards.map(board => {
                            return <IonCol>
                                <IonLabel class={"label"}>{board.key}</IonLabel>
                                <IonCheckbox class="assetsCheckbox"
                                             checked={currentClassPrefs.preferredBoards.length > 0 && currentClassPrefs.preferredBoards.includes(board.requestMapping)}
                                             value={board.requestMapping}
                                             key={board.key}
                                             onClick={(e) => {
                                                 // board.value=e.target.checked
                                                 console.log("+======== AYAYAYAY")
                                                 if (e.currentTarget.checked) {
                                                     addBoard(e.currentTarget.value)
                                                 } else {
                                                     removeBoard(e.currentTarget.value)
                                                 }

                                             }}
                                />
                            </IonCol>
                        })}
                        {assets.map(asset => {
                            return <IonCol>
                                <IonLabel class={"label"}>{asset.key}</IonLabel>
                                <IonCheckbox class="assetsCheckbox" value={asset.requestMapping}
                                             checked={currentClassPrefs.preferredDevices.length > 0 && currentClassPrefs.preferredDevices.includes(asset.requestMapping)}
                                             onClick={(e) => {
                                                 console.log(e.currentTarget.value)
                                                 console.log(e.currentTarget.checked)
                                                 if (e.currentTarget.checked) {
                                                     addDevice(e.currentTarget.value)
                                                 } else {
                                                     removeDevice(e.currentTarget.value)
                                                 }
                                             }}
                                             key={asset.key}
                                />
                            </IonCol>
                        })}
                        <IonCol>
                            <IonLabel class={"label"}>{projector.key}</IonLabel>
                            <IonCheckbox class="assetsCheckbox" value={projector.key}
                                         key={"projector"}
                                         checked={!!currentClassPrefs.wantsProjector}
                                         onClick={(e) => {
                                             // projector.value=e.target.checked
                                             setWantsProjector(e.currentTarget.checked)
                                         }}/>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonButton id={"submitBtn"} onClick={() => {
                            submitPrefs()
                        }}>Submit preferences</IonButton></IonRow>
                </div>
                <Footer/>

            </IonContent>
        </IonPage>
    )
}

export default PreferencesComponent;
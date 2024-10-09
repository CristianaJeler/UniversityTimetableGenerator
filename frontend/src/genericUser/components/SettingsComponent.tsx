import React, {useContext, useEffect, useState} from "react";

import {
    CreateAnimation,
    createAnimation,
    IonAlert,
    IonAvatar,
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonTitle,
    IonToast,
} from "@ionic/react";
// @ts-ignore
import unknownProfile from "../../images/profile.png"
import "../../style/settings.component.css"

import {image, lockClosed, medical, person,} from "ionicons/icons"
import {UserContext} from "../provider/GenericUserProvider";
import {PICTURE_TYPE} from "../utils/constants"
import {usePhotoGallery} from "../utils/usePhotosGallery";
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {RouteComponentProps} from "react-router";
import {HeaderLoggedUser} from "./HeaderLoggedUser";
import Footer from "./Footer";


export const SettingsComponent: React.FC<RouteComponentProps> = () => {
    const { logout } = useContext(LoginContext)
    const [settingsType, setSettingsType] = useState("picture")
    const {
        updateProfilePic,
        updateProfileDetails,
        picture,
        email,
        username,
        firstName,
        lastName,
        phone, userType,
        gettingAccountDetails,
        getAccountDetailsError,
        profileDetailsUpdateError,
        updatingProfileDetails,
        updatingProfilePicture,
        profilePicUpdateError,
        passwordUpdateError,
        updatingPassword,
        updatePassword,
        passwordUpdatedSuccessfully
    } = useContext(UserContext)

    const [updatedPic, setUpdatedPic] = useState<string>(unknownProfile)
    const [updatedFirstName, setUpdatedFirstName] = useState<string>(firstName || '')
    const [updatedLastName, setUpdatedLastName] = useState<string>(lastName || '')
    const [updatedPhone, setUpdatedPhone] = useState<string>(phone || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [passState, setPassState] = useState(true)
    const [showPasswordAlert, setShowPasswordAlert] = useState(false)
    const { takePhoto } = usePhotoGallery();

    const updatePhoto = async () => {
        let photo = await takePhoto();
        setUpdatedPic(photo)
    }

    function updatePic() {
        updateProfilePic && updateProfilePic(updatedPic);

    }

    function updateProfDetails() {
        updateProfileDetails && updateProfileDetails({
            firstName: updatedFirstName,
            lastName: updatedLastName,
            phone: updatedPhone,
            picture: '',
            email: email,
            username: username,
            userType: userType
        })
    }

    function updatePasswordSettings() {
        if (newPassword !== passwordConfirmation) {
            setPassState(false)
        } else {
            updatePassword && updatePassword(currentPassword, newPassword)
        }
    }

    useEffect(() => {
        if (passwordUpdatedSuccessfully)
            logout && logout();
    }, [passwordUpdatedSuccessfully])

    useEffect(() => {
        if (picture)
            if (picture.startsWith(PICTURE_TYPE)) setUpdatedPic(picture)
            else setUpdatedPic(PICTURE_TYPE + picture)
        return;
    }, [picture])


    const animation = function simpleAnimation() {
        const el = document.querySelector('#passwordConfirmation');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(100)
                .direction('alternate')
                .iterations(1)
                .keyframes([
                    { offset: 0, transform: 'translateX(0px)' },
                    { offset: 0.2, transform: 'translateX(10px)' },
                    { offset: 0.4, transform: 'translateX(0px)' },
                    { offset: 0.6, transform: 'translateX(-10px)' },
                    { offset: 1, transform: 'translateX(0px)' }
                ])
                .keyframes([
                    { offset: 0, color: 'red' },
                    { offset: 0.72, color: 'var(--background)' },
                    { offset: 1, color: 'black' }
                ])
                .onFinish(() => setPassState(true));
            animation.play();
        }
    }
    return (
        <IonPage>
            <HeaderLoggedUser/>
            <IonContent>
                <IonItemGroup class={"settingsOptions"}>
                    <IonList>
                        <IonItem class={"settingsOption"} onClick={() => setSettingsType("picture")}>
                            <IonLabel>Profile picture</IonLabel>
                            <IonIcon icon={image} />
                        </IonItem>
                        <IonItem class={"settingsOption"} onClick={() => setSettingsType("personal")}>
                            <IonLabel>
                                Account info
                            </IonLabel>
                            <IonIcon icon={person} />
                        </IonItem>
                        <IonItem class={"settingsOption"} onClick={() => setSettingsType("security")}>
                            <IonLabel>
                                Privacy
                            </IonLabel>
                            <IonIcon icon={lockClosed} />
                        </IonItem>
                    </IonList>
                </IonItemGroup>

    {/* SETTINGS FORMS RENDERING */}
                {settingsType === "picture" &&
                    <IonItemGroup color={"light"} class={"settingsForm"}>
                        <IonItemDivider>
                            <IonTitle className={"formTitle"}>PROFILE PICTURE</IonTitle>
                        </IonItemDivider>
                        <br />
                        {updatedPic &&
                            <IonAvatar id={"profilePic"} onClick={updatePhoto} title={"Change the profile picture"}>
                                <img src={updatedPic} alt={"Profile picture"} />
                            </IonAvatar>}
                        {/*<IonItemDivider>*/}
                            <IonButton className = {"updateBtn"} onClick={updatePic} slot = {"end"}>Update</IonButton>
                        {/*</IonItemDivider>*/}
                </IonItemGroup>}

                {settingsType === "personal" && <IonItemGroup color={"light"} class={"settingsForm"}>
                    <IonItemDivider>
                        <IonTitle className={"formTitle"}>ACCOUNT INFO</IonTitle>
                    </IonItemDivider>
                    <IonItem>
                        <IonLabel position="floating" color ="medium">Username</IonLabel>
                        <IonInput readonly
                            value={username}
                            className={"settingsInput"}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating"  color ="medium">
                            First name
                            <IonIcon color={"danger"} icon={medical} />
                        </IonLabel>
                        <IonInput
                            className={"settingsInput"}
                            value={updatedFirstName}
                            onIonChange={(e) => setUpdatedFirstName(e.detail.value || '')}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating"  color ="medium">
                            Last name
                            <IonIcon color={"danger"} icon={medical} />
                        </IonLabel>
                        <IonInput
                            className={"settingsInput"}
                            value={updatedLastName}
                            onIonChange={(e) => setUpdatedLastName(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating"  color ="medium">Phone</IonLabel>
                        <IonInput
                            className={"settingsInput"}
                            value={updatedPhone}
                            onIonChange={(e) => setUpdatedPhone(e.detail.value || '')}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating"  color ="medium">Email</IonLabel>
                        <IonInput className={"settingsInput"} readonly value={email} />
                    </IonItem>

                    <IonButton slot={"end"} onClick={updateProfDetails} class = {"updateBtn"}>Update</IonButton>
                </IonItemGroup>}

                {settingsType === "security" && <IonItemGroup color={"light"} class={"settingsForm"}>
                    <IonItemDivider>
                        <IonTitle className={"formTitle"}>PRIVACY</IonTitle>
                        <IonAlert isOpen={showPasswordAlert} header={"Warning!"}
                                  message={"Once you change the password, you will be redirected to the login page!\nMake sure you remember it!\nDo you want to continue changing your password?"} buttons={[
                            {
                                text: 'YES',
                                handler: () => {
                                    updatePasswordSettings();
                                }
                            },
                            {
                                text: 'NO'
                            }
                        ]} onDidDismiss={() => setShowPasswordAlert(false)} />
                    </IonItemDivider>
                    <IonItem>
                        <IonLabel position="floating"  color ="medium">Old password</IonLabel>
                        <IonInput type={"password"} value={currentPassword}
                            onIonChange={(e) => setCurrentPassword(e.detail.value || '')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating" color ="medium">New password</IonLabel>
                        <IonInput type={"password"} value={newPassword}
                            onIonChange={(e) => setNewPassword(e.detail.value || '')} />

                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating" color ="medium">New password confirmation</IonLabel>
                        <IonInput type={"password"} id={"passwordConfirmation"} value={passwordConfirmation}
                            onIonChange={(e) => setPasswordConfirmation(e.detail.value || '')} />
                    </IonItem>

                    <IonButton class = {"updateBtn"} onClick={() => setShowPasswordAlert(true)}>Update</IonButton>
                </IonItemGroup>}
                {/*{gettingAccountDetails && <IonLoading isOpen={true} message={"Account details loading..."} />}*/}
                {getAccountDetailsError &&
                    <IonAlert isOpen={true} message={"Account information could not be obtained..."} />}
                <IonLoading isOpen={updatingProfileDetails} message={"Updating the account information..."} />
                {profileDetailsUpdateError &&
                    <IonAlert isOpen={true} message={"Account information update failed!"} />}
               <IonLoading isOpen={updatingProfilePicture} message={"Updating the profile picture..."} />
                <IonAlert isOpen={profilePicUpdateError !== null} message={"Profile picture update failed!"} />
                {!passState && (<CreateAnimation ref={animation} />)
                }
                <IonLoading isOpen={updatingPassword} message={"Password updating.."} />
                <IonAlert isOpen={passwordUpdateError !== null} header={"Password update failed!"} message={passwordUpdateError?.message} />
                <IonToast isOpen={passwordUpdatedSuccessfully} duration={700} header={"Password updated successfully!"}/>

            </IonContent>
            <Footer/>
        </IonPage>
    )
}

export default SettingsComponent;
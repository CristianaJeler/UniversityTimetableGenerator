import {IonApp, IonRouterOutlet, setupIonicReact} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {Redirect, Route} from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import "../src/style/appStyle.css"

// import Signup from "./authentication/components/Signup";
import Home from "./genericUser/components/Home";
import SignupComponent from "./authentication/components/SignupComponent";
import React from "react";
import {AuthProvider} from "./authentication/provider/AuthProvider";
import LoginComponent from "./authentication/components/LoginComponent";
import {GenericUserProvider} from "./genericUser/provider/GenericUserProvider";
import {PrivateRoute} from "./core/PrivateRoute";
import {TeacherHome} from "./teacher/components/TeacherHome";
import SettingsComponent from './genericUser/components/SettingsComponent';
import PreferencesComponent from "./teacher/components/PreferencesComponent";
import YourPreferences from "./teacher/components/YourPreferences";
import AdminHome from "./administrator/components/AdminHome";
import ManageSubjects from "./administrator/components/ManageSubjects";
import {AdministratorProvider} from "./administrator/provider/AdministratorProvider";
import ManageFormations from './administrator/components/ManageFormations';
import ManageRoomsAndBuildings from "./administrator/components/ManageRoomsAndBuildings";
import ManageClasses from './administrator/components/ManageClasses';
import TimetableGeneratorHome from "./administrator/components/TimetableGeneratorHome";
import TimetableGeneratorMain from "./administrator/components/GenerateTimetableMain";
import {TeacherProvider} from "./teacher/provider/TeacherProvider";

setupIonicReact();

const App: React.FC = () => {
    return (<IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <AuthProvider>
                        <Route path="/login" component={LoginComponent} exact={true}/>
                        <Route path={"/signup"} component={SignupComponent} exact={true}/>
                        <Route exact path="/" render={() => <Redirect to="/home"/>}/>
                        <Route component={Home} path={"/home"}/>
                        <GenericUserProvider>
                            <AdministratorProvider>
                                <TeacherProvider>
                                    <PrivateRoute component={TeacherHome} path={"/teachers"}/>
                                    <PrivateRoute component={SettingsComponent} path={"/settings"}/>
                                    <PrivateRoute component={PreferencesComponent} path={"/manage_prefs"}/>
                                    <PrivateRoute component={YourPreferences} path={"/your_prefs"} exact={true}/>
                                </TeacherProvider>


                                <PrivateRoute component={AdminHome} path={"/db-admin"}/>
                                <PrivateRoute component={ManageSubjects} path={"/manage_subjects"}/>
                                <PrivateRoute component={ManageFormations} path={"/manage_formations"} exact={true}/>
                                <PrivateRoute component={ManageRoomsAndBuildings} path={"/buildings_rooms"}
                                              exact={true}/>
                                <PrivateRoute component={ManageClasses} path={"/manage_classes"} exact={true}/>
                                <PrivateRoute component={TimetableGeneratorHome} path={"/generator"} exact={true}/>
                                <PrivateRoute component={TimetableGeneratorMain} path={"/generate_timetable"}
                                              exact={true}/>
                            </AdministratorProvider>
                        </GenericUserProvider>
                    </AuthProvider>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    )
};

export default App;

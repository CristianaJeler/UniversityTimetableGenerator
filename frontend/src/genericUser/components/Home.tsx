import {RouteComponentProps} from "react-router";
import React, {useContext} from "react";
import {IonContent, IonPage} from "@ionic/react";
import {HeaderMain} from "./HeaderMain";
import Footer from "./Footer";
import {HomePage} from "./HomePage";
import {LoginContext} from "../../authentication/provider/AuthProvider";
import {Redirect} from "react-router-dom";

export const Home: React.FC<RouteComponentProps> = () => {
    const { userType } = useContext(LoginContext)

    switch (userType) {
        case '1':
            return (
                <>
                    <Redirect to={"/teachers"} />
                </>
            )
        case '2':
            return (
                <>
                    <Redirect to={"/db-admin"} />
                </>
            )
        case '3':
            return (
                <>
                    <Redirect to={"/generator"} />
                </>
            )
        default:
            return (
                <IonPage>
                    <HeaderMain />
                    <IonContent id="contentPage">
                        <HomePage />
                        <Footer />
                    </IonContent>

                </IonPage>
            )

    }
}
export default Home;
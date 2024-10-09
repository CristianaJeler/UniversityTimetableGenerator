import {IonFooter, IonTitle, IonToolbar} from "@ionic/react";
import React, {useEffect} from "react";
import "../../style/footer.css"

export const Footer: React.FC = () => {
    useEffect(() => {
        return () => {
            console.log("Unmounted Footer component");
        };
    }, []);
    return (
            <IonFooter id={"footer"}  collapse="fade">
                <IonToolbar>
                <IonTitle color={"black"} id={"footerTitle"}>Copyright © 2023
                    <br/>
                    <div className={"appName"}>
                        ORARIO
                    </div>
                </IonTitle>
                </IonToolbar>
            </IonFooter>
    )
};
export default Footer;
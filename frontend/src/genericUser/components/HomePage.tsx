import {IonImg, IonSlide, IonSlides} from "@ionic/react";
import React from "react";
import "../../style/home_body.css"

export const HomePage: React.FC = () => {
    const slideOpts = {
        speed: 1000,
        effect: "slide",
        paginationType: "fraction",
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: {
            disableOnInteraction: false
        },
        loop: true
    };
    return (<>
        <IonSlides options={slideOpts} id="slider" pager={true}>
            <IonSlide>
                    <div className="textCol">
                        <IonImg src={"./images/teacher.jpg"}/>
                    </div>
            </IonSlide>
            <IonSlide>
                <div className="textCol">
                    <IonImg src={"./images/generator.jpg"}/>
                </div>
            </IonSlide>
            {/*You're the database administrator?*/}
            {/*You just have to add all the necessary information to the database. Orario will take care of the rest!*/}
            <IonSlide>
                <div className="textCol">
                    <IonImg src={"./images/databaseadmin.jpg"}/>
                </div>
            </IonSlide>
        </IonSlides>
    </>)
}
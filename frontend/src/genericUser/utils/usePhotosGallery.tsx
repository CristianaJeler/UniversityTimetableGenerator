import {CameraResultType} from "@capacitor/camera";
import {base64FromPath} from "@ionic/react-hooks/filesystem";
import {useCamera} from "@ionic/react-hooks/camera";

export function usePhotoGallery() {
    const { getPhoto } = useCamera();
    const takePhoto = async () => {
        const cameraPhoto = await getPhoto({
            resultType: CameraResultType.Uri,
            quality: 100,
            webUseInput: true, //deschide direct input-ul de fisiere din pc
        });

        return await base64FromPath(cameraPhoto.webPath!);
    }

    const toBase64 = (file:Blob) => new Promise<any>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    return {takePhoto, toBase64};
}

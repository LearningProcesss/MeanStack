import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {

    if (typeof (control.value === "string")) {
        return of(null);
    }

    const file = control.value as File;

    const fileReader = new FileReader();

    const obs = Observable.create((observer: Observer<{ [key: string]: any }>) => {

        fileReader.addEventListener('loadend', () => {

            const arr = new Uint8Array(fileReader.result).subarray(0, 4);

            let header = "";

            let valid = false;

            for (let index = 0; index < arr.length; index++) {
                header += arr[index].toString(16);
            }

            switch (header) {
                case "89504e47":
                    // type = "image/png";

                    valid = true;
                    break;
                case "47494638":
                    // type = "image/gif";
                    valid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    // type = "image/jpeg";
                    valid = true;
                    break;
                default:
                    valid = false;
                    // type = "unknown"; // Or you can use the blob.type as fallback
                    break;
            }

            if (valid) {
                observer.next(null);
            } else {
                observer.next({ invalidMimeType: true });
            }

            observer.complete();
        });

        fileReader.readAsArrayBuffer(file);
    });

    return obs;
};
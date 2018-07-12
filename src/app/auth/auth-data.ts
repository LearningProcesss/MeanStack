export interface AuthData {
    email: string;
    password: string;
}

export class AuthCache {

    private _expireDate: Date;
    private _expireRimanente: number;
    private _valid: boolean;
    private _userId: string;




    constructor(private token: string, private expire: string) {

        this.readLocal();

        if (!this._expireDate) {

            var d = new Date();

            this._expireDate = new Date(d.getTime() + expire);
        }
    }

    private readLocal() {

        this.token = localStorage.getItem("token");

        this.expire = localStorage.getItem("expire");

        this._userId = localStorage.getItem("uid");

        if (!this.token && !this.expire) {
            return;
        } else {
            this._expireDate = new Date(this.expire);
        }
    }

    public saveLocal(token: string, expire: number, userId: string) {

        const ora = new Date();

        const cnstr = new Date(ora.getTime() + expire);

        localStorage.setItem("token", token);

        localStorage.setItem("expire", cnstr.toISOString());

        localStorage.setItem("uid", userId);

        this.readLocal();
    }

    public deleteLocal() {
        localStorage.removeItem("token");
        localStorage.removeItem("expire");
    }

    public isValidToken(): boolean {

        this.readLocal();

        if (!this.token || !this.expire) {
            return false;
        }

        var ora = new Date();

        var dateExpire = new Date(this.expire);

        var rimanente = dateExpire.getTime() - ora.getTime();

        if (rimanente > 0) {
            this._expireRimanente = rimanente;
            return true;
        }
        else {
            return false;
        }
    }

    public get tokenU(): string {
        return this.token;
    }

    public get userId(): string {
        return this._userId;
    }

    public get expireRimanente(): number {
        return this._expireRimanente;
    }

    public get valid(): boolean {
        return this._valid;
    }

    public get expireDate(): Date {
        return this._expireDate;
    }
}
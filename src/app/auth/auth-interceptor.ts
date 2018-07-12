import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authServ: AuthService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const tok = this.authServ.getToken();

        const authRequest = req.clone({
            headers: req.headers.set("authorization", "Bearer " + tok)
        });

        return next.handle(authRequest);
    }
}
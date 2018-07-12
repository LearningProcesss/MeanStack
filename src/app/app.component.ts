import { Component, OnInit } from "@angular/core";
import { Post } from "./post";
import { AuthService } from "./auth/auth.service";



@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

  posts: Post[] = [];

  // onPostCreato(event) {
  //   this.posts.push(event);
  // }

  constructor(private authServ: AuthService) {

  }

  ngOnInit(): void {
    this.authServ.autoAuthUser();
  }
}

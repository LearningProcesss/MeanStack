import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post";
import { PostService } from "../post.service";

import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  private sottoscrizione: Subscription;
  private authSub: Subscription;

  isLoading = false;
  totalPosts = 10;
  pageSize = 3;
  pageSizeOptions = [1, 3, 5, 10];
  currentPage = 1;
  posts: Post[] = [];
  autenticato: boolean;

  constructor(public postService: PostService, private authServ: AuthService) { }

  ngOnInit() {
    this.postService.getPosts(this.pageSize, this.currentPage);

    this.isLoading = true;

    this.sottoscrizione = this.postService.getPostListner()
      .subscribe((posts: Post[]) => {

        this.isLoading = false;

        this.posts = posts;

        this.totalPosts = posts.length;

      });

    this.autenticato = this.authServ.getAuthStatus();

    this.authSub = this.authServ.getAuthListner().subscribe(autenticato => {
      this.autenticato = autenticato;
    });
  }

  ngOnDestroy(): void {
    this.sottoscrizione.unsubscribe();
    this.authSub.unsubscribe();
  }

  pageEvent(pageEvent: PageEvent) {

    this.currentPage = pageEvent.pageIndex + 1;

    this.pageSize = pageEvent.pageSize;

    this.postService.getPosts(this.pageSize, this.currentPage);

  }

  onDelete(postId: string) {

    this.isLoading = true;

    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.pageSize, this.currentPage);
    });
  }
}

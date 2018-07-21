import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post";
import { Router } from "@angular/router";
import { PagedResult } from "./pagedResult";

@Injectable({
  providedIn: "root"
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  //private postsUpdated = new Subject<PagedResult<Post>>();

  constructor(private http: HttpClient, private router: Router) {
  }

  adPost(title: string, content: string, image: File) {

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post("http://localhost:3000/api/posts", postData)
      .subscribe((response: Post) => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {

    let postDataForm: FormData;

    let postDataJson: Post;

    console.log(typeof(image));


    if (typeof image === "object") {
      postDataForm = new FormData();
      postDataForm.append("id", id);
      postDataForm.append("title", title);
      postDataForm.append("content", content);
      postDataForm.append("image", image, title);
    } else {
      postDataJson = {
        _id: "",
        id: id,
        title: title,
        content: content,
        imagePath: image as string,
        creator: ""
      };
    }

    console.log(postDataForm);
    

    this.http.put('http://localhost:3000/api/posts/' + id, postDataForm)
      .subscribe((response: Post) => {
        this.router.navigate(["/"]);
      });
  }

  getPost(id: string) {
    return this.http.get("http://localhost:3000/api/posts/" + id);
  }

  getPosts(pageSize: number, currentPage: number) {

    const queryParams = `?pagesize=${pageSize}&page=${currentPage}`;

    this.http
      .get<{ pagedResult: PagedResult<Post> }>("http://localhost:3000/api/posts" + queryParams)
      .pipe(
        map(responseData => {

          return responseData.pagedResult.resultsArray.map(post => {

            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator,
              _id: ""
            };
          });
        })
      )
      .subscribe(posts => {

        this.posts = posts;

        this.postsUpdated.next([...this.posts]);

      });
  }

  getPostListner() {
    return this.postsUpdated.asObservable();
  }

  deletePost(id: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + id);
  }
}

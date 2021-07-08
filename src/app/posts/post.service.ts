import { Post } from "./post.model";
import { Subject } from 'rxjs'
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
@Injectable()
export class PostService {
  private posts: any=[];
  private postUpdated = new Subject<{posts: Post[], postCount:number}>();
  constructor(private http: HttpClient,
    private router: Router){

  }
  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{message:string, posts: any, maxPosts: number}>('http://localhost:3000/posts'+queryParams)
    .pipe(
      map(postData=>{
      return {
        posts: postData.posts.map(post =>{
        return{
          title: post.title,
          description: post.description,
          id: post._id,
          imagePath: post.imagePath
        };
      }),
      maxPosts: postData.maxPosts
    };
    }))
    .subscribe((response)=>{
      this.posts = response.posts;
      this.postUpdated.next({posts: [...this.posts], postCount: response.maxPosts});
    })
  }
  getPostUpadteListener(){
    return this.postUpdated.asObservable();
  }
  addPost(title: string, description: string, image: File){
    const postData = new FormData();
    postData.append("title",title);
    postData.append("description",description);
    postData.append("image",image, title);
    this.http
    .post<{message:string, post: Post}>('http://localhost:3000/posts', postData)
    .subscribe((response)=>{
      this.router.navigate(['/']);
    });
    }

  getPost(id:string){
    return this.http.get<{_id:string, title: string, description:string, imagePath: string}>('http://localhost:3000/posts/'+id);
  }
  updatePost(id: string, title: string, description: string, image: File | string){
    let postData: Post | FormData;
    if(typeof(image)==='object'){
      postData = new FormData();
      postData.append('id',id)
      postData.append('title',title);
      postData.append('description',description);
      postData.append('image',image, title);
    }else
    {
      postData = {
        id: id,
        title: title,
        description: description,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/posts/'+id, postData)
    .subscribe(response =>{
      this.router.navigate(['/']);
    })
  }
  deletePost(postId: string){
    return this.http.delete('http://localhost:3000/posts/'+postId);
}
}

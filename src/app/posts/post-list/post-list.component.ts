import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostService } from "../post.service";
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
posts:Post[]= [];
isLoading = false;
totalPosts = 0;
postsPerPage =1;
currenPage =1;
pageSizeOptions = [1,2,3,5,10,20,30]
userIsAuthenticated = false;
private postsSub: Subscription;
private authStatusSubs: Subscription;
constructor(public postsService: PostService,
 private authService: AuthService ){

}
ngOnInit(){
  this.isLoading = true;
  this.postsService.getPosts(this.postsPerPage, 1);
  this.postsSub = this.postsService.getPostUpadteListener()
  .subscribe((postData:{posts: Post[], postCount:number})=>{
    this.isLoading = false;
    this.totalPosts = postData.postCount;
    this.posts = postData.posts;
  });
  this.userIsAuthenticated = this.authService.getIsAuth();
  this.authStatusSubs = this.authService.getAuthStatusListener()
  .subscribe(isAuthenticated =>{
    this.userIsAuthenticated = isAuthenticated;
  });
}
deletePost(postId: string){
  this.isLoading = true;
  this.postsService.deletePost(postId).subscribe(()=> {
    this.postsService.getPosts(this.postsPerPage, this.currenPage);
  });
}
onChangePage(pageData: PageEvent){
this.isLoading = true;
this.currenPage = pageData.pageIndex+1;
this.postsPerPage = pageData.pageSize;
this.postsService.getPosts(this.postsPerPage, this.currenPage);
}
ngOnDestroy(){
  this.postsSub.unsubscribe();
  this.authStatusSubs.unsubscribe();
}
}

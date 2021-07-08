import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { UserService } from "./user.service";

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy{
isLoading = false;
totalUsers = 0;
usersPerPage =2;
currenPage =1;
pageSizeOptions = [1,2,3,5,10,20,30]
userIsAuthenticated = false;
allUsers:any;
private authStatusSubs: Subscription;
constructor(private authService: AuthService,
  private userService: UserService ){
}
ngOnInit(){
  this.isLoading = true;
  this.userService.getUsers(this.usersPerPage, this.currenPage).subscribe(res=>{
    this.isLoading = false;
    this.allUsers = res;
    this.totalUsers = this.allUsers.maxUsers;
  });
  this.userIsAuthenticated = this.authService.getIsAuth();
  this.authStatusSubs = this.authService.getAuthStatusListener()
  .subscribe(isAuthenticated =>{
    this.userIsAuthenticated = isAuthenticated;
  });
}
deletePost(postId: string){

}
onChangePage(pageData: PageEvent){
  this.isLoading = true;
  this.currenPage = pageData.pageIndex+1;
  this.usersPerPage = pageData.pageSize;
  this.userService.getUsers(this.usersPerPage, this.currenPage).subscribe(res=>{
    this.isLoading = false;
    this.allUsers = res;
    this.totalUsers = this.allUsers.maxUsers;
  });
}
ngOnDestroy(){

}
}

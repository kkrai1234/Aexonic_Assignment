import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
@Injectable()
export class UserService {
  constructor(private http: HttpClient,
    private router: Router){

  }
  private handleError(error: any) {
    return Observable.throw(error.json());
  }
  getUsers(usersPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    return this.http
    .get('http://localhost:3000/user'+queryParams);
  }
  getUserById(userId:string){
    return this.http.get('http://localhost:3000/user/'+userId);
  }

  updateUser(user:any){
    return this.http.put('http://localhost:3000/user/'+user._id, user);
  }
}


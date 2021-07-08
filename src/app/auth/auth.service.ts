import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthData, AuthSignUpData } from "./auth-data.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  private isAuthenticated = false;
  private authStatusListener =new Subject<boolean>();
  constructor(private http: HttpClient){

  }
  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  createUser(firstName:string,lastName:string,address:string,mobileNo:number,email: string, password: string){
    const authData: AuthSignUpData = {firstName:firstName,lastName:lastName,address:address,mobileNo:mobileNo,email: email, password: password};
    this.http.post("http://localhost:3000/user/signup",authData)
    .subscribe(response=>{
      console.log(response);
    })
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string}>("http://localhost:3000/user/login",authData)
    .subscribe(response=>{
      const token = response.token;
      this.token = token;
      if(token){
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      }
    })
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}

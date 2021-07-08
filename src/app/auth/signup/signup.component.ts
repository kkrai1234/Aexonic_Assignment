import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { UserService } from "src/app/user/user.service";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
isLoading = false;
form: FormGroup;
private userId: string;
public view = 'create';
  user: any;
constructor(public authService: AuthService,
  public route: ActivatedRoute,
  public userService: UserService){

}
ngOnInit(){
  this.route.paramMap.subscribe((paramMap: ParamMap)=>{
    if(paramMap.has('userId')){
      this.form = new FormGroup({
        'firstName': new FormControl(null, {validators: [Validators.required]}),
        'lastName': new FormControl(null, {validators: [Validators.required]}),
        'address': new FormControl(null, {validators: [Validators.required]}),
        'mobileNo': new FormControl(null, {validators: [Validators.required]}),
        'email': new FormControl({value:null, disabled:true}, {validators: [Validators.required]})
      });
      this.view = 'edit';
      this.userId = paramMap.get('userId');
      this.isLoading = true;
      this.userService.getUserById(this.userId).subscribe(userData=> {
        this.isLoading = false;
        if(userData){
        this.user = userData;
        this.form.setValue({
          'firstName': this.user.firstName,
          'lastName': this.user.lastName,
          'address': this.user.address,
          'mobileNo': this.user.mobileNo,
          'email': this.user.email
        });
      }
      });
    }
    else{
      this.view ='create';
    }
  });
}
onSignup(form: NgForm){
  if(form.invalid){
    return;
  }
  else{
  this.authService.createUser(form.value.firstName,form.value.lastName,form.value.address,form.value.mobileNo,form.value.email, form.value.password);
}
}
onSaveUser(formData:any){
  this.user.firstName = formData.value.firstName;
  this.user.lastName = formData.value.lastName;
  this.user.address = formData.value.address;
  this.user.mobileNo = formData.value.mobileNo;
  this.userService.updateUser(this.user).subscribe(response=>{
    console.log(response);
  });
}
}

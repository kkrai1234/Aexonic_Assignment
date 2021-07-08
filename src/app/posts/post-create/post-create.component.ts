import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
postTitle = '';
postContent ='';
post: Post;
form: FormGroup;
imagePreview: string | ArrayBuffer;
isLoading = false;
private view = 'create';
private postId: string;
constructor(public postsService: PostService,
  public route: ActivatedRoute){

}
ngOnInit(){
  this.form = new FormGroup({
    'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
    'description': new FormControl(null, {validators: [Validators.required]}),
    'image': new FormControl(null, {
      validators: [Validators.required], asyncValidators: [mimeType]
    })
  }),
  this.route.paramMap.subscribe((paramMap: ParamMap)=>{
    if(paramMap.has('postId')){
      this.view = 'edit';
      this.postId = paramMap.get('postId');
      this.isLoading = true;
      this.postsService.getPost(this.postId).subscribe(postData=> {
        this.isLoading = false;
        this.post = {
          id: postData._id,
          title: postData.title,
          description: postData.description,
          imagePath: postData.imagePath
        };
        this.form.setValue({
          'title': this.post.title,
          'description': this.post.description,
          'image': this.post.imagePath
        });
      });
    }
    else{
      this.view ='create';
      this.postId = null;
    }
  });
}
onSavePost (){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.view ==='create'){
    this.postsService.addPost(this.form.value.title,
      this.form.value.description,
      this.form.value.image
    );
  }
  else{
    this.postsService.updatePost(this.postId,
      this.form.value.title,
      this.form.value.description,
      this.form.value.image);
  }
  this.form.reset();
}
onSelectImage(event: Event){
const file = (event.target as HTMLInputElement).files[0];
this.form.patchValue({image: file});
this.form.get('image').updateValueAndValidity();
const reader = new FileReader();
reader.onload = () =>{
  this.imagePreview = reader.result;
};
reader.readAsDataURL(file);
}
}

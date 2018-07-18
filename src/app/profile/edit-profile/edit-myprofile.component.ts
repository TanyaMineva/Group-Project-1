import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../../posts/posts.service';
import { AuthService } from '../../auth/auth.service';
import { mimeType } from '../../posts/post-create/mime-type.validator';
import { Router } from '@angular/router';


@Component({   // Decorator
    templateUrl: './edit-myprofile.component.html',
    styleUrls: ['./edit-myprofile.component.css']
  })
  export class EditMyProfileComponent implements OnInit {
    form: FormGroup;
    imagePreview: string;

  constructor(public postsService: PostService, public authService: AuthService, public router: Router) {}


    ngOnInit() {
      this.form = new FormGroup({
        'location': new FormControl(null, {
          validators: [Validators.required]
        }),
        'year': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
        }),
        'services': new FormControl(null, {
          validators: [Validators.required]
        }),
        'workfield': new FormControl(null, {
          validators: [Validators.required]
        }),
        'website': new FormControl(null, {
          validators: [Validators.required]
        }),
        'image': new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        })
      });
    }
    onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
  }
  onSavePost() {}

  saveProfile() {
    this.router.navigate(['/profile']);
    }
  }

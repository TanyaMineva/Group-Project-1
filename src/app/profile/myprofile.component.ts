import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../posts/posts.service';
import { AuthService } from '../auth/auth.service';

import { mimeType } from '../posts/post-create/mime-type.validator';


@Component({   // Decorator
    templateUrl: './myprofile.component.html',
    styleUrls: ['./myprofile.component.css']
  })
  export class MyProfileComponent implements OnInit {
    form: FormGroup;
    imagePreview: string;


    constructor(public postsService: PostService, public authService: AuthService) {}


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
  }

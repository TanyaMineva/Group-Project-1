import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { Profile } from '../profile.model';
import { mimeType } from '../../profile/edit-profile/mime-type.validator';
import { ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';


@Component({   // Decorator
    templateUrl: './edit-myprofile.component.html',
    styleUrls: ['./edit-myprofile.component.css']
  })
  export class EditMyProfileComponent implements OnInit {
    form: FormGroup;
    isLoading = false;
    imagePreview: string;
    profile: Profile;
    private mode = 'create';
    private profileId: string;
    private authStatusSub: Subscription;
  constructor(public profilesService: ProfileService, public authService: AuthService, public router: Router,public route: ActivatedRoute) {}


    ngOnInit() {
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        authStatus => {
          this.isLoading = false;
        }
      );

      this.form = new FormGroup({
        'image': new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        }),
        'name': new FormControl(null, {
          validators: [Validators.required]
        }),
        'website': new FormControl(null, {
          validators: [Validators.required]
        }),
        'number': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(8)]
        }),
        'workfield': new FormControl(null, {
          validators: [Validators.required]
        }),
        'services': new FormControl(null, {
          validators: [Validators.required]
        }),
        'year': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
        }),
        'location': new FormControl(null, {
          validators: [Validators.required]
        })
      });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('profileId')) {
          this.mode = 'edit';
          this.profileId = paramMap.get('profileId');
          this.isLoading = true;
          this.profilesService.getProfile(this.profileId)
            .subscribe(profileData => {
              this.isLoading = false;
              this.profile = {
                id: profileData._id,
                imagepath: profileData.imagepath,
                name: profileData.name,
                website: profileData.website,
                number: profileData.number,
                workfield: profileData.workfield,
                services: profileData.services,
                year: profileData.year,
                location: profileData.location,
                creator: profileData.creator
              };
              this.form.setValue({
              'image': this.profile.imagepath,
              'name': this.profile.name,
              'website': this.profile.website,
              'number': this.profile.number,
              'workfield': this.profile.workfield,
              'services': this.profile.services,
              'year': this.profile.year,
              'location': this.profile.location
              });
              this.imagePreview=this.profile.imagepath;
            });
        } else {
          this.mode = 'create';
          this.profileId = null;
        }
        console.log(this.mode);
      });



    }
    onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
    
    saveProfile() {
      if (this.form.invalid) {
        console.log('Form is invalid');
        return;
      }
      this.isLoading = true;
      if (this.mode === 'create') {
        this.profilesService.addProfile(this.form.value.image, this.form.value.name, this.form.value.website, this.form.value.number, this.form.value.workfield,  this.form.value.services, this.form.value.year, this.form.value.location);
        console.log('Profile data saved.');
        console.log(this.form.value.name);
      } else {
        this.profilesService.updateProfile(this.profileId, this.form.value.image, this.form.value.name, this.form.value.website, this.form.value.number, this.form.value.workfield,  this.form.value.services, this.form.value.year, this.form.value.location);
      }
    this.form.reset();
    this.router.navigate(['/profile']);
  }
}
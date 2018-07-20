import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { Profile } from '../profile.model';
import { mimeType } from '../../profile/edit-profile/mime-type.validator';
import { ProfileService } from '../profile.service';

@Component({   // Decorator
    templateUrl: './edit-myprofile.component.html',
    styleUrls: ['./edit-myprofile.component.css']
  })
  export class EditMyProfileComponent implements OnInit {
    form: FormGroup;
    imagePreview: string;
    profile: Profile;
    private mode = 'create';
    isLoading = false;
    public profileId: string;
  constructor(public profilesService: ProfileService, public authService: AuthService, public router: Router,public route: ActivatedRoute) {}


    ngOnInit() {
      this.form = new FormGroup({
        'location': new FormControl(null, {
          validators: [Validators.required]
        }),
        'year': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
        }),
        'name': new FormControl(null, {
          validators: [Validators.required]
        }),
        'services': new FormControl(null, {
          validators: [Validators.required]
        }),
        'workfield': new FormControl(null, {
          validators: [Validators.required]
        }),
        'number': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(8)]
        }),
        'website': new FormControl(null, {
          validators: [Validators.required]
        }),
        'logo': new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
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
                name: profileData.name,
                location: profileData.location,
                logo: profileData.logo,
                number: profileData.number,
                website: profileData.website,
                services: profileData.services,
                workfield: profileData.workfield,
                year: profileData.year
              };
              this.form.setValue({
              'name': this.profile.name,
              'location': this.profile.location,
              'year': this.profile.year,
              'services': this.profile.services,
              'workfield': this.profile.workfield,
              'number': this.profile.number,
              'website': this.profile.website,
              'logo': this.profile.logo
              });
            });
        } else {
          this.mode = 'create';
          this.profileId = null;
        }
      });



    }
    onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('logo').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
  }

  saveProfile() {
    if (this.form.invalid) {
      console.log('hI');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.profilesService.addProfile(this.form.value.name, this.form.value.location, this.form.value.logo,this.form.value.website,this.form.value.services,this.form.value.workfield,this.form.value.number,this.form.value.year);
    } 
    this.form.reset();
    this.router.navigate(['/profile']);
  }
}
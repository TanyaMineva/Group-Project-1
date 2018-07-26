import { Component, OnInit, OnDestroy} from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormsModule, FormGroup } from '@angular/forms';

import { AuthService } from '../../auth/auth.service';
import { Profile } from '../../profile/profile.model';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})

export class ProfileListComponent implements OnInit, OnDestroy {
  // profiles = [
    // { title: 'First profile', content: 'This is the first profile\'s content'},
    // { title: 'Second profile', content: 'This is the second profile\'s content'},
    // { title: 'Third profile', content: 'This is the third profile\'s content'}
  // ];

  form: FormGroup;
  imagePreview: string;
  profiles: Profile[] = [];  // Only from the parent component

  isLoading = false;
  public userIsAuthenticated = false;
  userId: string;

  private profilesSub: Subscription;
  private authStatusSub: Subscription;


  // Dependency injection with a constructor
  // constructor(profilesService: profileService ) {
  //  this.profilesService = profilesService;
  // }
  constructor(public profilesService: ProfileService, private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.profilesService.getProfiless();      // We trigger the http request
    this.userId = this.authService.getUserId();
    this.profilesSub = this.profilesService
    .getProfileUpdateListener()
    .subscribe((profileData: {profiles: Profile[]}) => {
      console.log('Hellooo');
      this.isLoading = false;
      this.profiles = profileData.profiles;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy() {
    this.profilesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}



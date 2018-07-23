import { Component, OnInit, OnDestroy} from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

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

  profiles: Profile;  // Only from the parent component
  // profilesService: profileService;
  isLoading = false;
  totalProfiles = 0;
  profilesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
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
    this.profilesService.getProfiles(this.profilesPerPage, this.currentPage);      // We trigger the http request
    this.userId = this.authService.getUserId();
    this.profilesSub = this.profilesService
      .getProfileUpdateListener()
      .subscribe((profileData: {profiles2: Profile}) => {
        this.isLoading = false;
        this.profiles = profileData.profiles2;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.profilesPerPage = pageData.pageSize;
    this.profilesService.getProfiles(this.profilesPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.profilesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}



import { Component, OnInit, AfterViewChecked, OnDestroy} from '@angular/core';
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

export class ProfileListComponent implements OnInit, AfterViewChecked, OnDestroy {
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

  filterServices() {
    let  input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("p")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

ngAfterViewChecked() {
  this.isLoading = false;
}
  
}



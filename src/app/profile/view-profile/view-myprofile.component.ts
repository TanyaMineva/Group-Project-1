import { Component, OnInit, AfterViewChecked, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProfileService } from "../profile.service";
import { AuthService } from "../../auth/auth.service";
import { mimeType } from "../../profile/edit-profile/mime-type.validator";
import { Router } from "@angular/router";
import { Profile } from "../profile.model";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

@Component({
  // Decorator
  templateUrl: './view-myprofile.component.html',
  styleUrls: ['./view-myprofile.component.css']
})
export class ViewMyProfileComponent implements OnInit,AfterViewChecked, OnDestroy {
  form: FormGroup;
  imagePreview: string;
  profiles: Profile[] = [];  // Only from the parent component
   // Only from the parent component
  targetProfile: Profile;// profilesService: ProfileService;
  isLoading = false;
  public userIsAuthenticated = false;
  userId: string;

  private profilesSub: Subscription;
  private authStatusSub: Subscription;

  
  constructor(public profilesService: ProfileService, public authService: AuthService, public router: Router) { }
  
  ngOnInit() {
    this.isLoading = true;
    this.profilesService.getProfiless();      // We trigger the http request
    this.userId = this.authService.getUserId();
    this.profilesSub = this.profilesService
    .getProfileUpdateListener()
    .subscribe((profileData: {profiles: Profile[]}) => {
      console.log('Hellooo');
      this.profiles = profileData.profiles;
      // tslint:disable-next-line:prefer-const
      for(let target of this.profiles) {
        if (target.creator === this.authService.getUserId()) {
          this.targetProfile = target;
          break;
        }
      }
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
  }
  
  onCreate() {
    this.router.navigate(['/edit']);
  }


  ngAfterViewChecked() {
    this.isLoading = false;
  }
  ngOnDestroy() {
    this.profilesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}


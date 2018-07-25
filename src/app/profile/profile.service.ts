import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Profile } from '../profile/profile.model';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiUrl + '/profile/';

@Injectable({providedIn: 'root'})  // It provides this on the root level
                                   // Angular finds it
                                   // Only creates one instance of the service fot he entire app
export class ProfileService {
  private profiles: Profile[] = [];
 hasProfile = this.authService.getHasProfile();
  
  private profilesUpdated = new Subject<{profiles: Profile[], profileCount: number}>();
  
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  getProfiles(profilesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${profilesPerPage}&page=${currentPage}`;
    // return [...this.profiles];  // We copy the array so that we don't change the original one. This happends with [...arrayToBeCopied]
    this.http
      .get<{message: string, profiles: any, maxProfiles: number}>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((profileData) => {
          return { profiles: profileData.profiles.map(profile => {
            return {
              id: profile._id,
              logopath: profile.logopath,
              name: profile.name,
              website: profile.website,
              number: profile.number,
              workfield: profile.workfield,
              services: profile.services,
              year: profile.year,
              location: profile.location,
              creator: profile.creator
            };
          }),
          maxProfiles: profileData.maxProfiles
          };
      }))
      .subscribe(transformedprofileData => {
        console.log(transformedprofileData);
        this.profiles = transformedprofileData.profiles; // We don't need to duplicate because we can't change it in the server
        this.profilesUpdated.next({
          profiles: [...this.profiles],
          profileCount: transformedprofileData.maxProfiles});
      });
  }

  getProfiless() {
    //return [...this.profiles];  // We copy the array so that we don't change the original one. This happends with [...arrayToBeCopied]
    this.http
      .get<{message: string, profiles: any, maxProfiles: any}>(
        BACKEND_URL
      )
      .pipe(
        map((profileData) => {
          return { profiles: profileData.profiles.map((profile) => {
            return {
              id: profile._id,
              logopath: profile.logopath,
              name: profile.name,
              website: profile.website,
              number: profile.number,
              workfield: profile.workfield,
              services: profile.services,
              year: profile.year,
              location: profile.location,
              creator: profile.creator
            };
          }),
          maxProfiles: profileData.maxProfiles
          };
      }))
      .subscribe(transformedprofileData => {
        console.log(transformedprofileData);
        this.profiles = transformedprofileData.profiles; // We don't need to duplicate because we can't change it in the server
        this.profilesUpdated.next({
        profiles: [...this.profiles], profileCount: transformedprofileData.maxProfiles});
      });
  }



  getProfileUpdateListener() {
    return this.profilesUpdated.asObservable();  // returns an object to which we can listen but not emit
  }

  getProfile(id: string) {
    return this.http.get<{
      _id: string;
      logopath: string;
      name: string;
      website: string;
      number: string;
      workfield: string;
      services: string;
      year: string;
      location: string;
      creator: string;
    }>(
      BACKEND_URL + id
    );
  }


  addProfile(logo: File, name: string, website: string, number: string, workfield: string, services: string, year: string, location: string) {
    const profileData = new FormData();
    profileData.append('logo', logo, name);
    profileData.append('name', name);
    profileData.append('website', website);
    profileData.append('number', number);
    profileData.append('workfield', workfield);
    profileData.append('services', services);
    profileData.append('year', year);
    profileData.append('location', location);

    console.log('Data is here');
    this.http
    .post<{ message: string, profile: Profile }>( BACKEND_URL, profileData)
      .subscribe(responseData => {
        console.log("Image patched");
      });   // Nothing will happen if we don't subscribe
  
      this.authService.updateAuthData('true');
    

  }


  updateProfile( id: string, logo: File | string, name: string, website: string, number: string, workfield: string, services: string, year: string, location: string ) {
    let profileData: Profile | FormData;
    // const profile: profile = { id: id, title: title, content: content, number: number;
    if (typeof(logo) === 'object') {   // If the img is a file we create a formData object
      profileData = new FormData();
      profileData.append('id', id);
      profileData.append('logo', logo, name);
      profileData.append('name', name);
      profileData.append('website', website);
      profileData.append('number', number);
      profileData.append('workfield', workfield);
      profileData.append('services', services);
      profileData.append('year', year);
      profileData.append('location', location);
    } else {
      profileData  = {  // If the img is a string we send normal json data
        id: id,
        logopath: logo,
        name: name,
        website: website,
        number: number,
        workfield: workfield,
        services: services,
        year: year,
        location: location,
        creator:null
      };
    }
    const profile: Profile = {id: id, logopath: null, name: name, website: website, number: number, workfield: workfield, services: services, year: year, location: location, creator: null};
    this.http
    .put(BACKEND_URL + id, profileData)
    .subscribe(response => {
      this.router.navigate(['/']); // We navigate to profile-create-component and ngOnInit() fetches the profiles
    });
  }




  deleteprofile(profileId: string) {
    return this.http
    .delete(BACKEND_URL + profileId);
  }
}

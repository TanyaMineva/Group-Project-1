import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Profile } from '../profile/profile.model';

const BACKEND_URL = environment.apiUrl + '/profile';

@Injectable({providedIn: 'root'})  // It provides this on the root level
                                   // Angular finds it
                                   // Only creates one instance of the service fot he entire app
export class ProfileService {
  private profiles: Profile[] = [];
  private profiles2: Profile;
  private profilesUpdated = new Subject<{profiles: Profile[], profileCount: number}>();
  private profilesUpdated2 = new Subject<{profiles2: Profile}>();

  constructor(private http: HttpClient, private router: Router) {}

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
              name: profile.name,
              location: profile.location,
              logo: profile.logo,
              number: profile.number,
              website: profile.website,
              services: profile.services,
              workfield: profile.workfield,
              year: profile.year
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
    // return [...this.profiles];  // We copy the array so that we don't change the original one. This happends with [...arrayToBeCopied]
    this.http
      .get<{message: string, profiles2: any}>(
        BACKEND_URL
      )
      .pipe(
        map((profileData) => {
          return { profiles2: profileData.profiles2.map((profile) => {
            return {
              id: profile._id,
              name: profile.name,
              location: profile.location,
              logo: profile.logo,
              number: profile.number,
              website: profile.website,
              services: profile.services,
              workfield: profile.workfield,
              year: profile.year
            };
          }),
          };
      }))
      .subscribe(transformedprofileData => {
        console.log(transformedprofileData);
        this.profiles2 = transformedprofileData.profiles2; // We don't need to duplicate because we can't change it in the server
        this.profilesUpdated2.next({
          profiles2: this.profiles2});
      });
  }



  getProfileUpdateListener() {
    return this.profilesUpdated2.asObservable();  // returns an object to which we can listen but not emit
  }

  getProfile(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      location: string;
      number: string;
      workfield: string;
      website: string;
      services: string;
      logo: string;
      year: string;
    }>(
      BACKEND_URL + id
    );
  }


  addProfile(name: string, location: string, number: string, workfield: string, services: string, year: string,website: string, logo: File) {
    const profileData = new FormData();
    profileData.append('name', name);
    profileData.append('location', location);
    profileData.append('number', number);
    profileData.append('workfield', workfield);
    profileData.append('services', services);
    profileData.append('year', year);
    profileData.append('website', website);
    profileData.append('logo', logo);
    this.http
    .post<{ message: string, profile: Profile }>(
      BACKEND_URL,
      profileData)
      .subscribe(responseData => {
        console.log("Image patched");
        this.router.navigate(['/']); // We navigate to profile-create-component and ngOnInit() gets the profiles
      });   // Nothing will happen if we don't subscribe
  }


  updateProfile( id: string, name: string, location: string, number: string, workfield: string, services: string, year: string,website: string, logo: File | string ) {
    let profileData: Profile | FormData;
    // const profile: profile = { id: id, title: title, content: content, number: number;
    if (typeof(logo) === 'object') {   // If the img is a file we create a formData object
      profileData = new FormData();
      profileData.append('id', id);
      profileData.append('name', name);
      profileData.append('location', location);
      profileData.append('number', number);
      profileData.append('workfield', workfield);
      profileData.append('services', services);
      profileData.append('year', year);
      profileData.append('website', website);
      profileData.append('logo', logo);
    } else {
      profileData  = {  // If the img is a string we send normal json data
        id: id,
        name: name,
        location: location,
        number: number,
        workfield: workfield,
        services: services,
        year: year,
        website: website,
        logo: logo,
      };
    }
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

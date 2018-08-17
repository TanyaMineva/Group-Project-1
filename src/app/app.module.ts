import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostModule } from './posts/posts.module';
import { EditMyProfileComponent } from './profile/edit-profile/edit-myprofile.component';
import { ViewMyProfileComponent } from './profile/view-profile/view-myprofile.component';
import { ContactComponent } from './contact/contact.component';

// import { PostService } from './posts/posts.service';

@NgModule({
  // We declare the classes
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    EditMyProfileComponent,
    ViewMyProfileComponent,
    ContactComponent
  ],
  imports: [
    // We import the components
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostModule,
    MatInputModule
  ],
  // providers: [PostService],                   // providers are used for services
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Dont overwrite interceptors, add an additional one
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}

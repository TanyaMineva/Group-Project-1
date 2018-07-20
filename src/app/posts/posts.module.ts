import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostCreateComponent } from './post-create/post-create.component';
import { ProfileListComponent } from './post-list/profile-list.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule ({
  declarations: [
    PostCreateComponent,
    ProfileListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule
  ]
})

export class PostModule {}

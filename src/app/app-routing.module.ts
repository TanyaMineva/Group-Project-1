import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileListComponent } from './posts/post-list/profile-list.component';
import { AuthGuard } from './auth/auth.guard';
import { EditMyProfileComponent } from './profile/edit-profile/edit-myprofile.component';
import { ViewMyProfileComponent } from './profile/view-profile/view-myprofile.component';
import { ContactComponent } from './contact/contact.component';


const routes: Routes = [
  { path: '', component: ProfileListComponent },
  //{ path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  //{ path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'edit/:profileId', component: EditMyProfileComponent, canActivate: [AuthGuard]  },
  { path: 'edit', component: EditMyProfileComponent  },
  { path: 'contact', component: ContactComponent  },
  { path: 'profile', component: ViewMyProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}


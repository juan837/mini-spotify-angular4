import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import user
import { UserEditComponent } from './components/user-edit/user-edit.component';

// import artist
import { ArtistListComponent } from './components/artist-list/artist-list.component';

// import home
import { HomeComponent } from './components/home/home.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artists/:page', component: ArtistListComponent},
  {path: 'my-profile', component: UserEditComponent},
  {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

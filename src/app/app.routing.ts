import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import user
import { UserEditComponent } from './components/user-edit/user-edit.component';

// import artist
import { ArtistListComponent } from './components/artist-list/artist-list.component';

// import home
import { HomeComponent } from './components/home/home.component';

// import artist
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artist/new', component: ArtistAddComponent},
  {path: 'artists/:page', component: ArtistListComponent},
  {path: 'artist/:id', component: ArtistDetailComponent},
  {path: 'edit-artist/:id', component: ArtistEditComponent},
  {path: 'my-profile', component: UserEditComponent},
  {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// import user
import { UserEditComponent } from "./components/user-edit/user-edit.component";

// import artist
import { ArtistListComponent } from "./components/artist-list/artist-list.component";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/artists/1',
    pathMatch: 'full'
  },
  {path: '', component: ArtistListComponent},
  {path: 'artists/:page', component: ArtistListComponent},
  {path: 'my-profile', component: UserEditComponent},
  {path: '**', component: ArtistListComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

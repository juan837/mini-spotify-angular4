import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  providers: [UserService, ArtistService]
})
export class ArtistListComponent implements OnInit {
  public titulo: string;
  public artists: Artist[];
  public identity;
  public token;
  public url: string;
  public artists$: Observable<Artist[]>;
  public next_page;
  public prev_page;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService) {
      this.titulo = 'Artista';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.next_page = 1;
      this.prev_page = 1;

      console.log('Identity ', this.identity);
    }

  ngOnInit() {
    // console.log('Lista de artista cargados');
    this.getArtists();
  }

  getArtists() {
    this._route.params.forEach((params: Params) => {
      // el + convierte el valor en un numero
      let page = +params['page'];
      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;
        // verificamos que no lleguemos a un valor negativo
        if (this.prev_page === 0) {
          this.prev_page = 1;
        }
      }

      this._artistService.getArtists(this.token, page).subscribe(
        response => {
          if (!response.artists) {
            this._router.navigate(['/']);
          } else {
            this.artists = response.artists;
            console.log('List Artists', this.artists);
          }
        },
        error => {
          const errorMessage = <any>error;

          if (errorMessage != null) {
            const body = JSON.parse(error._body);

            console.log(error);
          }
        }
      );
    });
  }

}

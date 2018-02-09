import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';

import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.sass'],
  providers: [ArtistService, UserService]
})
export class ArtistDetailComponent implements OnInit {
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  public artistForm: FormGroup;

  public filesToUpload: Array<File>;

  constructor(
    private _artistService: ArtistService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private fb: FormBuilder) {
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
    }

  ngOnInit() {
    this.getArtist();
  }

  getArtist() {
    // reccorremos los parametros de la ruta y obtenemos el que se identifique con id
    this._route.params.forEach((params: Params) => {
      const id = params['id'];
      // obtiene el artista
      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if (!response.artist) {
            this._router.navigate(['/']);
          } else {
            this.artist = response.artist;
            // rellenar el Formulario con el artista encontrado
            this.artistForm.setValue({
              name: this.artist.name,
              description: this.artist.description,
              image: this.artist.image
            });
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

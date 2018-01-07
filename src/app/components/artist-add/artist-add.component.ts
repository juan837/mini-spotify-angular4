import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';

import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css'],
  providers: [ArtistService, UserService]
})
export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  // public artists: Artist[];
  public identity;
  public token;
  public url: string;
  public alertMessage;

  public artistForm: FormGroup;

  constructor(
    private _artistService: ArtistService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private fb: FormBuilder) {
      this.titulo = 'Agregar Artista';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;

      this.artist = new Artist('', '', '', '', '');

      console.log('Identity ', this.identity);
    }

  ngOnInit() {
    // Validaciones del formulario
    this.artistForm = this.fb.group({
      name: [this.artist.name, [Validators.required]],
      // surname: [this.artist.surname, [Validators.required]],
      description: [this.artist.description, [Validators.required]],
      // image: [this.artist.image, [Validators.required]],
    });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.artist.name = form.value.name;
      // this.artist.surname = form.value.surname;
      this.artist.description = form.value.description;

      this._artistService.addArtist(this.token, this.artist).subscribe(
        response => {
          if (!response.artist) {
            this.alertMessage = 'Error en el servidor';
          } else {
            this.alertMessage = 'El Artista se ha creado correctamente';
            this.artist = response.artist;
            // this._router.navigate(['/edit-artist'], response.artist._id);
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
    }
  }
}

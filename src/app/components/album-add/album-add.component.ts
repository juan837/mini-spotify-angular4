import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';

import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album';

@Component({
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.sass'],
  providers: [ArtistService, UserService, AlbumService]
})
export class AlbumAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  public albumForm: FormGroup;

  public filesToUpload: Array<File>;

  constructor(
    private _artistService: ArtistService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private fb: FormBuilder) {
      this.titulo = 'Crear un Nuevo Album';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.album = new Album('', '', '', 2018, '', '');
  }

  ngOnInit() {
    this.albumForm = this.fb.group({
      title: [this.album.title, [Validators.required]],
      description: [this.album.description, [Validators.required]],
      year: [this.album.year, [Validators.required]],
    });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this._route.params.forEach((params: Params) => {
        this.album = form.value;
        // obtener ID pasado por parametro
        const artist_id = params['id'];
        this.album.artist = artist_id;
        console.log('Album variables ', this.album);
        this._albumService.addAlbum(this.token, this.album).subscribe(
          response => {

            if (!response.album) {
              this.alertMessage = 'Error en el servidor';
            } else {
              this.alertMessage = 'El Album se ha creado correctamente';
              this.album = response.album;
              // this._router.navigate(['/edit-artist', response.artist._id]);
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

}

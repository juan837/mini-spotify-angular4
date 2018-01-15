import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { Artist } from '../../models/artist';

import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-artist-edit',
  templateUrl: '../artist-add/artist-add.component.html',
  styleUrls: ['./artist-edit.component.sass'],
  providers: [ArtistService, UserService, UploadService]
})
export class ArtistEditComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit: boolean;

  public artistForm: FormGroup;

  public filesToUpload: Array<File>;

  constructor(
    private _artistService: ArtistService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
    private fb: FormBuilder) {
      this.titulo = 'Editar Artista';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.is_edit = true;

      this.artist = new Artist('', '', '', '', '');
    }

  ngOnInit() {
    this.artistForm = this.fb.group({
      name: [this.artist.name, [Validators.required]],
      description: [this.artist.description, [Validators.required]],
      image: [this.artist.image, [Validators.required]],
    });

    this.getArtist();
    // Validaciones del formulario
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

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.artist.name = form.value.name;
      // this.artist.surname = form.value.surname;
      this.artist.description = form.value.description;

      this._artistService.editArtist(this.token, this.artist._id, this.artist).subscribe(
        response => {
          if (!response.artist) {
            this.alertMessage = 'Error en el servidor';
          } else {
            this.alertMessage = 'El Artista se ha actualizado correctamente';

            // Subir imagen del artista
            this._uploadService.makeFileRequest(
              this.url + 'upload-image-artist/' + this.artist._id, [],
              this.filesToUpload,
              this.token, 'image')
              .then(
                (result) => {

                },
                (error) => {
                  this._router.navigate(['/artist', 1]);
                }
              );
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

  // llamar al haber cambio en el input file
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}

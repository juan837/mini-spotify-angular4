import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { Artist } from '../../models/artist';

import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album';

@Component({
  selector: 'app-album-edit',
  templateUrl: '../album-add/album-add.component.html',
  styleUrls: ['./album-edit.component.sass'],
  providers: [UserService, AlbumService, UploadService]
})
export class AlbumEditComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;

  public albumForm: FormGroup;

  public filesToUpload: Array<File>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _uploadService: UploadService,
    private fb: FormBuilder) {
      this.titulo = 'Editar Album';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.album = new Album('', '', '', 2018, '', '');
      this.is_edit = true;
  }

  ngOnInit() {
    this.albumForm = this.fb.group({
      title: [this.album.title, [Validators.required]],
      description: [this.album.description, [Validators.required]],
      year: [this.album.year, [Validators.required]],
    });
    // Obtener album
    this.getAlbum();
  }

  getAlbum() {
    this._route.params.forEach((params: Params) => {
      const id = params['id'];

      this._albumService.getAlbum(this.token, id).subscribe(
        response => {

          if (!response.album) {
            this._router.navigate(['/']);
          } else {
            this.album = response.album;
            this.albumForm = this.fb.group({
              title: [this.album.title, [Validators.required]],
              description: [this.album.description, [Validators.required]],
              year: [this.album.year, [Validators.required]],
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
      this._route.params.forEach((params: Params) => {
        this.album = form.value;
        const id = params['id'];

        this._albumService.editAlbum(this.token, id, this.album).subscribe(
          response => {
            if (!response.album) {
              this.alertMessage = 'Error en el servidor';
            } else {
              this.alertMessage = 'El Album se ha actualizado correctamente';

              // verifico que hay algun archivo para subir
              if (!this.filesToUpload) {
                this._router.navigate(['/artist', response.album.artist]);
              } else {
                // upload image
              this._uploadService.makeFileRequest(
                this.url + 'upload-image-album/' + id, [],
                this.filesToUpload,
                this.token, 'image')
                .then(
                  (result) => {
                    this._router.navigate(['/artist', response.album.artist]);
                  },
                  (error) => {
                    this._router.navigate(['/artist', 1]);
                  }
                );
              }
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

  // llamar al haber cambio en el input file
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}

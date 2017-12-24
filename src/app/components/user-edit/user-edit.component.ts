import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import 'rxjs/add/operator/toPromise';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [
    UserService
  ]
})
export class UserEditComponent implements OnInit {
  // user model
  public user: User;
  public identity;
  public token;
  public title;
  public alertUpdate;

  public userEditForm: FormGroup;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(
    private _userService: UserService,
    private fb: FormBuilder
  ) {
    this.title = 'Actualizar mis datos';
    // Obtener informacion del usuario, si se guardo en el localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;

    console.log(this.user);
   }

  ngOnInit() {
    console.log('user-edit load');

    this.userEditForm = this.fb.group({
      name: [this.user.name, [Validators.required]],
      // image: [this.user.image, [Validators.required]],
      surname: [this.user.surname, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
  }

  onSubmitUpdate(form: FormGroup) {
    if (form.valid) {
      console.log(form);
      this.user.name = form.value.name;
      this.user.surname = form.value.surname;
      this.user.email = form.value.email;

      this._userService.update_user(this.user).subscribe(
        response => {
          if (!response.user) {
            this.alertUpdate = 'El usuario no se ha actualizado correctamente';
          } else {
            this.user = response.user;
            localStorage.setItem('identity', JSON.stringify(response.user));
            // actualizo el nombre de la cabecera
            document.getElementById('identity_name').innerHTML = this.user.name;

            if (!this.filesToUpload) {
              // Redireccion
            } else {
              console.log('makeFileRequest');
              this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
                (result: any) => {
                  // TODO verificar porque no esta accesando a esta parte del codigo
                  console.log('Result makeFileRequest', result);
                  this.user.image = result.image;
                  localStorage.setItem('identity', JSON.stringify(response.user));
                  console.log(this.user);
                }
              ).catch(e => {
                console.log(e);
              });
            }

            this.alertUpdate = 'El usuario se ha actualizado correctamente';
          }
        },
        err => {
          const errorMessage = <any>err;
          if (errorMessage != null) {
            const body = JSON.parse(err._body);
            this.alertUpdate = body.message;
            console.log(err);
          }
        }
      );
    }
  }

  // cargar imagenes al actualizar el file input
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    const token = this.token;

    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(xhr.response);
        }
      };
    });

    // return promise;
  }

}

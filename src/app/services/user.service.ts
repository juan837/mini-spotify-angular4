import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global';

@Injectable()
export class UserService {
  public url: string;
  public identity;
  public token;



  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  // metodo para loguearse
  // si gethash es null devuelve la informacion del usuario
  // si gethast tiene algun valor devuelve el token del usuario
  signup(user_login, getHash = null) {
    if (getHash != null) {
      user_login.gethash = getHash;
    }

    const json = JSON.stringify(user_login);
    const params = json;

    const headers = new Headers({'Content-Type': 'application/json'});

    return this._http
                .post(this.url + 'login', params, {headers: headers})
                .map(res => res.json());
  }

  // metodo para registrar nuevo usuario
  register(user_register) {
    const params = JSON.stringify(user_register);

    const headers = new Headers({'Content-Type': 'application/json'});

    return this._http
                .post(this.url + 'register', params, {headers: headers})
                .map(res => res.json());
  }

  // verificar si existe alguna session en localStorage
  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity'));

    if (identity !== 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  // obtener el token del localStorage
  getToken() {
    const token = localStorage.getItem('token');

    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }
}

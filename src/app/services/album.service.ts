import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global';
import { Album } from '../models/album';
// import { RequestOptions } from '@angular/http/src/base_request_options';

@Injectable()
export class AlbumService {
  public url: string;
  public identity;
  public token;



  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getAlbum(token, id: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    const options = new RequestOptions({headers: headers});
    return this._http.get(this.url + 'album/' + id, options).map(res => res.json());
  }

  addAlbum(token, album: Album) {
    const params = JSON.stringify(album);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url + 'album', params, {headers: headers})
                      .map(res => res.json());
  }

  editAlbum(token, id: string, album: Album) {
    const params = JSON.stringify(album);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + 'album/' + id, params, {headers: headers})
                      .map(res => res.json());
  }

}

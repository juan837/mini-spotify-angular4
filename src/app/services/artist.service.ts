import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';
// import { RequestOptions } from '@angular/http/src/base_request_options';

@Injectable()
export class ArtistService {
  public url: string;
  public identity;
  public token;



  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getArtists(token, page) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    const options = new RequestOptions({headers: headers});
    return this._http.get(this.url + 'artists/' + page, options)
                      .map(res => res.json());
  }

  getArtist(token, id: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    const options = new RequestOptions({headers: headers});
    return this._http.get(this.url + 'artist/' + id, options)
                      .map(res => res.json());
  }



  addArtist(token, artist: Artist) {
    const params = JSON.stringify(artist);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url + 'artist', params, {headers: headers})
                      .map(res => res.json());
  }

  editArtist(token, id: string, artist: Artist) {
    const params = JSON.stringify(artist);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + 'artist/' + id, params, {headers: headers})
                      .map(res => res.json());
  }

  deleteArtist(token, id: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    const options = new RequestOptions({headers: headers});
    return this._http.delete(this.url + 'artist/' + id, options)
                      .map(res => res.json());
  }

}

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global';

@Injectable()
export class UploadService {
  public url: string;
  public identity;
  public token;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  // subir un archivo al servidor
  public makeFileRequest(url: string,
                  params: Array<string>,
                  files: Array<File>,
                  token: string,
                  name: string) {

    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append(name, files[i], files[i].name);
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

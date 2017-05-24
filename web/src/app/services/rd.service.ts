import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable, NgZone } from '@angular/core';
import * as socket from 'socket.io-client';
import * as sails from 'sails.io.js';

const io = sails(socket);

@Injectable()
export class RdService {
  serverUrl: string;
  model: string;
  options: any = {
    post: true,
    put: true,
    delete: true,
  };
  data: any[] = [];
  public users: Observable<any[]> = Observable.of(this.data);

  constructor(private _http: Http, private _zone: NgZone) {
    io.sails.environment = 'production';
  }

  use(serverUrl: string, model: string, options?: any) {
    this.model = model;
    this.serverUrl = serverUrl;
    io.sails.url = this.serverUrl;
    io.socket.get(`/${this.model}/subscribe`);

    if (options) {
      this.options = {
        post: options.includes('post'),
        put: options.includes('put'),
        delete: options.includes('delete')
      };
    }
  }

  load(url = `${this.serverUrl}/${this.model}`): Observable<any[]> {
    this._http.get(url)
      .map(res => res.json().data)
      .subscribe(results => this.data.push(...results));

    if (this.options.post) {
      io.socket.on('post', entry => {;
        this._zone.run(() => {
          this.data.push(entry);
        });
      });
    }

    if (this.options.put) {
      io.socket.on('put', entry => {;
        this._zone.run(() => {
          const index = this.getIndex(entry);
          if (index > -1) {
            this.data[index] = entry;
          }
        });
      });
    }

    if (this.options.delete) {
      io.socket.on('delete', entry => {
        this._zone.run(() => {
          entry.forEach(item => {
            const index = this.getIndex(item);
            if (index > -1) {
              this.data.splice(index, 1);
            }
          });
        });
      });
    }

    return this.users;
  }

  getIndex(entry: any) {
    let i;
    let found = false;
    for (i = 0; i < this.data.length; i++) {
      if (entry.id === this.data[i].id) {
        found = true;
        break;
      }
    }
    return found ? i : -1;
  }

  post(entry: any) {
    return this._http.post(`${this.serverUrl}/${this.model}`, entry)
      .map(res => res.json());
  }

  put(entry: any) {
    return this._http.put(`${this.serverUrl}/${this.model}/${entry.id}`, entry)
      .map(res => res.json());
  }

  delete(id: any) {
    return this._http.delete(`${this.serverUrl}/${this.model}/${id}`)
      .map(res => res.json());
  }
}

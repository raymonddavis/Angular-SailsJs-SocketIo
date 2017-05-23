import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable, NgZone } from '@angular/core';
import * as socket from 'socket.io-client';
import * as sails from 'sails.io.js';

const io = sails(socket);

@Injectable()
export class RdService {
  SERVER_URL = 'http://localhost:3000';
  model: string;
  options: any = {
    post: true,
    put: true,
    delete: true,
  };
  data: any[] = [];
  public users: Observable<any[]> = Observable.of(this.data);

  constructor(private _http: Http, private _zone: NgZone) {
    io.sails.url = this.SERVER_URL;
  }

  use(model: string, options?: any) {
    this.model = model;
    io.socket.get(`/${this.model}/subscribe`);

    if(options) {
      this.options = {
        post: options.includes('post'),
        put: options.includes('put'),
        delete: options.includes('delete')
      };
    }
  }

  load(): Observable<any[]> {
    this._http.get(`${this.SERVER_URL}/${this.model}?limit=100`)
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
}

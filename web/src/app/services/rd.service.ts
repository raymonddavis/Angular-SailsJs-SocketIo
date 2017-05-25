import { element } from 'protractor';
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
  loaded = false;
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

  length() {
    return this.data.length;
  }

  load(url = `${this.serverUrl}/${this.model}`): Observable<any[]> {
    this._http.get(url)
      .map(res => res.json().data)
      .subscribe(results => {
        if (results.length < this.data.length) {
          this.data.splice(results.length, this.data.length);
        }

        results.forEach((element, index) => {
          this.data[index] = element;
        });
      });

    if (this.options.post) {
      io.socket.on('post', entry => {;
        this._zone.run(() => {
          this._http.get(url)
            .map(res => res.json().data)
            .subscribe(results => {
              results.forEach(item => {
                const index = this.getIndex(item, this.data);
                if (index === -1) {
                  this.data.push(item);
                }
              });
            });
        });
      });
    }

    if (this.options.put) {
      io.socket.on('put', entry => {;
        this._zone.run(() => {
          const index = this.getIndex(entry, this.data);
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
            this._http.get(url)
              .map(res => res.json().data)
              .subscribe(results => {
                this.data.forEach((element, index) => {
                  const foundIndex = this.getIndex(element, results);
                  if (foundIndex === -1) {
                    this.data.splice(index, 1);
                  }
                });
              });
          });
        });
      });
    }

    return this.users;
  }

  getIndex(entry: any, array: any) {
    let i;
    let found = false;
    for (i = 0; i < array.length; i++) {
      if (entry.id === array[i].id) {
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

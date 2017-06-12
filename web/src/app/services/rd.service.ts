import { element } from 'protractor';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable, NgZone } from '@angular/core';
import * as socket from 'socket.io-client';
import * as sails from 'sails.io.js';

const io = sails(socket);
io.sails.autoConnect = false;
io.sails.environment = 'production';

@Injectable()
export class RdService {
  url: string;
  port: number;
  model: string;
  methods: any = {
    post: true,
    put: true,
    delete: true,
  };
  loaded = false;
  data: any[] = [];
  table: Observable<any[]> = Observable.of(this.data);

  constructor(private _http: Http, private _zone: NgZone) { }

  use(settings?: any) {
    this.url = settings.url;
    this.port = settings.port;
    this.model = settings.model;

    if (settings.methods) {
      this.methods = {
        put: settings.methods.includes('put'),
        post: settings.methods.includes('post'),
        delete: settings.methods.includes('delete'),
      };
    }

    io.sails.url = `${this.url}${this.port ? ':' + this.port : ''}`;
    io.socket = io.sails.connect();
    io.socket.get(`/${this.model}/subscribe`);
  }

  length() {
    return this.data.length;
  }

  private updateData(url: string) {
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
  }

  load(url = `${this.url}${this.port ? ':' + this.port : ''}/${this.model}`): Observable<any[]> {
    this.updateData(url);

    if (this.methods.post) {
      io.socket.on('post', entry => {
        ;
        this._zone.run(() => {
          this.updateData(url);
        });
      });
    }

    if (this.methods.put) {
      io.socket.on('put', entry => {
        ;
        this._zone.run(() => {
          const index = this.getIndex(entry, this.data);
          if (index > -1) {
            this.data[index] = entry;
          }
        });
      });
    }

    if (this.methods.delete) {
      io.socket.on('delete', entry => {
        this._zone.run(() => {
          this.updateData(url);
        });
      });
    }

    return this.table;
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
    return this._http.post(`${this.url}${this.port ? ':' + this.port : ''}/${this.model}`, entry)
      .map(res => res.json());
  }

  put(entry: any) {
    return this._http.put(`${this.url}${this.port ? ':' + this.port : ''}/${this.model}/${entry.id}`, entry)
      .map(res => res.json());
  }

  delete(id: any) {
    return this._http.delete(`${this.url}${this.port ? ':' + this.port : ''}/${this.model}/${id}`)
      .map(res => res.json());
  }
}

import { Http } from '@angular/http';
import { RdService } from './../../services/rd.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  error: string = undefined;
  success: string = undefined;
  canDelete = false;
  selected: any;
  users: Observable<any[]>;

  route = '';

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(public USER: RdService, private http: Http) {
    /**
     * By default you need to supply url and model.
     * Port is not required
     * Methods is not required but needs to be an array of what methods to watch.
     * By default all the method are true, if you supply an empty array it will turn all to false.
     */
    this.USER.use({
      url: 'http://localhost',
      model: 'users',
      port: 3000,
      methods: [
        'post',
        'put',
        'delete'
      ],
    });
  }

  ngOnInit() {
    /**
     * By default it will load from `${this.serverUrl}/${this.model}` but you can you whatever custom route you have.
     * Just pass the custom route into the load function as a string.
     */
    this.users = this.USER.load();
  }

  changeData() {
    if (!this.route) {
      this.users = this.USER.load('http://localhost:3000/users?limit=5');
      this.route = 'http://localhost:3000/users?limit=5';
    } else {
      this.users = this.USER.load();
      this.route = '';
    }
  }

  select(entry: any) {
    this.canDelete = true;
    this.form.controls['username'].setValue(entry.username);
    this.form.controls['password'].setValue(entry.password);
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.selected = entry;
  }

  clear() {
    this.canDelete = false;
    this.selected = undefined;
    this.form.reset();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  goOnline() {
    this.selected.online = true;
    this.USER.put(this.selected).subscribe(res => {
      this.success = 'Set Online!';
      setTimeout(() => this.success = undefined, 5000);
    }, error => {
      error = JSON.parse(error._body);

      this.error = error;
      setTimeout(() => this.error = undefined, 5000);
    });
  }

  goOffline() {
    this.selected.online = false;
    this.USER.put(this.selected).subscribe(res => {
      this.success = 'Set Offline!';
      setTimeout(() => this.success = undefined, 5000);
    }, error => {
      error = JSON.parse(error._body);

      this.error = error;
      setTimeout(() => this.error = undefined, 5000);
    });
  }

  post() {
    this.error = undefined;
    this.USER.post(this.form.value).subscribe(res => {
      this.success = 'Posted!';
      setTimeout(() => this.success = undefined, 5000);
    }, error => {
      error = JSON.parse(error._body);

      this.error = error;
      setTimeout(() => this.error = undefined, 5000);
    });
    this.clear();
  }

  delete() {
    this.USER.delete(this.selected.id).subscribe(res => {
      this.success = 'Deleted!';
      setTimeout(() => this.success = undefined, 5000);
    }, error => {
      error = JSON.parse(error._body);

      this.error = error;
      setTimeout(() => this.error = undefined, 5000);
    });
    this.clear();
  }
}

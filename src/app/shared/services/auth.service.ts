import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  url='http://localhost:3000/api/v1';
  constructor(public _http:HttpClient) { }
  isLoggedIn(){
    return !!(localStorage.getItem('food-subs-jwt'));
  }

  logout(){
    localStorage.removeItem('food-subs-jwt');
  }
  getLoginDialog(){
    return this._http.get(`${this.url}/gettwitterDailog`);
  }
  validatedUser(data){
    return this._http.post(`${this.url}/getUser`,data);
  }
}

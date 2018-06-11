import { Component, } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { Response} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from './shared/services/cookie.service';

declare var window:any;
declare var jQuery:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(public _authService:AuthService,
        public _fb:FormBuilder,
        public route : ActivatedRoute,
      public _cookieService:CookieService){}

  loginForm:FormGroup;
  authType='log_in';
  ngOnInit(){
    this.loginForm=this._fb.group({
      'email':['',[Validators.required]],
      'password':['',[Validators.required]]
    });
    this.route.queryParams.subscribe((params:Params) => {
        console.log(params);
        if(params['oauth_token'] && params['oauth_verifier']){
          this._authService.validatedUser(params).subscribe((data:Response)=>{
            alert(JSON.stringify(data));
            this._cookieService.createCookie('twitterEntries',JSON.stringify(params),3);            
          })
        }
    });     
  }
  login(credentials){
    console.log(credentials);
    localStorage.setItem('food-subs-jwt','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjcsImV4cCI6MTUyODY5NjMwMn0.Atrphgi2i7jcdGCsFGiHgvNTc7glCLhOlwsbAeKcdRo');
  }
  getTwitterDialog(){
    this._authService.getLoginDialog().subscribe((response:Response)=>{
      let result:any =response;
      let newWindow = window.open(result.link, 'Twitter Login', 'width=600, height=500,scrollbars=yes');
      if(!newWindow || newWindow.closed || typeof newWindow.closed=='undefined') {
        console.log("Popup Blocked..");
      }else{
        let _interval=setInterval(()=>{
          if(!!this._cookieService.readCookie('twitterEntries')){
            newWindow.close();
            this._cookieService.eraseCookie('twitterEntries');
            clearInterval(_interval);
          }
        },1000)
      }
    })
  }
}

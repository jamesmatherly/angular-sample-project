import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private cognitoService: CognitoService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // Extract authorization code from the URL
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      const state = params['state'];
      if (code) {
        try {
            // Store tokens securely (e.g., in local storage or secure cookies)
            //   console.log('Tokens:', tokens);
            const secure = false; // Set to true if you're serving over HTTPS
            const sameSite = 'None'; // You can use 'Lax' or 'None' based on your requirement
            
            this.cognitoService.handleAuthCode(code).subscribe(
                token => {
                    this.cookieService.set('accessToken', token.access_token, 1, '/', '', secure, sameSite);
                    window.location.href = state;
                });
            
        } catch (error) {
            console.error('Error handling auth code:', error);
        }
      }
      
    });
    
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private cognitoService: CognitoService
  ) {}

  ngOnInit(): void {
    // Extract authorization code from the URL
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      const state = params['state'];
      if (code) {
        try {
            this.cognitoService.handleAuthCode(code);
        } catch (error) {
            console.error('Error handling auth code:', error);
        }
      }
      
    });
    
  }
}

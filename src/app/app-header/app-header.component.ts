import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authListSub: Subscription;
  public autenticato: boolean;

  constructor(private authServ: AuthService) { }

  ngOnInit() {

    this.autenticato = this.authServ.getAuthStatus();

    this.authListSub = this.authServ.getAuthListner().subscribe(autenticato => {
      this.autenticato = autenticato;
    });
  }

  ngOnDestroy(): void {
    this.authListSub.unsubscribe();
  }

  onLogout() {
    this.authServ.logout();
  }
}

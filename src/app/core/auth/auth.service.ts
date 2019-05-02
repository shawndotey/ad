import { IAppAuthorization } from '../../shared/model/IAppAuthorization.interface';
import { Injectable} from '@angular/core';
import { AppAuthorization } from '../../shared/model/AppAuthorization.class';
import clone from 'clone';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authorizationChange$: Observable<IAppAuthorization>;

  private _authorizationChange$: BehaviorSubject<IAppAuthorization>;
  private _authorizationValues = new AppAuthorization();

  constructor() {

    this._authorizationChange$ = new BehaviorSubject(
      this.getCloneAuthorizationValues()
    );
    this.authorizationChange$ = this._authorizationChange$.asObservable();
  }

  public logout() {
    this._authorizationValues.isAuthenticated = false;
    this.triggerAuthorizationValueChange();
  }

  public login() {
    this._authorizationValues.isAuthenticated = true;
    this.triggerAuthorizationValueChange();
  }

  public get isAuthenticated(): boolean {
    return this._authorizationValues.isAuthenticated;
  }

  private getCloneAuthorizationValues(): IAppAuthorization {
    return clone(this._authorizationValues);
  }

  private triggerAuthorizationValueChange() {
    this._authorizationChange$.next(this.getCloneAuthorizationValues());
  }
}

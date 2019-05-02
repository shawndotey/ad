import { IAppAuthorization } from './IAppAuthorization.interface';
import { environment } from '../../../environments/environment';

export class AppAuthorization implements IAppAuthorization {
	constructor(ob?: IAppAuthorization) {
		Object.assign(this, ob);
	}
	public isAuthenticated: boolean = environment.loggedInOnStart;
}

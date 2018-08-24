import { IAppAuthorization } from "./IAppAuthorization.interface";

export class AppAuthorization implements IAppAuthorization{
	constructor(ob?:IAppAuthorization){
		Object.assign(this, ob);
	}

	public isAuthenticated:boolean = false;
}
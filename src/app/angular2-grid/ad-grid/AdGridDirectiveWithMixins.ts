import { AdGridDirectiveDragMixin } from "./AdGridDirectiveDragMixin";
import { AdGridDirectiveBase } from "./AdGridDirectiveBase";
import { AdGridDirectiveResizeMixin } from "./AdGridDirectiveResizeMixin";


export const TheMixins = AdGridDirectiveDragMixin(AdGridDirectiveResizeMixin(AdGridDirectiveBase));


export abstract class AdGridDirectiveWithMixins extends TheMixins {
	constructor(...args) {
		super(args[0], args[1], args[2], args[3]);
	}
}
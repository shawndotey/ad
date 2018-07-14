
import {  AdGridItemDirectiveResizeMixin } from "./AdGridItemDirectiveResizeMixin";
import { AdGridItemDirectiveBase } from "./AdGridItemDirectiveBase";
import {  AdGridItemDirectiveDragMixin } from "./AdGridItemDirectiveDragMixin";

const TheMixins = AdGridItemDirectiveDragMixin(AdGridItemDirectiveResizeMixin(AdGridItemDirectiveBase))

export abstract class AdGridItemDirectiveWithMixins extends TheMixins  {
  constructor(...args) {
  super(args[0], args[1], args[2], args[4]);
  }
 
}
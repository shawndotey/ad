import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ad-nav-item]'
})
export class AdNavItemDirective {

  constructor(private tpl: TemplateRef<any>) { }

}

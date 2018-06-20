import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ad-nav-nester]'
})
export class AdNavNesterDirective {

  constructor(private tpl: TemplateRef<any>) {

  }

}

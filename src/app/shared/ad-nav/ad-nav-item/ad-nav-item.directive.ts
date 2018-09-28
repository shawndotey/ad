import { Directive, TemplateRef, ContentChildren } from '@angular/core';
import { RouterLink } from '@angular/router';

@Directive({
  selector: '[ad-nav-item]'
})
export class AdNavItemDirective {

  constructor(private tpl: TemplateRef<any>) { 
   
  }
  @ContentChildren(RouterLink, {descendants:true}) linkRefs:RouterLink[];
  ngOnInit(): void {
   
  }
}

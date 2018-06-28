import { Directive, TemplateRef, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[ngGridItemDraghandle]'
})
export class NgGridItemDraghandleDirective {

  constructor() { 
console.log('NgGridItemDraghandleDirective initialized')

  }
  @Input('ngGridItemDraghandle') highlightColor: string;
}

import { Directive, TemplateRef, Input, ElementRef, HostBinding, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[ngGridItemDraghandle]'
})
export class NgGridItemDraghandleDirective {

  constructor(public element: ElementRef) {
    console.log('NgGridItemDraghandleDirective initialized')

  }
  @Input('ngGridItemDraghandle') highlightColor: string;

  @HostBinding('class.draggable') draggable = true;

  pointerId?: number;

  // to trigger pointer-events polyfill
  @HostBinding('attr.touch-action') touchAction = 'none';

  @Output() pointerDown = new EventEmitter<PointerEvent>();
  @Output() pointerUp = new EventEmitter<PointerEvent>();
  
  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<PointerEvent>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();

  @HostBinding('class.dragging') dragging = false;




  


  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    // added after YouTube video: ignore right-click
    if (event.button !== 0) {
      return;
    }
// console.log('pointer down', event.pointerId)
    this.pointerId = event.pointerId;
    this.dragging = true;
    this.pointerDown.emit(event);
    this.dragStart.emit(event);
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    
    if (!this.dragging || event.pointerId !== this.pointerId) {
      return;
    }
    // console.log('onPointerMove', event.pointerId, this.dragging )
    this.dragMove.emit(event);
  }

  // added after YouTube video: pointercancel
  @HostListener('document:pointercancel', ['$event'])
  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) {
      return;
    }
    
    this.pointerUp.emit(event);
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    this.dragEnd.emit(event);
    
  }


}

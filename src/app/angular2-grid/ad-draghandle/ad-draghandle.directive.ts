import { Directive, TemplateRef, Input, ElementRef, HostBinding, Output, HostListener, EventEmitter, Renderer } from '@angular/core';


@Directive({
  selector: '[adDraghandle]'
})
export class AdDraghandleDirective {
  private DEBUG_MODE = false;
  private pointermoveHandler:Function;
  private pointerupHandler:Function;
  private pointercancelHandler:Function;
  constructor(public element: ElementRef, private renderer: Renderer) {
   
  }
  @Input('AdGridItemDraghandle') highlightColor: string;

  @HostBinding('class.ad-draghandle-draggable') draggable = true;
  @HostBinding('class.ad-draghandle-hover') isMouseHovering:boolean = false;
  @HostBinding('class.ad-draghandle-dragging') dragging = false;

  // to trigger pointer-events polyfill
  @HostBinding('attr.touch-action') touchAction = 'none';

  @Output() handlePointerUp = new EventEmitter<PointerEvent>();
  @Output() handlePointerHoverMove = new EventEmitter<PointerEvent>();
  @Output() handlePointerHoverOut = new EventEmitter<PointerEvent>();
  @Output() handlePointerHoverIn = new EventEmitter<PointerEvent>();
  
  @Output() handleDragStart = new EventEmitter<PointerEvent>();
  @Output() handleDragMove = new EventEmitter<PointerEvent>();
  @Output() handleDragEnd = new EventEmitter<PointerEvent>();

  
  displayStats(eventName:string) {
    if (!this.DEBUG_MODE) return;
    console.log(eventName+'::', 'isMouseHovering:', this.isMouseHovering, 'dragging:', this.dragging)
  }
  
  @HostListener('mousedown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    // added after YouTube video: ignore right-click
    if (event.button !== 0) {
      return;
    }
    this.isMouseHovering = false;
    this.dragging = true;
    
    this.handleDragStart.emit(event);
    this.dragAsNeeded(event);
    this.displayStats('mousedown');
    this.startGlobalMouseDownListeners()
  }

  startGlobalMouseDownListeners() {

    this.pointermoveHandler = this.renderer.listenGlobal('document', 'pointermove', (event) => {
      this.displayStats('document:pointermove')
      this.dragAsNeeded(event);
    });
    this.pointerupHandler = this.renderer.listenGlobal('document', 'pointerup', (event) => {
      this.displayStats('document:pointerup')
      this.onPointerUp(event);
    });
    this.pointercancelHandler = this.renderer.listenGlobal('document', 'pointercancel', (event) => {
      this.displayStats('document:pointercancel')
      this.onPointerUp(event);
    });
  }
  stopGlobalMouseDownListeners() {

    !this.pointermoveHandler || this.pointermoveHandler();
    !this.pointerupHandler || this.pointerupHandler();
    !this.pointercancelHandler || this.pointercancelHandler();

  }
  @HostListener('mousemove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    this.mouseInAsNeeded(event);
    this.hoverAsNeeded(event);
    this.displayStats('mousemove');
  }
  private hoverAsNeeded(event: PointerEvent) {
    if (this.isMouseHovering) {
      this.handlePointerHoverMove.emit(event);
    }
  }
  private mouseInAsNeeded(event: PointerEvent){
    if(!this.isMouseHovering && !this.dragging){
      this.handlePointerHoverIn.emit(event);
      this.isMouseHovering = true;
     }
  }
  private dragAsNeeded(event: PointerEvent){
    if (this.dragging) {
      this.handleDragMove.emit(event);
    }
  }

  @HostListener('mouseout', ['$event'])
  onPointerMoveOut(event: PointerEvent): void {
    this.handlePointerHoverOut.emit(event);
    this.isMouseHovering = false;
    this.dragAsNeeded(event);
    this.displayStats('mouseout');
  }

  onPointerUp(event: PointerEvent): void {
    this.handlePointerUp.emit(event);
    this.stopGlobalMouseDownListeners();
    this.dragEndAsNeeded(event);
    this.displayStats('pointerup');
  }

  dragEndAsNeeded(event:PointerEvent){
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    this.handleDragEnd.emit(event);
  }

}

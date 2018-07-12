import { AdGridItemDraghandleDirective } from '../ad-grid-item-draghandle/ad-grid-item-draghandle.directive';
// import  * as AdGridItemUtility  from './../shared/AdGridHelpers';
import { EventEmitter, Output, ContentChildren, QueryList } from '@angular/core';
import { AdGridItemEvent } from "../model";
import { AdGridItemDirectiveBase } from "./AdGridItemDirectiveBase";
import { MixinConstructor } from '../shared/ExtendMixin';
import { hasSelectorFromStartToParentElement } from '../shared/AdGridHelpers';
// 

export function AdGridItemDirectiveDragMixin<T extends MixinConstructor<AdGridItemDirectiveBase>>(Base: T) {
	class Mixin extends Base  {
	  
	  constructor(...args: any[]) {
		super(...args)
	  }
	  @Output()
	  public onDragStop: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	  @Output()
	  public onDragAny: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	  @Output()
	  public onDragStart: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	  @Output()
	  public onDrag: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	   //	Public methods
	   public canDrag(e: any): boolean {
		if (!this.isDraggable) return false;
	  
		if (this._dragHandle) {
		  return hasSelectorFromStartToParentElement(
		  this._dragHandle,
		  e.target,
		  this._ngEl.nativeElement
		  );
		}
	  
		return true;
		}
	  public onDragStartEvent(): void {
		const event: AdGridItemEvent = this.getEventOutput();
		this.onDragStart.emit(event);
		this.onDragAny.emit(event);
		this.onChangeStart.emit(event);
		this.onChangeAny.emit(event);
	  }
	  public onDragEvent(): void {
		const event: AdGridItemEvent = this.getEventOutput();
		this.onDrag.emit(event);
		this.onDragAny.emit(event);
		this.onChange.emit(event);
		this.onChangeAny.emit(event);
	  }
	  public onDragStopEvent(): void {
		const event: AdGridItemEvent = this.getEventOutput();
		this.onDragStop.emit(event);
		this.onDragAny.emit(event);
		this.onChangeStop.emit(event);
		this.onChangeAny.emit(event);
		this.onConfigChangeEvent();
	  }
	  
	  public startMoving(): void {
		this._renderer.addClass(this._ngEl.nativeElement, "moving");
		const style: any = window.getComputedStyle(this._ngEl.nativeElement);
		if (this._AdGrid.autoStyle)
		  this._renderer.setStyle(
			this._ngEl.nativeElement,
			"z-index",
			(parseInt(style.getPropertyValue("z-index")) + 1).toString()
		  );
	  }
	
	  public stopMoving(): void {
		this._renderer.removeClass(this._ngEl.nativeElement, "moving");
		const style: any = window.getComputedStyle(this._ngEl.nativeElement);
		if (this._AdGrid.autoStyle)
		  this._renderer.setStyle(
			this._ngEl.nativeElement,
			"z-index",
			(parseInt(style.getPropertyValue("z-index")) - 1).toString()
		  );
	  }
	  public getDragHandle(): string {
		return this._dragHandle;
	  }
  }
  return Mixin;
}
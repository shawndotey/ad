import { NgGridItemDraghandleDirective } from './../ng-grid-item-draghandle/ng-grid-item-draghandle.directive';
import  * as NgGridItemUtility  from './../shared/NgGridHelpers';
import { EventEmitter, Output, ContentChildren, QueryList } from '@angular/core';
import { NgGridItemEvent } from "../model";
import { NgGridItemDirectiveBase } from "./NgGridItemDirectiveBase";
export abstract class NgGridItemDirectiveDragMixin extends NgGridItemDirectiveBase {
	
	
	@Output()
	public onDragStop: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onDragAny: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onDragStart: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onDrag: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	 //	Public methods
	 public canDrag(e: any): boolean {
		if (!this.isDraggable) return false;
	
		if (this._dragHandle) {
		  return NgGridItemUtility.hasSelectorFromStartToParentElement(
			this._dragHandle,
			e.target,
			this._ngEl.nativeElement
		  );
		}
	
		return true;
	  }
	public onDragStartEvent(): void {
		const event: NgGridItemEvent = this.getEventOutput();
		this.onDragStart.emit(event);
		this.onDragAny.emit(event);
		this.onChangeStart.emit(event);
		this.onChangeAny.emit(event);
	}
	public onDragEvent(): void {
		const event: NgGridItemEvent = this.getEventOutput();
		this.onDrag.emit(event);
		this.onDragAny.emit(event);
		this.onChange.emit(event);
		this.onChangeAny.emit(event);
	}
	public onDragStopEvent(): void {
		const event: NgGridItemEvent = this.getEventOutput();
		this.onDragStop.emit(event);
		this.onDragAny.emit(event);
		this.onChangeStop.emit(event);
		this.onChangeAny.emit(event);
		this.onConfigChangeEvent();
	}
	
	public startMoving(): void {
		this._renderer.addClass(this._ngEl.nativeElement, "moving");
		const style: any = window.getComputedStyle(this._ngEl.nativeElement);
		if (this._ngGrid.autoStyle)
		  this._renderer.setStyle(
			this._ngEl.nativeElement,
			"z-index",
			(parseInt(style.getPropertyValue("z-index")) + 1).toString()
		  );
	  }
	
	  public stopMoving(): void {
		this._renderer.removeClass(this._ngEl.nativeElement, "moving");
		const style: any = window.getComputedStyle(this._ngEl.nativeElement);
		if (this._ngGrid.autoStyle)
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
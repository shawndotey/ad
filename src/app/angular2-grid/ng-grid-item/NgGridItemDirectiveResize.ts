import { NgGridItemDirectiveBase } from "./NgGridItemDirectiveBase";
import { EventEmitter, Output } from '@angular/core';
import { NgGridItemEvent, NgGridItemSize, ResizeHandle, NgGridRawPosition } from "../model";
import  * as NgGridItemUtility  from './../shared/NgGridHelpers';

export abstract class NgGridItemDirectiveResizeMixin extends NgGridItemDirectiveBase {
	@Output()
	public onResizeStart: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onResize: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onResizeStop: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onResizeAny: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	public onResizeStartEvent(): void {
		const event: NgGridItemEvent = this.getEventOutput();
		this.onResizeStart.emit(event);
		this.onResizeAny.emit(event);
		this.onChangeStart.emit(event);
		this.onChangeAny.emit(event);
	}
	public onResizeEvent(): void {
		const event: NgGridItemEvent = this.getEventOutput();
		this.onResize.emit(event);
		this.onResizeAny.emit(event);
		this.onChange.emit(event);
		this.onChangeAny.emit(event);
	}
	public onResizeStopEvent(): void {
		const event: NgGridItemEvent = this.getEventOutput();
		this.onResizeStop.emit(event);
		this.onResizeAny.emit(event);
		this.onChangeStop.emit(event);
		this.onChangeAny.emit(event);
		this.onConfigChangeEvent();
	}
	public getResizeHandle(): ResizeHandle {
		return this._resizeHandle;
	  }
	  public canResize(e: any): string {
		if (!this.isResizable) return null;
	
		if (this._resizeHandle) {
		  if (typeof this._resizeHandle === "string") {
			return NgGridItemUtility.hasSelectorFromStartToParentElement(
			  this._resizeHandle,
			  e.target,
			  this._ngEl.nativeElement
			)
			  ? "bottomright"
			  : null;
		  }
	
		  if (typeof this._resizeHandle !== "object") return null;
	
		  const resizeDirections = [
			"bottomright",
			"bottomleft",
			"topright",
			"topleft",
			"right",
			"left",
			"bottom",
			"top"
		  ];
		  for (let direction of resizeDirections) {
			if (direction in this._resizeHandle) {
			  if (
				NgGridItemUtility.hasSelectorFromStartToParentElement(
				  this._resizeHandle[direction],
				  e.target,
				  this._ngEl.nativeElement
				)
			  ) {
				return direction;
			  }
			}
		  }
	
		  return null;
		}
	
		if (this._borderSize <= 0) return null;
	
		const mousePos: NgGridRawPosition = this._getMousePosition(e);
	
		if (
		  mousePos.left < this._elemWidth &&
		  mousePos.left > this._elemWidth - this._borderSize &&
		  mousePos.top < this._elemHeight &&
		  mousePos.top > this._elemHeight - this._borderSize
		) {
		  return "bottomright";
		} else if (
		  mousePos.left < this._borderSize &&
		  mousePos.top < this._elemHeight &&
		  mousePos.top > this._elemHeight - this._borderSize
		) {
		  return "bottomleft";
		} else if (
		  mousePos.left < this._elemWidth &&
		  mousePos.left > this._elemWidth - this._borderSize &&
		  mousePos.top < this._borderSize
		) {
		  return "topright";
		} else if (
		  mousePos.left < this._borderSize &&
		  mousePos.top < this._borderSize
		) {
		  return "topleft";
		} else if (
		  mousePos.left < this._elemWidth &&
		  mousePos.left > this._elemWidth - this._borderSize
		) {
		  return "right";
		} else if (mousePos.left < this._borderSize) {
		  return "left";
		} else if (
		  mousePos.top < this._elemHeight &&
		  mousePos.top > this._elemHeight - this._borderSize
		) {
		  return "bottom";
		} else if (mousePos.top < this._borderSize) {
		  return "top";
		}
	
		return null;
	  }
	
}
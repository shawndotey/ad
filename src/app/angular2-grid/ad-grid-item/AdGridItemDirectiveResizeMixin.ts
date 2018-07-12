import { AdGridItemDirectiveBase } from "./AdGridItemDirectiveBase";
import { EventEmitter, Output } from "@angular/core";
import {
  AdGridItemEvent,
  AdGridItemSize,
  ResizeHandle,
  AdGridRawPosition
} from "../model";
import * as AdGridItemUtility from "../shared/AdGridHelpers";
import { MixinConstructor } from "../shared/ExtendMixin";

export function AdGridItemDirectiveResizeMixin<T extends MixinConstructor<AdGridItemDirectiveBase>>(Base: T) {


  class MixinHolder extends Base {

  }


  class Mixin extends Base {
    protected isResizable: boolean = true;
	
    constructor(...args: any[]) {
      super(...args);
      this.onMouseMove$.subscribe(event=>{

console.log('onMouseMove event')
      })
    }
    @Output() public onResizeStart: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
    @Output() public onResize: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
    @Output() public onResizeStop: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
    @Output() public onResizeAny: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
    public onResizeStartEvent(): void {
      const event: AdGridItemEvent = this.getEventOutput();
      this.onResizeStart.emit(event);
      this.onResizeAny.emit(event);
      this.onChangeStart.emit(event);
      this.onChangeAny.emit(event);
    }
    public onResizeEvent(): void {
      const event: AdGridItemEvent = this.getEventOutput();
      this.onResize.emit(event);
      this.onResizeAny.emit(event);
      this.onChange.emit(event);
      this.onChangeAny.emit(event);
    }
    public onResizeStopEvent(): void {
      const event: AdGridItemEvent = this.getEventOutput();
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
          return AdGridItemUtility.hasSelectorFromStartToParentElement(
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
              AdGridItemUtility.hasSelectorFromStartToParentElement(
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

      const mousePos: AdGridRawPosition = this._getMousePosition(e);

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
	};
	return Mixin;
}

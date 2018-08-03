import { AdGridItemDirectiveBase } from "./AdGridItemDirectiveBase";
import { EventEmitter, Output } from "@angular/core";
import {
  AdGridItemEvent,
  ResizeHandle,
  AdGridItemRawPosition,
  GridDimensions,
  AdGridItemGridDimension
} from "../model";
import * as AdGridItemUtility from "../shared/AdGridHelpers";
import { MixinConstructor } from "../shared/ExtendMixin";
import { AdGridItemElementDimension } from "../main";

export function AdGridItemDirectiveResizeMixin<T extends MixinConstructor<AdGridItemDirectiveBase>>(Base: T) {


  class MixinHolder extends Base {

  }


  class Mixin extends Base {
    protected isResizable: boolean = true;
	
    constructor(...args: any[]) {
      super(...args);
      this.onMouseMove$.subscribe(event=>{

// console.log('onMouseMove event')
      })

      this.itemRecalculationAsNeed.subscribe(() => {
        

			});
			this.elementAdjustmentAsNeed.subscribe(() => {
        this.resizeElementAsNeeded();

			});

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
    public isElementResizeNeeded() {
			if (this._lastElemWidth !== this._elemWidth || this._lastElemHeight !== this._elemHeight) {
				return true;
			}
			return false;
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

      const mousePos: AdGridItemRawPosition = this._getMousePosition(e);

      if (
        mousePos.x < this._elemWidth &&
        mousePos.x > this._elemWidth - this._borderSize &&
        mousePos.y < this._elemHeight &&
        mousePos.y > this._elemHeight - this._borderSize
      ) {
        return "bottomright";
      } else if (
        mousePos.x < this._borderSize &&
        mousePos.y < this._elemHeight &&
        mousePos.y > this._elemHeight - this._borderSize
      ) {
        return "bottomleft";
      } else if (
        mousePos.x < this._elemWidth &&
        mousePos.x > this._elemWidth - this._borderSize &&
        mousePos.y < this._borderSize
      ) {
        return "topright";
      } else if (
        mousePos.x < this._borderSize &&
        mousePos.y < this._borderSize
      ) {
        return "topleft";
      } else if (
        mousePos.x < this._elemWidth &&
        mousePos.x > this._elemWidth - this._borderSize
      ) {
        return "right";
      } else if (mousePos.x < this._borderSize) {
        return "left";
      } else if (
        mousePos.y < this._elemHeight &&
        mousePos.y > this._elemHeight - this._borderSize
      ) {
        return "bottom";
      } else if (mousePos.y < this._borderSize) {
        return "top";
      }

      return null;
    }
    public recalculateAllItemDimensionsByGrid(gridDimensions:GridDimensions): void {
      this._itemGridDimension = this.calculateItemDimensionsByGrid(this._itemGridDimension, gridDimensions);
      this.recalculateRawDimensionsByGrid(gridDimensions)
      gridDimensions = null;
    }
    private recalculateRawDimensionsByGrid(gridDimensions: GridDimensions) {
			let { height, width } = this.calculateRawDimensionsByGrid(gridDimensions);
			this.setRawDimensions(width, height);
			gridDimensions = null;
		}

    // public recalculateRawDimensions(gridDimensions:GridDimensions): void {
    //   this.setRawPositionByGrid(gridDimensions)
      
    //   this.xxrecalculateDimensionsByGridxx(gridDimensions);ng st
    //   gridDimensions = null;
    // }
    public recalculateSelfDimensionsAsNeeded(gridDimensions: GridDimensions): void {
			if (this.isGridDimensionsChanged()) {
        this.recalculateRawDimensionsByGrid(gridDimensions);
        this._lastItemGridDimension.col = this._itemGridDimension.col;
        this._lastItemGridDimension.row = this._itemGridDimension.row;
			}
			gridDimensions = null;
		}
    public resizeElementAsNeeded() {

			if (this.isElementResizeNeeded()) {
				this._lastElemWidth = this._elemWidth;
				this._lastElemHeight = this._elemHeight;
				this.resizeElementDimensions(this._elemWidth, this._elemHeight);
				this._elemWidth = this._elemWidth;
				this._elemHeight = this._elemHeight;
			}


			this.onChangeEvent();
    }
    
		protected resizeElementDimensions(w: number, h: number): void {

			if (w < this.minWidth) w = this.minWidth;
			if (h < this.minHeight) h = this.minHeight;

			this._renderer.setStyle(this._ngEl.nativeElement, "width", w + "px");
			this._renderer.setStyle(this._ngEl.nativeElement, "height", h + "px");
			
    }
    
    
		public calculateItemDimensionsByGrid(originalDimensions: AdGridItemGridDimension, gridDimensions: GridDimensions): AdGridItemGridDimension {
			
			let newDimensions: AdGridItemGridDimension = Object.assign({},originalDimensions) ;
			if (newDimensions.col< gridDimensions.minCols)
				newDimensions.col= gridDimensions.minCols;
			if (newDimensions.row < gridDimensions.minRows)
				newDimensions.row = gridDimensions.minRows;
			if (this._maxCols > 0 && newDimensions.col> this._maxCols)
				newDimensions.col= this._maxCols;
			if (this._maxRows > 0 && newDimensions.row > this._maxRows)
				newDimensions.row = this._maxRows;

			if (this._minCols > 0 && newDimensions.col< this._minCols)
				newDimensions.col= this._minCols;
			if (this._minRows > 0 && newDimensions.row < this._minRows)
				newDimensions.row = this._minRows;

			const itemWidth =
				newDimensions.col* gridDimensions.colWidth +
				(gridDimensions.marginLeft + gridDimensions.marginRight) * (newDimensions.col- 1);
			if (itemWidth < this.minWidth)
				newDimensions.col= Math.ceil(
					(this.minWidth + gridDimensions.marginRight + gridDimensions.marginLeft) /
					(gridDimensions.colWidth +
						gridDimensions.marginRight +
						gridDimensions.marginLeft)
				);

			const itemHeight =
				newDimensions.row * gridDimensions.rowHeight +
				(gridDimensions.marginTop + gridDimensions.marginBottom) * (newDimensions.row - 1);
			if (itemHeight < this.minHeight)
				newDimensions.row = Math.ceil(
					(this.minHeight + gridDimensions.marginBottom + gridDimensions.marginTop) /
					(gridDimensions.rowHeight +
						gridDimensions.marginBottom +
						gridDimensions.marginTop)
				);
			originalDimensions = null;
			gridDimensions = null;
			return newDimensions;
		}
	
	
		// public xxrecalculateDimensionsByGridxx(gridDimensions: GridDimensions): void {
		// 	if (this._itemDimension.x < gridDimensions.minCols)
		// 		this._itemDimension.x = gridDimensions.minCols;
		// 	if (this._itemDimension.y < gridDimensions.minRows)
		// 		this._itemDimension.y = gridDimensions.minRows;

		// 	const newWidth: number =
		// 		gridDimensions.colWidth * this._itemDimension.x +
		// 		(gridDimensions.marginLeft + gridDimensions.marginRight) * (this._itemDimension.x - 1);
		// 	const newHeight: number =
		// 		gridDimensions.rowHeight * this._itemDimension.y +
		// 		(gridDimensions.marginTop + gridDimensions.marginBottom) * (this._itemDimension.y - 1);

		// 	const w: number = Math.max(this.minWidth, gridDimensions.minWidth, newWidth);
		// 	const h: number = Math.max(
		// 		this.minHeight,
		// 		gridDimensions.minHeight,
		// 		newHeight
		// 	);
		// 	gridDimensions = null;

		// }
	};
	return Mixin;
}

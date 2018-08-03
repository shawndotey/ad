import { Renderer2, ElementRef } from '@angular/core';
import { AdGridItem, GridDimensions, AdGridItemElementDimension, AdGridItemGridPosition, AdGridItemRawPosition, AdGridItemGridDimension } from '../model';
import { MixinConstructor } from "../shared/ExtendMixin";

export function AdGridItemDirectiveBasePositionMixin<T extends MixinConstructor<AdGridItem>>(Base: T) {
	class Mixin extends Base {
		

		constructor(...args: any[]) {
			super(...args)

		
		}



		protected moveElementToCurrentRawPosition() {

			this.moveElementPosition(this._currentRawPosition.x, this._currentRawPosition.y);
		}
		protected calculateRawPositionByGrid(gridPosition: AdGridItemGridPosition, gridDimensions: GridDimensions): AdGridItemRawPosition {
			const x: number =
				(gridDimensions.colWidth +
					gridDimensions.marginLeft +
					gridDimensions.marginRight) *
				(gridPosition.col - 1) +
				gridDimensions.marginLeft +
				gridDimensions.screenMargin;
			const y: number =
				(gridDimensions.rowHeight +
					gridDimensions.marginTop +
					gridDimensions.marginBottom) *
				(gridPosition.row - 1) +
				gridDimensions.marginTop;
			gridDimensions = null;
			return { x, y }

		}


	public getRawPosition(): AdGridItemRawPosition {
		return this._currentRawPosition;
	}

	public setRawPosition(x:number, y:number): void {
		 this._currentRawPosition.x = x;
		 this._currentRawPosition.y = y;
	}

	public getGridPosition(): AdGridItemGridPosition {
		return this._currentGridPosition;
	}
	public setGridPosition( gridPosition: AdGridItemGridPosition): void {
		
		this._currentGridPosition = gridPosition;
			this.onItemChange.emit(this.getEventOutput());
		}
		isGridPositionChanged(): boolean {
			if (this._currentGridPosition.col !== this._lastGridPosition.col || this._currentGridPosition.row !== this._currentGridPosition.row) {
				return true;
			}
			return false;
		}
		isRawPositionChanged(): boolean {
			if (this._lastRawPosition.x !== this._currentRawPosition.x || this._lastRawPosition.y !== this._currentRawPosition.y) {
				return true;
			}
			return false;
		}

		recalculateItemRawPositionByGridAsNeeded(gridDimensions: GridDimensions): void {
			if (this.isGridPositionChanged()) {
				Object.assign(this._lastGridPosition, this._currentGridPosition);
				this.recalculateItemRawPositionByGrid(gridDimensions);
				
			}
		}
		recalculateItemRawPositionByGrid(gridDimensions: GridDimensions): void {
			this._currentRawPosition = this.calculateRawPositionByGrid(this._currentGridPosition, gridDimensions);
		}
		public moveElementAsNeeded() {
			if (this.isRawPositionChanged()) {
				Object.assign(this._lastRawPosition, this._currentRawPosition);
				this.moveElementToCurrentRawPosition();
			}
		}

	// public recalculateGridPositionAsNeeded(gridDimensions:GridDimensions){

	// 	if(this._lastGridPosition.row !== this._currentGridPosition.row || this._lastGridPosition.col !== this._currentGridPosition.col){
	// 		this.setRawPositionByGrid(gridDimensions)
	// 		this._lastGridPosition = this._currentGridPosition;
	// 	}
	// 	gridDimensions = null;
	// }
	protected moveElementPosition(x: number, y: number): void {
		
		switch (this._cascadeMode) {
			case "up":
			case "left":
			default:
				this._renderer.setStyle(this._ngEl.nativeElement, "left", x + "px");
				this._renderer.setStyle(this._ngEl.nativeElement, "top", y + "px");
				break;
			case "right":
				this._renderer.setStyle(this._ngEl.nativeElement, "right", x + "px");
				this._renderer.setStyle(this._ngEl.nativeElement, "top", y + "px");
				break;
			case "down":
				this._renderer.setStyle(this._ngEl.nativeElement, "left", x + "px");
				this._renderer.setStyle(this._ngEl.nativeElement, "bottom", y + "px");
				break;
		}
		//warning not ideal
		this._lastGridPosition = this._currentGridPosition;
		
	}

	
	}
	return Mixin;
}
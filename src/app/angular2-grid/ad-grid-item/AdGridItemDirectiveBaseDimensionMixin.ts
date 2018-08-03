import { Renderer2, ElementRef } from '@angular/core';
import { AdGridItem, GridDimensions, AdGridItemGridDimension, AdGridItemElementDimension } from '../model';
import { MixinConstructor } from "../shared/ExtendMixin";

export function AdGridItemDirectiveBaseDimesionsMixin<T extends MixinConstructor<AdGridItem>>(Base: T) {
	class Mixin extends Base {
		constructor(...args: any[]) {
			super(...args);
		}

		public getGridDimension(): AdGridItemGridDimension {
			return this._itemGridDimension;
		}

		public setGridDimension(newSize: AdGridItemGridDimension): void {
			this._itemGridDimension = newSize;
		}

		public getRawDimensions(): AdGridItemElementDimension  {
			return { width: this._elemWidth, height: this._elemHeight };
		}

		
		public setRawDimensions(width: number, height: number) {
			this._elemWidth = width;
			this._elemHeight = height;
		}

		
		protected isGridDimensionsChanged(): boolean {

			if (this._lastItemGridDimension.row !== this._itemGridDimension.row || this._lastItemGridDimension.col !== this._itemGridDimension.col) {

				return true;
			}
			return false;
		}

		public calculateRawDimensionsByGrid(gridDimensions: GridDimensions): AdGridItemElementDimension {

			let itemDimension: AdGridItemGridDimension = this._itemGridDimension
			const newWidth: number =
				gridDimensions.colWidth * itemDimension.col +
				(gridDimensions.marginLeft + gridDimensions.marginRight) * (itemDimension.col - 1);
			const newHeight: number =
				gridDimensions.rowHeight * itemDimension.row +
				(gridDimensions.marginTop + gridDimensions.marginBottom) * (itemDimension.row - 1);

			const width: number = Math.max(this.minWidth, gridDimensions.minWidth, newWidth);
			const height: number = Math.max(
				this.minHeight,
				gridDimensions.minHeight,
				newHeight
			);
			gridDimensions = null;
			return { height, width };
		}


	}
	return Mixin;
}
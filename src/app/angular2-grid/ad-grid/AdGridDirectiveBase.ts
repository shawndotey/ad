import { GridDimensions } from "./../model/AdGrid/GridDimensions";
import { AdGrid } from "../model/AdGrid/AdGrid";
import { KeyValueDiffers, ElementRef, Renderer, ComponentFactoryResolver, ComponentRef, Output, EventEmitter, QueryList, ContentChildren } from "@angular/core";
import { Subscription } from "rxjs";
import { AdGridItemDirective } from "../ad-grid-item/ad-grid-item.directive";
import { AdGridRawPosition, AdGridItemDimensions, AdGridItemPosition, AdGridItemSize, AdGridItemEvent } from "../model";
import { sortItemsByPositionVertical, sortItemsByPositionHorizontal } from "../shared/AdGridHelpers";
import { AdGridPlaceholderComponent } from "../ad-grid-placeholder/ad-grid-placeholder.component";




export class AdGridDirectiveBase extends AdGrid{
	
	constructor(
		protected _differs: KeyValueDiffers,
		protected _ngEl: ElementRef,
		protected _renderer: Renderer,
		protected componentFactoryResolver: ComponentFactoryResolver
	){
		super();

	}
	protected gridDimensions:GridDimensions = new GridDimensions();
	public onNgAfterContentInit: EventEmitter<AdGrid> = new EventEmitter<AdGrid>();
	
	protected subscriptions: Subscription[] = [];
	protected _items: Map<string, AdGridItemDirective> = new Map<string, AdGridItemDirective>();
	focusedItem: AdGridItemDirective = null;
	
	@Output() public onItemChange: EventEmitter<Array<AdGridItemEvent>> = new EventEmitter<Array<AdGridItemEvent>>();
	@ContentChildren(AdGridItemDirective, { descendants: true }) gridItems: QueryList<AdGridItemDirective>;
	
	
	protected _createPlaceholder(item: AdGridItemDirective): void {
		const pos: AdGridItemPosition = item.getGridPosition();
		const dims: AdGridItemSize = item.getSize();

		const factory = this.componentFactoryResolver.resolveComponentFactory(AdGridPlaceholderComponent);
		var componentRef: ComponentRef<AdGridPlaceholderComponent> = item.containerRef.createComponent(factory);
		this._placeholderRef = componentRef;
		const placeholder: AdGridPlaceholderComponent = componentRef.instance;
		
		placeholder.setCascadeMode(this.cascade);
		placeholder.setGridPosition({ col: pos.col, row: pos.row }, this.gridDimensions);
		placeholder.setSize({ x: dims.x, y: dims.y }, this.gridDimensions);
	}


	protected _zoomOut(): void {
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'scale(0.5, 0.5)');
	}

	
	protected _resetZoom(): void {
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', '');
	}


	protected _getMousePosition(e: any): AdGridRawPosition {
		if (((<any>window).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
			e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
		}

		const refPos: any = this._ngEl.nativeElement.getBoundingClientRect();

		let left: number = e.clientX - refPos.left;
		let top: number = e.clientY - refPos.top;

		if (this.cascade == 'down') top = refPos.top + refPos.height - e.clientY;
		if (this.cascade == 'right') left = refPos.left + refPos.width - e.clientX;

		return {
			left,
			top
		};
	}


	

	protected _getItemFromPosition(position: AdGridRawPosition): AdGridItemDirective {
		return Array.from(this._itemsInGrid, (itemId: string) => this._items.get(itemId)).find((item: AdGridItemDirective) => {
			if (!item) return false;

			const size: AdGridItemDimensions = item.getDimensions();
			const pos: AdGridRawPosition = item.getPosition();

			return position.left >= pos.left && position.left < (pos.left + size.width) &&
			position.top >= pos.top && position.top < (pos.top + size.height);
		});
	}

	

	protected _addToGrid(item: AdGridItemDirective): void {
		let pos: AdGridItemPosition = item.getGridPosition();
		const dims: AdGridItemSize = item.getSize();

		if (this._hasGridCollision(pos, dims)) {
			this._fixGridCollisions(pos, dims);
			pos = item.getGridPosition();
		}

		this._itemsInGrid.add(item.uid);
	}

	protected _removeFromGrid(item: AdGridItemDirective): void {
		this._itemsInGrid.delete(item.uid);
	}

	

	protected _calculateGridPosition(left: number, top: number): AdGridItemPosition {
		var col = Math.max(1, Math.round(left / (this.gridDimensions.colWidth + this.gridDimensions.marginLeft + this.gridDimensions.marginRight)) + 1);
		var row = Math.max(1, Math.round(top / (this.gridDimensions.rowHeight + this.gridDimensions.marginTop + this.gridDimensions.marginBottom)) + 1);

		if (!this._isWithinBoundsX({ col: col, row: row }, { x: 1, y: 1 })) col = this._maxCols;
		if (!this._isWithinBoundsY({ col: col, row: row }, { x: 1, y: 1 })) row = this._maxRows;

		return { 'col': col, 'row': row };
	}

	protected _hasGridCollision(pos: AdGridItemPosition, dims: AdGridItemSize): boolean {
		var positions = this._getCollisions(pos, dims);

		if (positions == null || positions.length == 0) return false;

		return positions.some((v: AdGridItemDirective) => {
			return !(v === null);
		});
	}

	protected _getCollisions(pos: AdGridItemPosition, dims: AdGridItemSize): Array<AdGridItemDirective> {
		const returns: Array<AdGridItemDirective> = [];

		if (!pos.col) { pos.col = 1; }
		if (!pos.row) { pos.row = 1; }

		const leftCol = pos.col;
		const rightCol = pos.col + dims.x;
		const topRow = pos.row;
		const bottomRow = pos.row + dims.y;

		this._itemsInGrid.forEach((itemId: string) => {
			const item: AdGridItemDirective = this._items.get(itemId);

			if (!item) {
				this._itemsInGrid.delete(itemId);
				return;
			}

			const itemLeftCol = item.col;
			const itemRightCol = item.col + item.sizex;
			const itemTopRow = item.row;
			const itemBottomRow = item.row + item.sizey;

			const withinColumns = leftCol < itemRightCol && itemLeftCol < rightCol;
			const withinRows = topRow < itemBottomRow && itemTopRow < bottomRow;

			if (withinColumns && withinRows) {
				returns.push(item);
			}
		});

		return returns;
	}

	protected _fixGridCollisions(pos: AdGridItemPosition, dims: AdGridItemSize): void {
		const collisions: Array<AdGridItemDirective> = this._getCollisions(pos, dims);
		if (collisions.length === 0) { return; }

		for (let collision of collisions) {
			this._removeFromGrid(collision);

			const itemDims: AdGridItemSize = collision.getSize();
			const itemPos: AdGridItemPosition = collision.getGridPosition();
			let newItemPos: AdGridItemPosition = { col: itemPos.col, row: itemPos.row };

			if (this._collisionFixDirection === "vertical") {
				newItemPos.row = pos.row + dims.y;

				if (!this._isWithinBoundsY(newItemPos, itemDims)) {
					newItemPos.col = pos.col + dims.x;
					newItemPos.row = 1;
				}
			} else if (this._collisionFixDirection === "horizontal") {
				newItemPos.col = pos.col + dims.x;

				if (!this._isWithinBoundsX(newItemPos, itemDims)) {
					newItemPos.col = 1;
					newItemPos.row = pos.row + dims.y;
				}
			}

			collision.setGridPosition(newItemPos);

			this._fixGridCollisions(newItemPos, itemDims);
			this._addToGrid(collision);
			collision.onCascadeEvent();
		}

		this._fixGridCollisions(pos, dims);
	}
	
@Output() public onGridCascade: EventEmitter<any> = new EventEmitter<any>();
  
	protected _cascadeGrid(pos?: AdGridItemPosition, dims?: AdGridItemSize, isIgnoreFocusedItem:boolean = false): void {
		

		if (this._destroyed) return;
		if (!pos !== !dims) throw new Error('Cannot cascade with only position and not dimensions');
		// console.log('_c')
		this.onGridCascade.emit();
		
		// if ((this.isDragging ||this.isResizing) && this.focusedItem !== null && !pos && !dims) {
		// 	pos = this.focusedItem.getGridPosition();
		// dims = this.focusedItem.getSize();

		// } 
		
		// if (this.isDragging && this._draggingItem && !pos && !dims) {
		// 	pos = this._draggingItem.getGridPosition();
		// 	dims = this._draggingItem.getSize();
		// } 
		// if (this.isResizing && this._resizingItem && !pos && !dims) {
		// 	pos = this._resizingItem.getGridPosition();
		// 	dims = this._resizingItem.getSize();
		// }

		// let itemsInGrid: AdGridItemDirective[] = Array.from(this._itemsInGrid, (itemId: string) => this._items.get(itemId));
		let itemsInGrid = this.gridItems.toArray();
		console.log('_cascadeGrid', 'itemsInGrid', itemsInGrid)
		switch (this.cascade) {
			case 'up':
			case 'down':
				itemsInGrid = itemsInGrid.sort(sortItemsByPositionVertical);
				const lowestRowPerColumn: Map<number, number> = new Map<number, number>();

				for (let item of itemsInGrid) {
					if (item.isFixed) continue;

					const itemDims: AdGridItemSize = item.getSize();
					const itemPos: AdGridItemPosition = item.getGridPosition();

					let lowestRowForItem: number = lowestRowPerColumn.get(itemPos.col) || 1;

					for (let i: number = 1; i < itemDims.x; i++) {
						const lowestRowForColumn = lowestRowPerColumn.get(itemPos.col + i) || 1;
						lowestRowForItem = Math.max(lowestRowForColumn, lowestRowForItem);
					}

					const leftCol = itemPos.col;
					const rightCol = itemPos.col + itemDims.x;

					if (pos && dims) {
						const withinColumns = rightCol > pos.col && leftCol < (pos.col + dims.x);

						if (withinColumns) {          //	If our element is in one of the item's columns
							const roomAboveItem = itemDims.y <= (pos.row - lowestRowForItem);

							if (!roomAboveItem) {                                                  //	Item can't fit above our element
								lowestRowForItem = Math.max(lowestRowForItem, pos.row + dims.y);   //	Set the lowest row to be below it
							}
						}
					}

					const newPos: AdGridItemPosition = { col: itemPos.col, row: lowestRowForItem };

					//	What if it's not within bounds Y?
					if (lowestRowForItem != itemPos.row && this._isWithinBoundsY(newPos, itemDims)) {	//	If the item is not already on this row move it up
						this._removeFromGrid(item);

						item.setGridPosition(newPos);

						item.onCascadeEvent();
						this._addToGrid(item);
					}

					for (let i: number = 0; i < itemDims.x; i++) {
						lowestRowPerColumn.set(itemPos.col + i, lowestRowForItem + itemDims.y);	//	Update the lowest row to be below the item
					}
				}
				break;
			case 'left':
			case 'right':
				itemsInGrid = itemsInGrid.sort(sortItemsByPositionHorizontal);
				const lowestColumnPerRow: Map<number, number> = new Map<number, number>();

				for (let item of itemsInGrid) {
					const itemDims: AdGridItemSize = item.getSize();
					const itemPos: AdGridItemPosition = item.getGridPosition();

					let lowestColumnForItem: number = lowestColumnPerRow.get(itemPos.row) || 1;

					for (let i: number = 1; i < itemDims.y; i++) {
						let lowestOffsetColumn: number = lowestColumnPerRow.get(itemPos.row + i) || 1;
						lowestColumnForItem = Math.max(lowestOffsetColumn, lowestColumnForItem);
					}

					const topRow = itemPos.row;
					const bottomRow = itemPos.row + itemDims.y;

					if (pos && dims) {
						const withinRows = bottomRow > pos.col && topRow < (pos.col + dims.x);

						if (withinRows) {          //	If our element is in one of the item's rows
							const roomNextToItem = itemDims.x <= (pos.col - lowestColumnForItem);

							if (!roomNextToItem) {                                                      //	Item can't fit next to our element
								lowestColumnForItem = Math.max(lowestColumnForItem, pos.col + dims.x);  //	Set the lowest col to be the other side of it
							}
						}
					}

					const newPos: AdGridItemPosition = { col: lowestColumnForItem, row: itemPos.row };

					if (lowestColumnForItem != itemPos.col && this._isWithinBoundsX(newPos, itemDims)) {	//	If the item is not already on this col move it up
						this._removeFromGrid(item);

						item.setGridPosition(newPos);

						item.onCascadeEvent();
						this._addToGrid(item);
					}

					for (let i: number = 0; i < itemDims.y; i++) {
						lowestColumnPerRow.set(itemPos.row + i, lowestColumnForItem + itemDims.x);	//	Update the lowest col to be below the item
					}
				}
				break;
			default:
				break;
		}
	}

	protected _fixGridPosition(pos: AdGridItemPosition, dims: AdGridItemSize): AdGridItemPosition {
		if (!this._hasGridCollision(pos, dims)) return pos;

		const maxRow = this._maxRows === 0 ? this._getMaxRow() : this._maxRows;
		const maxCol = this._maxCols === 0 ? this._getMaxCol() : this._maxCols;
		const newPos = {
			col: pos.col,
			row: pos.row,
		};

		if (this._itemFixDirection === "vertical") {
			fixLoop:
			for (; newPos.col <= maxRow;) {
				const itemsInPath = this._getItemsInVerticalPath(newPos, dims, newPos.row);
				let nextRow = newPos.row;

				for (let item of itemsInPath) {
					if (item.row - nextRow >= dims.y) {
						newPos.row = nextRow;
						break fixLoop;
					}

					nextRow = item.row + item.sizey;
				}

				if (maxRow - nextRow >= dims.y) {
					newPos.row = nextRow;
					break fixLoop;
				}

				newPos.col = Math.max(newPos.col + 1, Math.min.apply(Math, itemsInPath.map((item) => item.col + dims.x)));
				newPos.row = 1;
			}
		} else if (this._itemFixDirection === "horizontal") {
			fixLoop:
			for (; newPos.row <= maxRow;) {
				const itemsInPath = this._getItemsInHorizontalPath(newPos, dims, newPos.col);
				let nextCol = newPos.col;

				for (let item of itemsInPath) {
					if (item.col - nextCol >= dims.x) {
						newPos.col = nextCol;
						break fixLoop;
					}

					nextCol = item.col + item.sizex;
				}

				if (maxCol - nextCol >= dims.x) {
					newPos.col = nextCol;
					break fixLoop;
				}

				newPos.row = Math.max(newPos.row + 1, Math.min.apply(Math, itemsInPath.map((item) => item.row + dims.y)));
				newPos.col = 1;
			}
		}

		return newPos;
	}

	protected _getItemsInHorizontalPath(pos: AdGridItemPosition, dims: AdGridItemSize, startColumn: number = 0): AdGridItemDirective[] {
		const itemsInPath: AdGridItemDirective[] = [];
		const topRow: number = pos.row + dims.y - 1;

		this._itemsInGrid.forEach((itemId: string) => {
			const item = this._items.get(itemId);
			if (item.col + item.sizex - 1 < startColumn) { return; }    //	Item falls after start column
			if (item.row > topRow) { return; }                          //	Item falls above path
			if (item.row + item.sizey - 1 < pos.row) { return; }        //	Item falls below path
			itemsInPath.push(item);
		});

		return itemsInPath;
	}

	protected _getItemsInVerticalPath(pos: AdGridItemPosition, dims: AdGridItemSize, startRow: number = 0): AdGridItemDirective[] {
		const itemsInPath: AdGridItemDirective[] = [];
		const rightCol: number = pos.col + dims.x - 1;

		this._itemsInGrid.forEach((itemId: string) => {
			const item = this._items.get(itemId);
			if (item.row + item.sizey - 1 < startRow) { return; }   //	Item falls above start row
			if (item.col > rightCol) { return; }                    //	Item falls after path
			if (item.col + item.sizex - 1 < pos.col) { return; }    //	Item falls before path
			itemsInPath.push(item);
		});

		return itemsInPath;
	}

	protected _isWithinBoundsX(pos: AdGridItemPosition, dims: AdGridItemSize, allowExcessiveItems: boolean = false) {
		return this._maxCols == 0 || (allowExcessiveItems && pos.col == 1) || (pos.col + dims.x - 1) <= this._maxCols;
	}

	protected _fixPosToBoundsX(pos: AdGridItemPosition, dims: AdGridItemSize): AdGridItemPosition {
		if (!this._isWithinBoundsX(pos, dims)) {
			pos.col = Math.max(this._maxCols - (dims.x - 1), 1);
			pos.row ++;
		}
		return pos;
	}

	protected _fixSizeToBoundsX(pos: AdGridItemPosition, dims: AdGridItemSize): AdGridItemSize {
		if (!this._isWithinBoundsX(pos, dims)) {
			dims.x = Math.max(this._maxCols - (pos.col - 1), 1);
			dims.y++;
		}
		return dims;
	}

	protected _isWithinBoundsY(pos: AdGridItemPosition, dims: AdGridItemSize, allowExcessiveItems: boolean = false) {
		return this._maxRows == 0 || (allowExcessiveItems && pos.row == 1) || (pos.row + dims.y - 1) <= this._maxRows;
	}

	protected _fixPosToBoundsY(pos: AdGridItemPosition, dims: AdGridItemSize): AdGridItemPosition {
		if (!this._isWithinBoundsY(pos, dims)) {
			pos.row = Math.max(this._maxRows - (dims.y - 1), 1);
			pos.col++;
		}
		return pos;
	}

	protected _fixSizeToBoundsY(pos: AdGridItemPosition, dims: AdGridItemSize): AdGridItemSize {
		if (!this._isWithinBoundsY(pos, dims)) {
			dims.y = Math.max(this._maxRows - (pos.row - 1), 1);
			dims.x++;
		}
		return dims;
	}

	protected _isWithinBounds(pos: AdGridItemPosition, dims: AdGridItemSize, allowExcessiveItems: boolean = false) {
		return this._isWithinBoundsX(pos, dims, allowExcessiveItems) && this._isWithinBoundsY(pos, dims, allowExcessiveItems);
	}

	protected _fixPosToBounds(pos: AdGridItemPosition, dims: AdGridItemSize): AdGridItemPosition {
		return this._fixPosToBoundsX(this._fixPosToBoundsY(pos, dims), dims);
	}

	protected _fixSizeToBounds(pos: AdGridItemPosition, dims: AdGridItemSize): AdGridItemSize {
		return this._fixSizeToBoundsX(pos, this._fixSizeToBoundsY(pos, dims));
	}

	protected _getMaxRow(): number {
		const itemsRows: number[] = Array.from(this._itemsInGrid, (itemId: string) => {
			const item = this._items.get(itemId);
			if (!item) return 0;
			return item.row + item.sizey - 1;
		});

		return Math.max.apply(null, itemsRows);
	}

	protected _emitOnItemChange() {
		const itemOutput: any[] = Array.from(this._itemsInGrid)
			.map((itemId: string) => this._items.get(itemId))
			.filter((item: AdGridItemDirective) => !!item)
			.map((item: AdGridItemDirective) => item.getEventOutput());

		this.onItemChange.emit(itemOutput);
	}
	protected _getMaxCol(): number {
		const itemsCols: number[] = Array.from(this._itemsInGrid, (itemId: string) => {
			const item = this._items.get(itemId);
			if (!item) return 0;
			return item.col + item.sizex - 1;
		});

		return Math.max.apply(null, itemsCols);
	}
	protected _updateSize(): void {
		if (this._destroyed) return;
		let maxCol: number = this._getMaxCol();
		let maxRow: number = this._getMaxRow();

		if (maxCol != this._curMaxCol || maxRow != this._curMaxRow) {
			this._curMaxCol = maxCol;
			this._curMaxRow = maxRow;
		}

		this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', '100%');//(maxCol * (this.gridDimensions.colWidth + this.gridDimensions.marginLeft + this.gridDimensions.marginRight))+'px');
		if (!this._elementBasedDynamicRowHeight) {
			this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', (maxRow * (this.gridDimensions.rowHeight + this.gridDimensions.marginTop + this.gridDimensions.marginBottom)) + 'px');
		}
	}

	

}
import { GridDimensions } from "../model/AdGrid/GridDimensions";
import { AdGrid } from "../model/AdGrid/AdGrid";
import { KeyValueDiffers, ElementRef, Renderer, ComponentFactoryResolver, ComponentRef, Output, EventEmitter, QueryList, ContentChildren } from "@angular/core";
import { Subscription } from "rxjs";
import { AdGridItemDirective } from "../ad-grid-item/ad-grid-item.directive";
import { AdGridItemRawPosition, AdGridItemGridPosition, AdGridItemElementDimension, AdGridItemEvent, AdGridItemGridDimension } from "../model";
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
	
	
	protected _items: Map<string, AdGridItemDirective> = new Map<string, AdGridItemDirective>();
	focusedItem: AdGridItemDirective = null;
	
	@Output() public onItemChange: EventEmitter<Array<AdGridItemEvent>> = new EventEmitter<Array<AdGridItemEvent>>();
	@ContentChildren(AdGridItemDirective, { descendants: true }) gridItems: QueryList<AdGridItemDirective>;
	public recalcutateItemRawPositionAsNeeded(){

		this.gridItems.forEach(item=>item.recalculateItemRawPositionByGridAsNeeded(this.gridDimensions))
	}
	public recalcutateItemDimensionsAsNeeded(){

		this.gridItems.forEach(item=>item.recalculateSelfDimensionsAsNeeded(this.gridDimensions))
	}
	public moveItemsElementAsNeeded(){

		this.gridItems.forEach(item=>item.moveElementAsNeeded())
	}
	protected _createPlaceholder(item: AdGridItemDirective): void {
		const pos: AdGridItemGridPosition = item.getGridPosition();
		const dims: AdGridItemGridDimension = item.getGridDimension();

		const factory = this.componentFactoryResolver.resolveComponentFactory(AdGridPlaceholderComponent);
		var componentRef: ComponentRef<AdGridPlaceholderComponent> = item.containerRef.createComponent(factory);
		this._placeholderRef = componentRef;
		const placeholder: AdGridPlaceholderComponent = componentRef.instance;
		
		placeholder.setCascadeMode(this.cascade);
		placeholder.setGridPosition({ col: pos.col, row: pos.row }, this.gridDimensions);
		placeholder.setSize({ col: dims.col, row: dims.row }, this.gridDimensions);
	}


	protected _zoomOut(): void {
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'scale(0.5, 0.5)');
	}

	
	protected _resetZoom(): void {
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', '');
	}


	protected _getMousePosition(e: any): AdGridItemRawPosition {
		if (((<any>window).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
			e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
		}

		const refPos: any = this._ngEl.nativeElement.getBoundingClientRect();

		let x: number = e.clientX - refPos.left;
		let y: number = e.clientY - refPos.top;

		if (this.cascade == 'down') y = refPos.top + refPos.height - e.clientY;
		if (this.cascade == 'right') x = refPos.left + refPos.width - e.clientX;

		return {
			x,
			y
		};
	}


	

	protected _getItemFromPosition(position: AdGridItemRawPosition): AdGridItemDirective {
		return Array.from(this._itemsInGrid, (itemId: string) => this._items.get(itemId)).find((item: AdGridItemDirective) => {
			if (!item) return false;

			const size: AdGridItemElementDimension = item.getRawDimensions();
			const pos: AdGridItemRawPosition = item.getRawPosition();

			return position.x >= pos.x && position.x < (pos.x + size.width) &&
			position.y >= pos.y && position.y < (pos.y + size.height);
		});
	}

	

	protected _addToGrid(item: AdGridItemDirective): void {
		let pos: AdGridItemGridPosition = item.getGridPosition();
		const dims: AdGridItemGridDimension = item.getGridDimension();

		if (this._hasGridCollision(pos, dims)) {
			this._fixGridCollisions(pos, dims);
			pos = item.getGridPosition();
		}

		this._itemsInGrid.add(item.uid);
		
	}

	protected _removeFromGrid(item: AdGridItemDirective): void {
		this._itemsInGrid.delete(item.uid);
	}

	

	protected _calculateGridPositionByRawPosition(left: number, top: number): AdGridItemGridPosition {
		var col = Math.max(1, Math.round(left / (this.gridDimensions.colWidth + this.gridDimensions.marginLeft + this.gridDimensions.marginRight)) + 1);
		var row = Math.max(1, Math.round(top / (this.gridDimensions.rowHeight + this.gridDimensions.marginTop + this.gridDimensions.marginBottom)) + 1);

		if (!this._isWithinBoundsX({ col: col, row: row }, { col: 1, row: 1 })) col = this._maxCols;
		if (!this._isWithinBoundsY({ col: col, row: row }, { col: 1, row: 1 })) row = this._maxRows;

		return { 'col': col, 'row': row };
	}

	protected _hasGridCollision(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): boolean {
		var positions = this._getCollisions(pos, dims);

		if (positions == null || positions.length == 0) return false;

		return positions.some((v: AdGridItemDirective) => {
			return !(v === null);
		});
	}

	protected _getCollisions(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): Array<AdGridItemDirective> {
		const returns: Array<AdGridItemDirective> = [];

		if (!pos.col) { pos.col = 1; }
		if (!pos.row) { pos.row = 1; }

		const leftCol = pos.col;
		const rightCol = pos.col + dims.col;
		const topRow = pos.row;
		const bottomRow = pos.row + dims.row;

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

	protected _fixGridCollisions(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): void {
		const collisions: Array<AdGridItemDirective> = this._getCollisions(pos, dims);
		if (collisions.length === 0) { return; }

		for (let collision of collisions) {
			this._removeFromGrid(collision);

			const itemDims: AdGridItemGridDimension = collision.getGridDimension();
			const itemPos: AdGridItemGridPosition = collision.getGridPosition();
			let newItemPos: AdGridItemGridPosition = { col: itemPos.col, row: itemPos.row };

			if (this._collisionFixDirection === "vertical") {
				newItemPos.row = pos.row + dims.row;

				if (!this._isWithinBoundsY(newItemPos, itemDims)) {
					newItemPos.col = pos.col + dims.col;
					newItemPos.row = 1;
				}
			} else if (this._collisionFixDirection === "horizontal") {
				newItemPos.col = pos.col + dims.col;

				if (!this._isWithinBoundsX(newItemPos, itemDims)) {
					newItemPos.col = 1;
					newItemPos.row = pos.row + dims.row;
				}
			}

			collision.setGridPosition(newItemPos);
			//collision.setRawPositionByGrid(this.gridDimensions);

			this._fixGridCollisions(newItemPos, itemDims);
			this._addToGrid(collision);
			
			collision.onCascadeEvent();
			// if(newItemPos.row != itemPos.row || newItemPos.col != itemPos.col){

			// 	console.log('newItemPos.row:', newItemPos.row, ' itemPos.row:', itemPos.row, ' / newItemPos.col:', newItemPos.col, ' itemPos.col:', itemPos.col)
			// console.log(collision.getGridPosition())
			
			// }

			
		}

		this._fixGridCollisions(pos, dims);
	}
	
@Output() public onGridCascade: EventEmitter<any> = new EventEmitter<any>();
  
	protected _cascadeGrid(pos?: AdGridItemGridPosition, dims?: AdGridItemGridDimension, isIgnoreFocusedItem:boolean = false): void {
		

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

		 let itemsInGrid: AdGridItemDirective[] = Array.from(this._itemsInGrid, (itemId: string) => this._items.get(itemId));
		// let itemsInGrid = this.gridItems.toArray();
		//console.log('_cascadeGrid', 'this.gridItems', this.gridItems)
		switch (this.cascade) {
			case 'up':
			case 'down':
				itemsInGrid = itemsInGrid.sort(sortItemsByPositionVertical);
				const lowestRowPerColumn: Map<number, number> = new Map<number, number>();

				for (let item of itemsInGrid) {
					if (item.isFixed) continue;

					const itemDims: AdGridItemGridDimension = item.getGridDimension();
					const itemPos: AdGridItemGridPosition = item.getGridPosition();

					let lowestRowForItem: number = lowestRowPerColumn.get(itemPos.col) || 1;

					for (let i: number = 1; i < itemDims.col; i++) {
						const lowestRowForColumn = lowestRowPerColumn.get(itemPos.col + i) || 1;
						lowestRowForItem = Math.max(lowestRowForColumn, lowestRowForItem);
					}

					const leftCol = itemPos.col;
					const rightCol = itemPos.col + itemDims.col;

					if (pos && dims) {
						const withinColumns = rightCol > pos.col && leftCol < (pos.col + dims.col);

						if (withinColumns) {          //	If our element is in one of the item's columns
							const roomAboveItem = itemDims.row <= (pos.row - lowestRowForItem);

							if (!roomAboveItem) {                                                  //	Item can't fit above our element
								lowestRowForItem = Math.max(lowestRowForItem, pos.row + dims.row);   //	Set the lowest row to be below it
							}
						}
					}

					const newPos: AdGridItemGridPosition = { col: itemPos.col, row: lowestRowForItem };

					//	What if it's not within bounds Y?
					if (lowestRowForItem != itemPos.row && this._isWithinBoundsY(newPos, itemDims)) {	//	If the item is not already on this row move it up
						this._removeFromGrid(item);

						item.setGridPosition(newPos);

						item.onCascadeEvent();
						this._addToGrid(item);
					}

					for (let i: number = 0; i < itemDims.col; i++) {
						lowestRowPerColumn.set(itemPos.col + i, lowestRowForItem + itemDims.row);	//	Update the lowest row to be below the item
					}
				}
				break;
			case 'left':
			case 'right':
				itemsInGrid = itemsInGrid.sort(sortItemsByPositionHorizontal);
				const lowestColumnPerRow: Map<number, number> = new Map<number, number>();

				for (let item of itemsInGrid) {
					const itemDims: AdGridItemGridDimension = item.getGridDimension();
					const itemPos: AdGridItemGridPosition = item.getGridPosition();

					let lowestColumnForItem: number = lowestColumnPerRow.get(itemPos.row) || 1;

					for (let i: number = 1; i < itemDims.row; i++) {
						let lowestOffsetColumn: number = lowestColumnPerRow.get(itemPos.row + i) || 1;
						lowestColumnForItem = Math.max(lowestOffsetColumn, lowestColumnForItem);
					}

					const topRow = itemPos.row;
					const bottomRow = itemPos.row + itemDims.row;

					if (pos && dims) {
						const withinRows = bottomRow > pos.col && topRow < (pos.col + dims.col);

						if (withinRows) {          //	If our element is in one of the item's rows
							const roomNextToItem = itemDims.col <= (pos.col - lowestColumnForItem);

							if (!roomNextToItem) {                                                      //	Item can't fit next to our element
								lowestColumnForItem = Math.max(lowestColumnForItem, pos.col + dims.col);  //	Set the lowest col to be the other side of it
							}
						}
					}

					const newPos: AdGridItemGridPosition = { col: lowestColumnForItem, row: itemPos.row };

					if (lowestColumnForItem != itemPos.col && this._isWithinBoundsX(newPos, itemDims)) {	//	If the item is not already on this col move it up
						this._removeFromGrid(item);

						item.setGridPosition(newPos);

						item.onCascadeEvent();
						this._addToGrid(item);
					}

					for (let i: number = 0; i < itemDims.row; i++) {
						lowestColumnPerRow.set(itemPos.row + i, lowestColumnForItem + itemDims.col);	//	Update the lowest col to be below the item
					}
				}
				break;
			default:
				break;
				
		}
		
	}

	protected _fixGridPosition(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): AdGridItemGridPosition {
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
					if (item.row - nextRow >= dims.row) {
						newPos.row = nextRow;
						break fixLoop;
					}

					nextRow = item.row + item.sizey;
				}

				if (maxRow - nextRow >= dims.row) {
					newPos.row = nextRow;
					break fixLoop;
				}

				newPos.col = Math.max(newPos.col + 1, Math.min.apply(Math, itemsInPath.map((item) => item.col + dims.col)));
				newPos.row = 1;
			}
		} else if (this._itemFixDirection === "horizontal") {
			fixLoop:
			for (; newPos.row <= maxRow;) {
				const itemsInPath = this._getItemsInHorizontalPath(newPos, dims, newPos.col);
				let nextCol = newPos.col;

				for (let item of itemsInPath) {
					if (item.col - nextCol >= dims.col) {
						newPos.col = nextCol;
						break fixLoop;
					}

					nextCol = item.col + item.sizex;
				}

				if (maxCol - nextCol >= dims.col) {
					newPos.col = nextCol;
					break fixLoop;
				}

				newPos.row = Math.max(newPos.row + 1, Math.min.apply(Math, itemsInPath.map((item) => item.row + dims.row)));
				newPos.col = 1;
			}
		}

		return newPos;
	}

	protected _getItemsInHorizontalPath(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension, startColumn: number = 0): AdGridItemDirective[] {
		const itemsInPath: AdGridItemDirective[] = [];
		const topRow: number = pos.row + dims.row - 1;

		this._itemsInGrid.forEach((itemId: string) => {
			const item = this._items.get(itemId);
			if (item.col + item.sizex - 1 < startColumn) { return; }    //	Item falls after start column
			if (item.row > topRow) { return; }                          //	Item falls above path
			if (item.row + item.sizey - 1 < pos.row) { return; }        //	Item falls below path
			itemsInPath.push(item);
		});

		return itemsInPath;
	}

	protected _getItemsInVerticalPath(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension, startRow: number = 0): AdGridItemDirective[] {
		const itemsInPath: AdGridItemDirective[] = [];
		const rightCol: number = pos.col + dims.row - 1;

		this._itemsInGrid.forEach((itemId: string) => {
			const item = this._items.get(itemId);
			if (item.row + item.sizey - 1 < startRow) { return; }   //	Item falls above start row
			if (item.col > rightCol) { return; }                    //	Item falls after path
			if (item.col + item.sizex - 1 < pos.col) { return; }    //	Item falls before path
			itemsInPath.push(item);
		});

		return itemsInPath;
	}

	protected _isWithinBoundsX(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension, allowExcessiveItems: boolean = false) {
		return this._maxCols == 0 || (allowExcessiveItems && pos.col == 1) || (pos.col + dims.col - 1) <= this._maxCols;
	}

	protected _fixPosToBoundsX(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): AdGridItemGridPosition {
		if (!this._isWithinBoundsX(pos, dims)) {
			pos.col = Math.max(this._maxCols - (dims.col - 1), 1);
			pos.row ++;
		}
		return pos;
	}

	protected _fixSizeToBoundsX(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): AdGridItemGridDimension {
		if (!this._isWithinBoundsX(pos, dims)) {
			dims.col = Math.max(this._maxCols - (pos.col - 1), 1);
			dims.row++;
		}
		return dims;
	}

	protected _isWithinBoundsY(pos: AdGridItemGridPosition, dims: AdGridItemGridPosition, allowExcessiveItems: boolean = false) {
		return this._maxRows == 0 || (allowExcessiveItems && pos.row == 1) || (pos.row + dims.row - 1) <= this._maxRows;
	}

	protected _fixPosToBoundsY(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): AdGridItemGridPosition {
		if (!this._isWithinBoundsY(pos, dims)) {
			pos.row = Math.max(this._maxRows - (dims.row - 1), 1);
			pos.col++;
		}
		return pos;
	}

	protected _fixSizeToBoundsY(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): AdGridItemGridDimension {
		if (!this._isWithinBoundsY(pos, dims)) {
			dims.row = Math.max(this._maxRows - (pos.row - 1), 1);
			dims.col++;
		}
		return dims;
	}

	protected _isWithinBounds(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension, allowExcessiveItems: boolean = false) {
		return this._isWithinBoundsX(pos, dims, allowExcessiveItems) && this._isWithinBoundsY(pos, dims, allowExcessiveItems);
	}

	protected _fixPosToBounds(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): AdGridItemGridPosition {
		return this._fixPosToBoundsX(this._fixPosToBoundsY(pos, dims), dims);
	}

	protected _fixSizeToBounds(pos: AdGridItemGridPosition, dims: AdGridItemGridDimension): AdGridItemGridDimension {
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
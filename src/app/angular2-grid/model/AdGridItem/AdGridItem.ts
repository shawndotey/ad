import { KeyValueDiffer, Injectable } from '@angular/core';
import { GRID_ITEM_DEFAULT_CONFIG, AdGridItemPosition, AdGridItemSize, ResizeHandle, AdGridItemConfig } from '..';

@Injectable()
export abstract class AdGridItem {
	//	Default config
	public isFixed: boolean = false;
	public minWidth: number = 0;
	public minHeight: number = 0;
	public uid: string = null;
	public isDraggable: boolean = false;

	//	Private variables
	protected _payload: any;
	protected _currentPosition: AdGridItemPosition = { col: 1, row: 1 };
	protected _size: AdGridItemSize = { x: 1, y: 1 };
	protected _userConfig = null;
	protected _resizeHandle: ResizeHandle;
	protected _borderSize: number;
	protected _elemWidth: number;
	protected _elemHeight: number;
	protected _elemLeft: number;
	protected _elemTop: number;
	protected _added: boolean = false;
	protected _differ: KeyValueDiffer<string, any>;
	protected _cascadeMode: string;
	protected _maxCols: number = 0;
	protected _minCols: number = 0;
	protected _maxRows: number = 0;
	protected _minRows: number = 0;
	protected _dragHandle: string;
	get sizex(): number {
		return this._size.x;
	}
	get sizey(): number {
		return this._size.y;
	}
	get col(): number {
		return this._currentPosition.col;
	}
	get row(): number {
		return this._currentPosition.row;
	}
	get currentCol(): number {
		return this._currentPosition.col;
	}
	get currentRow(): number {
		return this._currentPosition.row;
	}
	
}
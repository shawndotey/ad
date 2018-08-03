import { AdGridItemElementDimension } from './AdGridItemElementDimension';
import { AdGridItemRawPosition } from '..';
import { ResizeHandle } from '../ResizeHandle';

import { AdGridItemGridPosition } from '..';
import { AdGridItemEvent } from './AdGridItemEvent';
import { GRID_ITEM_DEFAULT_CONFIG } from './AdGridItemConfig.Default';
import { KeyValueDiffer, Injectable, EventEmitter, Renderer2, ElementRef, Output } from '@angular/core';
import { AdGridItemConfig } from './AdGridItemConfig';
import { AdGridItemGridDimension } from './AdGridItemGridDimension';



export class AdGridItem {
	
	
	protected _config: AdGridItemConfig = GRID_ITEM_DEFAULT_CONFIG;
	@Output()	public onChangeStart: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	@Output()	public onChange: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	@Output()	public onChangeAny: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	@Output()	public onChangeStop: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	@Output()	public AdGridItemChange: EventEmitter<AdGridItemConfig> = new EventEmitter<AdGridItemConfig>();
	public getEventOutput(): AdGridItemEvent {
		return <AdGridItemEvent>{
			uid: this.uid,
			payload: this._payload,
			col: this._currentGridPosition.col,
			row: this._currentGridPosition.row,
			sizex: this._itemGridDimension.col,
			sizey: this._itemGridDimension.row,
			width: this._elemWidth,
			height: this._elemHeight,
			left: this._currentRawPosition.x,
			top: this._currentRawPosition.y
		};
	}
	@Output() public onItemChange: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>(false);
	
	protected onChangeEvent(){
		this.onItemChange.emit(this.getEventOutput());
	}
	//	Default config
	
	
	public isFixed: boolean = false;

	
	public minWidth: number = 0;
	public minHeight: number = 0;
	
	protected _maxCols: number = 0;
	protected _minCols: number = 0;
	protected _maxRows: number = 0;
	protected _minRows: number = 0;

	protected _elemWidth: number;
	protected _elemHeight: number;
	protected _lastElemWidth: number;
	protected _lastElemHeight: number;

	public uid: string = null;
	public isDraggable: boolean = false;
	protected _renderer: Renderer2;
	protected _ngEl: ElementRef;
	//	Private variables
	protected _payload: any;

	protected _currentGridPosition: AdGridItemGridPosition = { col: 1, row: 1 };
	protected _lastGridPosition: AdGridItemGridPosition = { col: 1, row: 1 };
	protected _itemGridDimension: AdGridItemGridDimension = { col: 1, row: 1 };
	protected _lastItemGridDimension: AdGridItemGridDimension = { col: 1, row: 1 };
	protected _userConfig = null;
	protected _resizeHandle: ResizeHandle;
	protected _borderSize: number;
	
	protected _currentRawPosition:AdGridItemRawPosition = { x: 1, y: 1 };
	protected _lastRawPosition:AdGridItemRawPosition = { x: 1, y: 1 };
	
	//protected _added: boolean = false;
	protected _differ: KeyValueDiffer<string, any>;
	protected _cascadeMode: string;
	
	protected _dragHandle: string;
	get sizex(): number {
		return this._itemGridDimension.col;
	}
	get sizey(): number {
		return this._itemGridDimension.row;
	}
	get col(): number {
		return this._currentGridPosition.col;
	}
	get row(): number {
		return this._currentGridPosition.row;
	}
	get currentCol(): number {
		return this._currentGridPosition.col;
	}
	get currentRow(): number {
		return this._currentGridPosition.row;
	}
	
}
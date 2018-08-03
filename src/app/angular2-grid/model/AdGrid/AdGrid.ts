import { AdGridConfig, AdConfigFixDirection, AdGridItemRawPosition } from "..";
import { Observable, Subscription } from "rxjs";
import { KeyValueDiffer, ComponentRef } from "@angular/core";
import { AdGridPlaceholderComponent, AdGridItemDirective } from "../../main";

export class AdGrid{
//	Public variables



public isResizing: boolean = false;
public autoStyle: boolean = true;
public resizeEnable: boolean = true;

public cascade: string = 'up';


//	Private variables

protected _resizeDirection: string = null;
protected _itemsInGrid: Set<string> = new Set<string>();
protected _containerWidth: number;
protected _containerHeight: number;
protected _maxCols: number = 0;
protected _maxRows: number = 0;
protected _visibleCols: number = 0;
protected _visibleRows: number = 0;
// protected _setWidth: number = 250;
// protected _setHeight: number = 250;
protected _posOffset: AdGridItemRawPosition = null;
protected _adding: boolean = false;
protected _placeholderRef: ComponentRef<AdGridPlaceholderComponent> = null;
protected _fixToGrid: boolean = false;
protected _autoResize: boolean = false;
protected _differ: KeyValueDiffer<string, any>;
protected _destroyed: boolean = false;
protected _maintainRatio: boolean = false;
protected _aspectRatio: number;
protected _preferNew: boolean = false;
protected _limitToScreen: boolean = false;
protected _centerToScreen: boolean = false;
protected _curMaxRow: number = 0;
protected _curMaxCol: number = 0;

protected _resizeReady: boolean = false;
protected _elementBasedDynamicRowHeight: boolean = false;
protected _itemFixDirection: AdConfigFixDirection = "cascade";
protected _collisionFixDirection: AdConfigFixDirection = "cascade";
protected _cascadePromise: Promise<void>;

// Events
protected _documentMousemove$: Observable<MouseEvent>;
protected _documentMouseup$: Observable<MouseEvent>;
protected _mousedown$: Observable<MouseEvent>;
protected _mousemove$: Observable<MouseEvent>;
protected _mouseup$: Observable<MouseEvent>;
protected _touchstart$: Observable<TouchEvent>;
protected _touchmove$: Observable<TouchEvent>;
protected _touchend$: Observable<TouchEvent>;
protected _subscriptions: Subscription[] = [];

protected _enabledListener: boolean = false;

//	Default config
protected static CONST_DEFAULT_CONFIG: AdGridConfig = {
	margins: [10],
	draggable: true,
	resizable: true,
	max_cols: 0,
	max_rows: 0,
	visible_cols: 0,
	visible_rows: 0,
	col_width: 250,
	row_height: 250,
	cascade: 'up',
	min_width: 100,
	min_height: 100,
	fix_to_grid: false,
	auto_style: true,
	auto_resize: false,
	maintain_ratio: false,
	prefer_new: false,
	zoom_on_drag: false,
	limit_to_screen: false,
	center_to_screen: false,
	element_based_row_height: false,
	fix_item_position_direction: "cascade",
	fix_collision_position_direction: "cascade",
};
	
}
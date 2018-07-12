import {
	Directive,
	DoCheck,
	ElementRef,
	KeyValueDiffers,
	OnDestroy,
	OnInit,
	Renderer2,
	ViewContainerRef,
	QueryList,
	ContentChildren
  } from "@angular/core";
import { AdGridDirective } from "../ad-grid/ad-grid.directive";
import {
  AdGridItemConfig,
  GRID_ITEM_DEFAULT_CONFIG
} from "../model";
import { AdGridItemDraghandleDirective } from "../ad-grid-item-draghandle/ad-grid-item-draghandle.directive";
import { AdGridItemDirectiveWithMixins } from "./AdGridItemDirectiveWithMixins";


@Directive({
  selector: "[adGridItem]",
  inputs: ["config: adGridItem"]
})
//
export class AdGridItemDirective extends AdGridItemDirectiveWithMixins
  implements OnInit, OnDestroy, DoCheck{
  //	Event Emitters

  //private dragControl :AdDrag = new AdDrag();
  dragValue: string = "target drag";
  constructor(
    protected _differs: KeyValueDiffers,
    protected _ngEl: ElementRef,
    protected _renderer: Renderer2,
    protected _AdGrid: AdGridDirective,
    public containerRef: ViewContainerRef,
  ) {
	super(_differs, _ngEl, _renderer, _AdGrid, containerRef);
	
	
  }
  @ContentChildren(AdGridItemDraghandleDirective, {descendants: true}) 
  dragHandles: QueryList<AdGridItemDraghandleDirective>;
 
//   ngAfterContentInit() {
// 	console.log('dragHandles', this.dragHandles);
// }
  //	[ad-grid-item] handler
  set config(v: AdGridItemConfig) {
    this._userConfig = v;

    const configObject = Object.assign({}, GRID_ITEM_DEFAULT_CONFIG, v);
    for (let x in GRID_ITEM_DEFAULT_CONFIG)
      if (configObject[x] == null)
        configObject[x] = GRID_ITEM_DEFAULT_CONFIG[x];

    this.setConfig(configObject);

    if (this._userConfig != null) {
      if (this._differ == null) {
        this._differ = this._differs.find(this._userConfig).create();
      }

      this._differ.diff(this._userConfig);
    }

    if (!this._added) {
      this._added = true;
      this._AdGrid.addItem(this);
    }

    this._recalculateDimensions();
    this._recalculatePosition();
  }

  public onCascadeEvent(): void {
    this.onConfigChangeEvent();
  }

  public ngOnInit(): void {
    this._renderer.addClass(this._ngEl.nativeElement, "grid-item");
    if (this._AdGrid.autoStyle)
      this._renderer.setStyle(this._ngEl.nativeElement, "position", "absolute");
    this._recalculateDimensions();
    this._recalculatePosition();

    //	Force a config update in case there is no config assigned
    this.config = this._userConfig;
  }

  public onMouseMove(event: any): void {
    this.onMouseMove$.emit(event);
    if (this._AdGrid.autoStyle) {
      this._renderer.setStyle(this._ngEl.nativeElement, "cursor", "default");
    }

    if (this._AdGrid.autoStyle) {
      if (this._AdGrid.resizeEnable) {
        const resizeDirection = this.canResize(event);

        let cursor: string = "default";
        switch (resizeDirection) {
          case "bottomright":
          case "topleft":
            cursor = "nwse-resize";
            break;
          case "topright":
          case "bottomleft":
            cursor = "nesw-resize";
            break;
          case "top":
          case "bottom":
            cursor = "ns-resize";
            break;
          case "left":
          case "right":
            cursor = "ew-resize";
            break;
          default:
            if (this._AdGrid.dragEnable && this.canDrag(event)) {
              cursor = "move";
            }
            break;
        }

        this._renderer.setStyle(this._ngEl.nativeElement, "cursor", cursor);
      } 
    }

    if (this._AdGrid.autoStyle) {
      if (this._AdGrid.dragEnable && this.canDrag(event)) {
        this._renderer.setStyle(this._ngEl.nativeElement, "cursor", "move");
      }
    }

  }

  public ngOnDestroy(): void {
    if (this._added) this._AdGrid.removeItem(this);
  }

  //	Getters

  //	Setters
  public setConfig(config: AdGridItemConfig): void {
    this._config = config;

    this._payload = config.payload;
    this._currentPosition.col = config.col
      ? config.col
      : GRID_ITEM_DEFAULT_CONFIG.col;
    this._currentPosition.row = config.row
      ? config.row
      : GRID_ITEM_DEFAULT_CONFIG.row;
    this._size.x = config.sizex ? config.sizex : GRID_ITEM_DEFAULT_CONFIG.sizex;
    this._size.y = config.sizey ? config.sizey : GRID_ITEM_DEFAULT_CONFIG.sizey;
    this._dragHandle = config.dragHandle;
    this._resizeHandle = config.resizeHandle;
    this._borderSize = config.borderSize;
    this.isDraggable = config.draggable ? true : false;
    this.isResizable = config.resizable ? true : false;
    this.isFixed = config.fixed ? true : false;

    this._maxCols =
      !isNaN(config.maxCols) && isFinite(config.maxCols) ? config.maxCols : 0;
    this._minCols =
      !isNaN(config.minCols) && isFinite(config.minCols) ? config.minCols : 0;
    this._maxRows =
      !isNaN(config.maxRows) && isFinite(config.maxRows) ? config.maxRows : 0;
    this._minRows =
      !isNaN(config.minRows) && isFinite(config.minRows) ? config.minRows : 0;

    this.minWidth =
      !isNaN(config.minWidth) && isFinite(config.minWidth)
        ? config.minWidth
        : 0;
    this.minHeight =
      !isNaN(config.minHeight) && isFinite(config.minHeight)
        ? config.minHeight
        : 0;

    if (this._minCols > 0 && this._maxCols > 0 && this._minCols > this._maxCols)
      this._minCols = 0;
    if (this._minRows > 0 && this._maxRows > 0 && this._minRows > this._maxRows)
      this._minRows = 0;

    if (this._added) {
      this._AdGrid.updateItem(this);
    }

    this._size = this.fixSize(this._size);

    this._recalculatePosition();
    this._recalculateDimensions();
  }

  public ngDoCheck(): boolean {
    if (this._differ != null) {
      const changes: any = this._differ.diff(this._userConfig);

      if (changes != null) {
        return this._applyChanges(changes);
      }
    }

    return false;
  }

  //	Private methods

  private _applyChanges(changes: any): boolean {
    let changed: boolean = false;
    const changeCheck = (record: any) => {
      if (this._config[record.key] !== record.currentValue) {
        this._config[record.key] = record.currentValue;
        changed = true;
      }
    };
    changes.forEachAddedItem(changeCheck);
    changes.forEachChangedItem(changeCheck);
    changes.forEachRemovedItem((record: any) => {
      changed = true;
      delete this._config[record.key];
    });

    if (changed) {
      this.setConfig(this._config);
    }

    return changed;
  }

  
}

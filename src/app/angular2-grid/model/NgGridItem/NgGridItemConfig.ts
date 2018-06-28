import { ResizeHandle } from "../ResizeHandle";
export interface NgGridItemConfig {
	uid?: string;
	payload?: any;
	col?: number;
	row?: number;
	sizex?: number;
	sizey?: number;
	dragHandle?: string;
	resizeHandle?: ResizeHandle;
	fixed?: boolean;
	draggable?: boolean;
	resizable?: boolean;
	borderSize?: number;
	maxCols?: number;
	minCols?: number;
	maxRows?: number;
	minRows?: number;
	minWidth?: number;
	minHeight?: number;
}
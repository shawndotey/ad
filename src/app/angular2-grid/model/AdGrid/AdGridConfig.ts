import { AdConfigFixDirection } from "../AdConfigFixDirection";
export interface AdGridConfig {
	margins?: number[];
	draggable?: boolean;
	resizable?: boolean;
	max_cols?: number;
	max_rows?: number;
	visible_cols?: number;
	visible_rows?: number;
	min_cols?: number;
	min_rows?: number;
	col_width?: number;
	row_height?: number;
	cascade?: string;
	min_width?: number;
	min_height?: number;
	fix_to_grid?: boolean;
	auto_style?: boolean;
	auto_resize?: boolean;
	maintain_ratio?: boolean;
	prefer_new?: boolean;
	zoom_on_drag?: boolean;
	limit_to_screen?: boolean;
	center_to_screen?: boolean;
	element_based_row_height?: boolean;
	fix_item_position_direction?: AdConfigFixDirection;
	fix_collision_position_direction?: AdConfigFixDirection;
}
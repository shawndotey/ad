export interface MenuModel {
  name: string;
  children?: Partial<MenuModel>[];
  template?: string;
  templateLocation?: string;
}

export class MenuNode implements MenuModel {
  name: string;
  level: number;
  children?: MenuNode[] = [];
  template?: string;
  templateLocation?: string;
  constructor(init?: Partial<MenuNode> | Partial<MenuModel>) {
    Object.assign(this, init);
    this.children = this.children.map(menuNode => new MenuNode(menuNode));
  }
}

export class MenuFlatNode implements MenuModel {
  name: string;
  level: number;
  isExpandable: boolean;
  constructor(init?: Partial<MenuFlatNode> | Partial<MenuModel>) {
    Object.assign(this, init);
  }
}

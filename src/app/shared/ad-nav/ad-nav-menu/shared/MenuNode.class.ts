import { MenuModel } from "./MenuModel.class";
export class MenuNode extends MenuModel {
  level: number;
  children?: MenuNode[] = [];
  constructor(init?: Partial<MenuNode> | Partial<MenuModel>) {
    super();
    Object.assign(this, init);
    this.children = this.children.map(menuNode => new MenuNode(menuNode));
  }
}
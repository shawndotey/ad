import { MenuModel } from "./MenuModel.class";
export class MenuFlatNode extends MenuModel {
  level: number;
  isExpandable: boolean;
  constructor(init?: Partial<MenuFlatNode> | Partial<MenuModel>) {
    super();
    Object.assign(this, init);
  }
}
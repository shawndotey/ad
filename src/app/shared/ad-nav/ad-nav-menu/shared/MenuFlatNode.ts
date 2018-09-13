import { MenuModel } from "./MenuModel.class";
export class MenuFlatNode {
  name: string;
  level: number;
  isExpandable: boolean;
  constructor(init?: Partial<MenuFlatNode> | Partial<MenuModel>) {
    Object.assign(this, init);
  }
}
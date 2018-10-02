import { MenuModel } from "./MenuModel.class";
export class MenuFlatNode extends MenuModel {
  level: number;
  isExpandable: boolean;
  route:string;
  constructor(init?: Partial<MenuFlatNode> | Partial<MenuModel>) {
    super();
    Object.assign(this, init);
  }
}
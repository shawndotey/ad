import { FileDatabaseService } from "./FileDatabaseService";

import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {of as observableOf} from 'rxjs';
/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

export const TREE_DATA = `
  {
    "Documents": {
      "angular": {
        "src": {
          "core": "ts",
          "compiler": "ts"
        }
      },
      "material2": {
        "src": {
          "button": "ts",
          "checkbox": "ts",
          "input": "ts"
        }
      }
    },
    "Downloads": {
        "Tutorial": "html",
        "November": "pdf",
        "October": "pdf"
    },
    "Pictures": {
        "Sun": "png",
        "Woods": "jpg",
        "Photo Booth Library": {
          "Contents": "dir",
          "Pictures": "dir"
        }
    },
    "Applications": {
        "Chrome": "app",
        "Calendar": "app",
        "Webstorm": "app"
    }
  }`;

@Component({
  selector: 'ad-dashboard-side-nav',
  templateUrl: './ad-dashboard-side-nav.component.html',
  styleUrls: ['./ad-dashboard-side-nav.component.scss'],
  providers: [FileDatabaseService]
})
export class AdDashboardSideNavComponent implements OnInit {

  ngOnInit() {
  }

  constructor(database:FileDatabaseService) { 

    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => this.nestedDataSource.data = data);

  }

  nestedTreeControl: NestedTreeControl<FileNode>;

  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  private _getChildren = (node: FileNode) => { return observableOf(node.children); };

  hasNestedChild = (_: number, nodeData: FileNode) => {return !(nodeData.type); };

 
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileNode, TREE_DATA } from "./ad-dashboard-side-nav.component";
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabaseService {
  dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);
  get data(): FileNode[] { return this.dataChange.value; }
  constructor() {
    this.initialize();
  }
  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);
    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);
    // Notify the change.
    this.dataChange.next(data);
  }
  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(value: any, level: number): FileNode[] {
    let data: any[] = [];
    for (let k in value) {
      let v = value[k];
      let node = new FileNode();
      node.filename = `${k}`;
      if (v === null || v === undefined) {
        // no action
      }
      else if (typeof v === 'object') {
        node.children = this.buildFileTree(v, level + 1);
      }
      else {
        node.type = v;
      }
      data.push(node);
    }
    return data;
  }
}
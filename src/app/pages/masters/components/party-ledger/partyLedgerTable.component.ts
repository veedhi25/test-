import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'
import { Router } from "@angular/router";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular-tree-component';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!../Companies/smartTables.scss';
import { TreeViewPartyervice } from "./partyledger.service";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.ACNAME}`);
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
    click: (tree, node, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
    }
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => node.setActiveAndVisible()
    //[KEYS.ENTER]: (tree, node, $event) =>  alert(`This is ${node.data.name}`)
  }
};

@Component({
  selector: "partyLedger",
  templateUrl: "./partyLedgerTable.component.html",
  // styleUrls: ["../../../Style.css",'./modals.scss'],
  providers: [MasterRepo, TreeViewPartyervice, AuthService]

})

export class PartyLedgerComponent implements OnInit {
  @ViewChild('childModal') childModal: ModalDirective;
  DialogMessage: string = "You are not authorized";
  addMode: boolean = false;
  public mode: string;
  public grp: string;
  modeTitle: string;
  loadListSubject: Subject<any> = new Subject<any>();
  loadList$: Observable<any> = this.loadListSubject.asObservable();
  settings = {
    mode: "external",
    add: {
      addButtonContent: '',
    },
    view: {
      viewButtonContent: 'View',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      ACID: {
        title: 'AC ID',
        type: 'number'
      },
      PARENT: {
        title: 'Parent',
        type: 'string'
      },
      ACNAME: {
        title: 'AcName',
        type: 'string'
      }
    }
  };


  private _treeEnable: Boolean = true;

  public get treeEnable(): Boolean { return this._treeEnable; }

  public set treeEnable(value: Boolean) { this._treeEnable = value; }
  public selectedNode: any;
  public nodes: any[] = [];
  @ViewChild(TreeComponent)
  public tree: TreeComponent;
  source: LocalDataSource = new LocalDataSource();
  busy: Subscription;

  constructor(private masterService: MasterRepo, private _authService: AuthService, private router: Router, private partyservice: TreeViewPartyervice) {
    this.masterService.getpartyListTree().map(x => { return x })
    this.busy = this.masterService.getpartyListTree().map(x => { return x })
      .subscribe(res => {
        console.log("check account tree");
        console.log(res);
        this.nodes = res;
        console.log(this.nodes);
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
        console.log(this.tree);
      }, error => {
        this.masterService.resolveError(error, "partyLedger - PartyLedger");
      });


  }

  ngOnInit() {
    let data: Array<any> = [];
    this.loadListSubject.switchMap(snode => {
      data = [];
      return this.partyservice.getParentWisePartyList(snode.ACID)
    })
      .subscribe(res => {
        data.push(<any>res);
        this.source.load(data);
      })
  }

  getChildren(node: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.asyncChildren.map((c) => {
        return Object.assign({}, c, {
          hasChildren: node.level < 5
        });
      })), 1000);
    });
  }

  asyncChildren = [
    {
      name: 'child2.1',
      subTitle: 'new and improved'
    }, {
      name: 'child2.2',
      subTitle: 'new and improved2'
    }
  ];

  addNode(addednode) {
    
    this.tree.treeModel.getFocusedNode().data.children.push(addednode);
    this.tree.treeModel.update();
  }

  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }

  filterNodes(value, tree) {
    try {
      // displayField: 'ACNAME', is required
      this.tree.treeModel.filterNodes(value, true);
    } catch (ex) {
      console.log("PartyFilter", ex);
      alert("PartyFilter-" + ex)
    }
  }

  activateSubSub(tree) {
    // tree.treeModel.getNodeBy((node) => node.data.name === 'subsub')
    tree.treeModel.getNodeById(1001)
      .setActiveAndVisible();
  }

  customTemplateStringOptions = {
    displayField: 'ACNAME',
    isExpandedField: 'expanded',
    idField: 'uuid',
    getChildren: this.getChildren.bind(this),
    actionMapping,
    allowDrag: false
  }

  onEvent($event) {
    console.log.bind(console);
  }
  root: string;

  onselect(tree, $event) {
    this.source = new LocalDataSource();
    console.log(this.tree);
    this.selectedNode = tree.treeModel.getFocusedNode().data;
    this.getRootParent(this.selectedNode, this.nodes);
    console.log(this.selectedNode);
    this.loadListSubject.next(this.selectedNode);


  }



  getList(selNod) {
    //$event.stopPropagation();
    let data: Array<any> = [];
    this.partyservice.getParentWisePartyList(selNod.ACID)
      .subscribe(res => {
        data.push(<any>res);
        this.source.load(data);
      }
      );

  }
  getRootParent(node, list) {
    if (node.PARENTID == "PA") { this.root = node.ACID; return; }
    for (let t of list) {
      if (node.PARENTID != t.ACID) { this.loopingChild(node, t.children, t) }
      else { this.root = t.ACID; }
    }
  }
  loopingChild(node, cList, root) {
    for (let c of cList) {
      if (c != node) { this.loopingChild(node, c.children, root); }
      else { this.root = root.ACID; }
    }
  }
  go($event) {
    $event.stopPropagation();
    alert('this method is on the app component')
  }

  onTreeEnable(value: boolean) {
    this.treeEnable = value;
  }

  AddLedger() {
    this.addMode = true;
    this.modeTitle = "AddLedger"
    this.mode = "add";
    this.grp = "A"
  }

  AddGroup(trees) {
    this.addMode = true;
    this.modeTitle = "AddGroup"
    this.mode = "add";
    this.grp = "G"
  }

  onDeleteConfirm(event): void {
    
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEditClick(event): void {
    this.addMode = true;
    this.mode = "edit";
    this.selectedNode = event.data;
    this.grp = "A"

  }

  onViewClick(event): void {
    this.addMode = true;
    this.mode = "view";
    this.selectedNode = event.data;
    this.grp = "A"
  }

  hideChildModal() {
    this.childModal.hide();
  }
  onAddClose(event) {
    this.addMode = false;
  }
  public contextMenuActions = [
    {
      html: (item) => `Edit`,
      tag: 'edit',
      enabled: (item) => true,
      visible: (item) => true,
    },
    {
      divider: true,
      visible: true,
    },
    {
      html: (item) => `Delete`,
      tag: 'delete',
      enabled: (item) => true,
      visible: (item) => true,
    },
  ];

  contextMenuClick(selecteddata, selectedmenu) {
    if (selectedmenu.tag == "edit") {
      
      this.addMode = true;
      this.mode = "edit";
      this.selectedNode = selecteddata;
      this.grp = "G"
    }
    else if (selectedmenu.tag == "delete") {
      //delete group with validation
    }
  }
  SavePartyEmit(value) {
    
    if (value.type == "G") {
      this.getGivenNode(value.lastparent, this.nodes, value.value);
      this.tree.treeModel.update();
    }
    else {
      var childAccountList = this.masterService.PartialAccountList.filter(a => a.PARENT == value.value.PARENT);
      if (childAccountList.length > 0) {
        console.log("Data from Array");
      //  this.loadListSubject.next(this.selectedNode);
      }
    }
  }
  getGivenNode(nodeid: string, list: any[], savedNode): any {
    for (let ag of list) {
      
      
      if (ag.ACID == nodeid) {
        ag.children.push(savedNode);
        console.log('requiredvalue', ag);
        return ag;
      }
      else if (ag.children && ag.children.length > 0) {
        var node = this.getGivenNode(nodeid, ag.children, savedNode);
        if (node) {
          return node;
        }
      }
    }
    return null;
  }

}

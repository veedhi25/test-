import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'
import { Router } from "@angular/router";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular-tree-component';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!../Companies/smartTables.scss';
import { TreeViewAcService } from './accountLedger.service';
import { Subscription } from "rxjs/Subscription";
import { ContextMenuComponent } from 'ngx-contextmenu';

const actionMapping: IActionMapping = {

  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
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
  selector: "accountLedger",
  templateUrl: "./accountLedgerTable.component.html",
  // styleUrls: ["../../../Style.css"],
  providers: [TreeViewAcService, AuthService]

})

export class AccountLedgerComponent {
  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('fields') fieldsEl: ElementRef;
  DialogMessage: string = "You are not authorized";
  addMode: boolean = false;
  data: Array<any> = [];
  // PartialAccountList: any[] = [];
  settings = {
    mode: "external",
    add: {
      addButtonContent: '',
    },
    // view: {
    //   viewButtonContent: 'View',
    //   saveButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
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
  public mode: string;
  public grp: string;
  PartialAccountList: any[] = [];
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
  loadListSubject: Subject<any> = new Subject<any>();
  loadList$: Observable<any> = this.loadListSubject.asObservable();
  constructor(private masterService: MasterRepo, private _authService: AuthService, private router: Router, private AccountService: TreeViewAcService) {
    console.log({ acledgerTableConstructor: 'initiated' });
    this.busy = this.masterService.getacListTree().map(x => { return x })
      .subscribe(res => {
        console.log("cjeck account tree");
        console.log(res);
        this.nodes = res;
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
        console.log(this.tree);
      }, error => {
          var err= this.masterService.resolveError(error, "accountLedger - accountLedger");
          if(err){alert (err.json());}
        }
      );

  }
  ngOnInit() {
    
    this.loadListSubject.switchMap(snode => {
      this.data = [];
      return this.AccountService.getParentWiseAccountList(snode.ACID)
    })
      .subscribe(res => {
        this.data.push(<any>res);
        this.source.load(this.data);

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
    console.log("TREEMODEL11111111111111");
    var Node = this.tree.treeModel.getFocusedNode();
    // if (fNode == null) {
    //   this.tree.treeModel.nodes.push(addednode);
    // }
    // else {
    //   alert("child")
    this.tree.treeModel.getFocusedNode().data.children.push(addednode);
    // }
    this.tree.treeModel.update();
  }

  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }

  filterNodes(text, tree) {
    try {
      tree.treeModel.filterNodes(text, true);
    } catch (ex) {
      console.log(ex);
      alert(ex);
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
    //$event.stopPropagation();

    this.source = new LocalDataSource();
    console.log(this.tree);
    this.selectedNode = tree.treeModel.getFocusedNode().data;
    this.getRootParent(this.selectedNode, this.nodes);
    this.loadListSubject.next(this.selectedNode);
    var childAccountList = this.masterService.PartialAccountList.filter(a => a.PARENT == this.selectedNode.id);
    // if (childAccountList.length > 0) {
    //   console.log("Data from Array");
    //   this.source.load(childAccountList);
    // }
    // else {

    // }
    // // console.log(this.selectedNode);
    // let data: Array<any> = [];
    // this.AccountService.getParentWiseAccountList(this.selectedNode.ACID)
    //   .subscribe(res => {
    //     data.push(<any>res);
    //     this.masterService.PartialAccountList.push(<any>res);
    //     this.source.load(data);
    //   }
    //   );
    // this.dynamicDDList=[];
    //       this.getNoOfChild(this.nodes.filter(x=>x.ACID==this.root)[0].children,this.root,this.selectedNode.ACID);
    // console.log("testdynamiclist",this.dynamicDDList);
  }
  getRootParent(node, list) {
    if (node.PARENTID == 'BS' || node.PARENTID == 'PL' || node.PARENTID == 'TD') { console.log("return"); this.root = node.ACID; return; }
    for (let t of list) {
      if (node.PARENTID != t.ACID) { this.loopingChild(node, t.children, t); }
      else { this.root = node.PARENTID; }
    }
  }
  loopingChild(node, cList, root) {
    for (let c of cList) {
      if (c != node) { this.loopingChild(node, c.children, root); }
      else { this.root = root.ACID; }
    }
  }

  dynamicDDList: any[] = [];
  getNoOfChild(list, selectedid, rootid) {
    for (let i of list) {
      if (i.ACID == selectedid) { break; }
      else {
        this.dynamicDDList.push({ label: 'Parent' });
        this.getNoOfChild(i.children, selectedid, rootid);
      }
    }
  }


  go($event) {
    $event.stopPropagation();
    alert('this method is on the app component')
  }

  onTreeEnable(value: boolean) {
    this.treeEnable = value;
  }
  modeTitle: string;
  AddLedger() {
    this.addMode = true;
    this.modeTitle = "AddLedger"
    this.mode = "add";
    this.grp = "A"
    return;
  }
  AddSubGroup(trees) {
    this.addMode = true;
    this.modeTitle = "AddSubGroup"
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


  onAddClose(event) {
    
    this.addMode = false;
  }
  hideChildModal() {
    this.childModal.hide();
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
  // AccountTreePart(event){
  //   
  //    let addLedg = { ACID:event.save.ACID,ACNAME:event.save.ACNAME,PARENT:event.save.PARENT};
  //     this.masterService.PartialProductList.push(addLedg);
  //     var childproductList = this.masterService.PartialProductList.filter(p => p.PARENT == this.selectedNode.ACID);
  //     if (childproductList.length > 0) {
  //       this.source.load(childproductList);
  //     }
  // }
  SaveAcEmit(value) {
    
    if (value.type == "G") {
      //  this.addNode(value.value);
      this.getGivenNode(value.lastparent, this.nodes, value.value);
      this.tree.treeModel.update();
    }
    else {
      var childAccountList = this.masterService.PartialAccountList.filter(a => a.PARENT == value.value.PARENT);
      if (childAccountList.length > 0) {
        console.log("Data from Array",this.selectedNode,childAccountList);
        this.source.load(childAccountList);
        // this.loadListSubject.next(this.selectedNode);
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
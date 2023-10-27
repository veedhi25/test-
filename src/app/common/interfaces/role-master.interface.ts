export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
  }

  export class TodoItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
  }

 export class FlatTreeControl<T>{
     
 }

 export const TREE_DATA = {
    Groceries: {
      'Almond Meal flour': null,
      'Organic eggs': null,
      'Protein Powder': null,
      Fruits: {
        Apple: null,
        Berries: ['Blueberry', 'Raspberry'],
        Orange: null
      }
    },
    Reminders: [
      'Cook dinner',
      'Read the Material Design spec',
      'Upgrade Application to Angular'
    ]
  };

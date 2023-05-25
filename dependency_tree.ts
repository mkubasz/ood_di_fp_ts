type TreeNode<T> = {
    name: string;
    value: T;
    children: TreeNode<T>[];
    addChild: (name: string, value: T) => void;
    find: (name: string) => TreeNode<T> | undefined;
  };
  
  const createTreeNode = <T>(name: string, value: T): TreeNode<T> => {
    const children: TreeNode<T>[] = [];
  
    const addChild = (name: string, value: T) => {
      const child = createTreeNode(name, value);
      children.push(child);
    };
  
    const find = (name: string): TreeNode<T> | undefined => {
      if (name === name) {
        return node;
      }
  
      for (const child of children) {
        const result = child.find(name);
        if (result) {
          return result;
        }
      }
  
      return undefined;
    };
  
    const node = {
      value,
      name,
      children,
      addChild,
      find,
    };
  
    return node;
  };
  
  type Tree<T> = {
    root: TreeNode<T>;
  };
  
  const createTree = <T>(name:  string, rootValue: T): Tree<T> => {
    const root = createTreeNode(name, rootValue);
  
    return {
      root,
    };
  };

export type Args<T = any> = T[];
export type Arg = any;

export type Function<T extends Args = Args, R = Arg> = (...args: T) => R;

export const logger = () => {
  const log = (message: string, ...args: Args) => console.log(`[Logger] ${message}`, ...args);
  return {
    info: (message: string, ...args: Args) => log(message, args)
  }
};

export interface Node {
  parents?: Array<Node>;
  name: string;
  value?: Function;
  left?: Node,
  rigth?: Node,
}

export const DIGraph = () => {
  const ast = new Array<Node>;
  return {
    push: <T extends Function, TParent extends Args<Function>>(service: T, ...parents: TParent) => {
      const nodes = parents.map((parent) => {
        return {
          name: parent.name,
          value: parent
        } as Node;
      });
      const postNodes = nodes.filter(node => !ast.find(item => item.name === node.name));
      ast.push(...postNodes);
      ast.push({
        parents: nodes,
        name: service.name,
        value: service
      })
    },
    get: (name: string) => ast.find(item => item.name === name),
    tempIter: ast
  }
};

export const Container = () => {
  const ast = DIGraph();
  return {
    compile: () => {
      logger().info("compile");
      for (const item of ast.tempIter) {
        logger().info(item.name);
      }
    },
    addScope: <T extends Function, TParent extends Args>(service: T, ...parent: TParent) => {
      logger().info("addScope", service);
      logger().info("arguments", parent);
      ast.push(service, ...parent);
    },
    get: <T extends Function>(service: T) => {
      logger().info("Container::get", service);
      if ('name' in service) {
        return ast.get(service.name as string);
      }
    }
  }
}

// Testing part
type DBProvider = ReturnType<typeof DBProvider>;
const DBProvider = () => {
  return {
    test: () => {
      logger().info("db test");
    }
  }
};

type TestService = ReturnType<typeof TestService>;
const TestService = (db: DBProvider) => {
  return {
    test: function() {
      logger().info("test");
      db.test();
    }
  }
};


if (import.meta.main) {
  const di = Container();
  di.addScope(TestService, DBProvider);
  di.addScope(DBProvider);
  di.compile();
  const testService = di.get(TestService);
  console.log(testService?.value?.().test());
}

import { Container, logger } from "./main.ts";

type DBProvider = ReturnType<typeof DBProvider>;
const DBProvider = () => {
    return {
        test: () => {
            logger("db test");
        }
    }
};

type TestService = ReturnType<typeof TestService>;
const TestService = (db: DBProvider) => {
    return {
        test: function () {
            logger("test");
            db.test();
        }
    }
};

export const testScope = () => {
    const di = Container();
    di.addScope(TestService, DBProvider.name);
    di.addScope(DBProvider);
    di.compile();
    const testService = di.get(TestService);
    testService.test();
};

// Assert
testScope();

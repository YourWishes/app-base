"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = require("./Module");
const App_1 = require("./../app/App");
//Testing Subclass
class TestApp extends App_1.default {
}
;
class TestModule extends Module_1.default {
    async init() { this.testInit(); }
}
describe('Module', () => {
    it('should require an App instance', () => {
        expect(() => new TestModule(null)).toThrow();
    });
    it('should be constructable', () => {
        let testApp = new TestApp();
        expect(() => new TestModule(testApp)).not.toThrow();
    });
});
//# sourceMappingURL=Module.test.js.map
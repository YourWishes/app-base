"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Configuration_1 = require("./Configuration");
const fakePath = `${__dirname}/Configuration.test.json`;
const fakeData = require('./Configuration.test.json');
const fakeHerokuData = {
    'NAME': 'Test',
    'GROUP_NAME': 'Test Group'
};
describe('Configuration', () => {
    it('should be constructable', () => {
        expect(() => new Configuration_1.default()).not.toThrow();
    });
    it(`shouldn't have data`, () => {
        expect(new Configuration_1.default().data).toBeUndefined();
    });
});
describe('isHeroku', () => {
    it('should return false on non heroku servers', () => {
        let config = new Configuration_1.default();
        process.env.NODE_HOME = "solaris";
        expect(config.isHeroku()).toEqual(false);
    });
    it('should return true on heroku servers', () => {
        let config = new Configuration_1.default();
        process.env.NODE_HOME = "heroku";
        expect(config.isHeroku()).toEqual(true);
    });
});
describe('getConfigFilePath', () => {
    it('should return a resolved path', () => {
        let config = new Configuration_1.default();
        let path;
        expect(() => path = config.getConfigFilePath()).not.toThrow();
        expect(path).toBeDefined();
        expect(path.length).toBeDefined();
        expect(path.length).toBeGreaterThan(0);
    });
});
describe('loadConfig', () => {
    it('should load the configuration file', async () => {
        let config = new Configuration_1.default();
        process.env.NODE_HOME = "solaris";
        //Override the config path
        config.getConfigFilePath = () => fakePath;
        //Ensure our fake path works.
        expect(config.getConfigFilePath()).toEqual(fakePath);
        await expect(config.loadConfig()).resolves.not.toThrow();
        expect(config.data).toEqual(fakeData);
    });
    it('should error if the file does not exist', async () => {
        let config = new Configuration_1.default();
        process.env.NODE_HOME = "solaris";
        //Override the config path
        config.getConfigFilePath = () => `${fakePath}doesnotexist`;
        await expect(config.loadConfig()).rejects;
    });
    it('should read heroku variables', () => {
        let config = new Configuration_1.default();
        process.env.test = 'Test Value';
        process.env.NODE_HOME = "heroku";
        expect(config.loadConfig()).resolves;
        expect(config.data).toHaveProperty('test');
        expect(config.data['test']).toEqual('Test Value');
    });
});
describe('has', () => {
    it('should return true if the configuration contains the key', () => {
        let config = new Configuration_1.default();
        config.data = fakeData;
        process.env.NODE_HOME = "solaris";
        expect(() => config.has('anything')).not.toThrow();
        expect(config.has('name')).toEqual(true);
        expect(config.has('group')).toEqual(true);
        expect(config.has('group.someChild')).toEqual(true);
        expect(config.has('group.nestedGroup')).toEqual(true);
        expect(config.has('group.nestedGroup.someChild')).toEqual(true);
    });
    it('should return false if the configuration does not contain the key', () => {
        let config = new Configuration_1.default();
        config.data = fakeData;
        process.env.NODE_HOME = "solaris";
        expect(config.has('someChild')).toEqual(false);
        expect(config.has('group.name')).toEqual(false);
        expect(config.has('nestedGroup')).toEqual(false);
        expect(config.has('nestedGroup.group')).toEqual(false);
        expect(config.has('group.nestedGroup.name')).toEqual(false);
    });
    it('should work with heroku variables', () => {
        let config = new Configuration_1.default();
        config.data = fakeHerokuData;
        process.env.NODE_HOME = 'heroku';
        expect(config.has('name')).toEqual(true);
        expect(config.has('group.name')).toEqual(true);
        expect(config.has('group.test')).toEqual(false);
        expect(config.has('name.group')).toEqual(false);
        expect(config.has('test')).toEqual(false);
    });
});
describe('get', () => {
    it('should return null for invalid keys on both heroku and file', () => {
        let config = new Configuration_1.default();
        config.data = fakeData;
        process.env.NODE_HOME = "solaris";
        expect(() => config.get()).not.toThrow();
        expect(config.get()).toBeNull();
        expect(config.get('badkey')).toBeNull();
        expect(config.get('group.test')).toBeNull();
        expect(config.get('name.test')).toBeNull();
        expect(config.get('group.nestedGroup.test')).toBeNull();
        config.data = fakeHerokuData;
        process.env.NODE_HOME = 'heroku';
        expect(() => config.get()).not.toThrow();
        expect(config.get('badkey')).toBeNull();
        expect(config.get('group.test')).toBeNull();
        expect(config.get('name.test')).toBeNull();
        expect(config.get('group.nestedGroup.test')).toBeNull();
    });
    it('should return the correct data on both heroku and file', () => {
        let config = new Configuration_1.default();
        config.data = fakeData;
        process.env.NODE_HOME = "solaris";
        expect(config.get('name')).toEqual(fakeData.name);
        expect(config.get('group.someChild')).toEqual(fakeData.group.someChild);
        expect(config.get('group.nestedGroup.someChild')).toEqual(fakeData.group.nestedGroup.someChild);
        config.data = fakeHerokuData;
        process.env.NODE_HOME = 'heroku';
        expect(config.get('name')).toEqual(fakeHerokuData.NAME);
        expect(config.get('group.name')).toEqual(fakeHerokuData.GROUP_NAME);
    });
});
//# sourceMappingURL=Configuration.test.js.map
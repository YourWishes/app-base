import { ICacheable } from './ICacheable';
import { CacheStore } from './CacheStore';

class CacheStoreObject {
  name:string;

  constructor(name:string) {
    this.name = name;
  }
}

class CacheStoreObjectLookup implements ICacheable<CacheStoreObject> {
  cacheStore:CacheStore<CacheStoreObject>;
}


//Test Cases
let tests = {};
tests[`getObject_Dominic`] = new CacheStoreObject(`Dominic`);
tests[`getObject_Josh`] = new CacheStoreObject(`Josh`);
tests[`getObject_Phi`] = new CacheStoreObject(`Phi`);
tests[`getObject_Samantha`] = new CacheStoreObject(`Samantha`);
tests[`getObject_Rose`] = new CacheStoreObject(`Rose`);
let keys = Object.keys(tests);

let insert = async (store:CacheStore<CacheStoreObject>) => {
  for(let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let val = tests[key];
    let callback = async () => {
      return val;
    };
    await store.get(key, callback);
  }
};







describe('CacheStore', () => {
  it('should require the owner to be a real owner', () => {
    expect(() => new CacheStore<CacheStoreObject>(null)).toThrow();
  });

  it('should construct a valid store', () => {
    let owner = new CacheStoreObjectLookup();
    expect(() => {
      owner.cacheStore = new CacheStore<CacheStoreObject>(owner);
    }).not.toThrow();
  });
});






describe('get', () => {
  let owner = new CacheStoreObjectLookup();
  let store = new CacheStore<CacheStoreObject>(owner);
  owner.cacheStore = store;

  it('should return undefined if the object is not found in the store', async () => {
    await expect(store.get(`getObject_0`)).resolves.toBeUndefined();
  });

  it('should consult the callback for a value', async () => {
    let mockCallback = jest.fn();
    let mockPromise = async ():Promise<CacheStoreObject> => {
      mockCallback();
      return undefined;
    };

    await expect(store.get(`getObject_0`, mockPromise)).resolves.toBeUndefined();
    expect(mockCallback).toHaveBeenCalled();
  });

  it(`should use the callbacks value if it's not found in the store, and store it for later`, async () => {
    let mockCallback = jest.fn();
    let mockStoredObject = new CacheStoreObject('Dominic');
    let mockPromise = async() => {
      mockCallback();
      return mockStoredObject;
    };

    await expect(store.get(`getObject_0`, mockPromise)).resolves.toEqual(mockStoredObject);
    await expect(store.get(`getObject_0`)).resolves.toEqual(mockStoredObject);

    let newMockStoredObject = new CacheStoreObject('Josh');
    let newMockPromise = async() => {
      mockCallback();
      return newMockStoredObject;
    };
    await expect(store.get(`getObject_0`, newMockPromise)).resolves.toEqual(mockStoredObject);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it(`should store multiple objects in the store and return correctly`, async () => {
    await insert(store);

    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      await expect(store.get(key)).resolves.toEqual(tests[key]);
    };
  });
});






describe('delete', () => {
  it('should delete an object by key', async () => {
    //Create our dummy store
    let owner = new CacheStoreObjectLookup();
    let store = new CacheStore<CacheStoreObject>(owner);
    await insert(store);

    await expect(store.get(`getObject_Phi`)).resolves.toEqual(tests[`getObject_Phi`]);

    //Now delete
    store.delete(`getObject_Phi`);
    await expect(store.get(`getObject_Phi`)).resolves.toBeUndefined();
    await expect(store.get(`getObject_Dominic`)).resolves.toEqual(tests[`getObject_Dominic`]);
  });

  it('should delete an array of objects', async () => {
    //Create our dummy store.
    let owner = new CacheStoreObjectLookup();
    let store = new CacheStore<CacheStoreObject>(owner);
    await insert(store);

    //Confirm the cache
    await expect(store.get(`getObject_Samantha`)).resolves.toEqual(tests[`getObject_Samantha`]);
    await expect(store.get(`getObject_Rose`)).resolves.toEqual(tests[`getObject_Rose`]);

    //Delete
    store.delete([ `getObject_Samantha`, `getObject_Rose` ]);

    //Confirm
    await expect(store.get(`getObject_Samantha`)).resolves.toBeUndefined();
    await expect(store.get(`getObject_Rose`)).resolves.toBeUndefined();
    await expect(store.get(`getObject_Dominic`)).resolves.toEqual(tests[`getObject_Dominic`]);
  });
});





describe('flush', () => {
  it('should clear the cache store', async () => {
    //Create our dummy store
    let owner = new CacheStoreObjectLookup();
    let store = new CacheStore<CacheStoreObject>(owner);
    await insert(store);

    //Confirm the entire store
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      await expect(store.get(key)).resolves.toEqual(tests[key]);
    }

    //Now flush
    expect(() => store.flush()).not.toThrow();

    //Now confirm
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      await expect(store.get(key)).resolves.toBeUndefined();
    }
  });
});

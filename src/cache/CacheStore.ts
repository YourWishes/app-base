// Copyright (c) 2018 Dominic Masters
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { ICacheable } from './ICacheable';
import * as NodeCache from 'node-cache';

export type getCallback<T> = () => Promise<T>;

export class CacheStore<T> {
  owner:ICacheable<T>;
  store:NodeCache;

  constructor(owner:ICacheable<T>, options:NodeCache.Options = {}) {
    if(owner == null) throw new Error("Invalid Owner");
    this.owner = owner;
    this.store = new NodeCache(options);
  }

  async get(key:string, notFound?:getCallback<T>):Promise<T|undefined> {
    if(!key) return undefined;

    //Let's check the cache
    let value:T = this.store.get(key);

    //Is it undefined (not set?)
    if(typeof value !== typeof undefined) return value;
    if(!notFound) return;

    //Undefined, let's use our callback
    value = await notFound();

    //Is undefined value too?
    if(typeof value === typeof undefined) return;

    //Set into the store
    this.store.set(key, value);

    //Return the value we fetched
    return value || undefined;
  }

  delete(keyOrKeys:string|string[]):void {
    if(!keyOrKeys || !keyOrKeys.length) return;

    let keys:string[];
    
    if(Array.isArray(keyOrKeys)) {
      keys = keyOrKeys;
    } else {
      keys = [ keyOrKeys ];
    }

    this.store.del(keys);
  }

  flush() {
    this.store.flushAll();
  }
}

// Copyright (c) 2019 Dominic Masters
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

/*
  In order to make the CLI work effectively we need to make some assumptions
  about your implementation.

  At the time of writing this (2019/05/19) the assumption is that your program
  will be located in one of the following locations (in this order):
    - dist/index.js
    - dist/private/index.js
    - src/index.js
    - src/private/index.js

  And that *this* package is located:
    - /node_modules/@yourwishes/app-base

  What we're going to attempt to do now is create a CLI wrapper that instances
  your app without starting it.

  Remember how you put your initializer in the constructor rather than the
  async init() of your app? Yep this will break that nicely for you.
*/

import * as path from 'path';
import { App } from './../../app/';
import { useCLI } from './../manager/';

export const cli = () => {
  //Let's create the CLI Callback.
  //This is called by a constructing app PRIOR to the super() call finishing, but
  //after all the common tools (logger, config, etc.) being ready.
  let cliInitialized = false;
  let cliCallback = useCLI((app:App) => {
    cliInitialized = true;//Will make sure things are working fine down low.

    //We are now ready to do CLI stuff here.
    return app.cli.run();
  });

  //Where are we going to begin looking? This should be the directory that the app
  //exists within, in one of the above mentioned directories
  let dir = path.resolve('./');

  //Now that the CLI is ready, the app can initialize safely.
  let result = [
    'dist/index', 'dist/private/index', 'src/index', 'src/private/index',
  ].some(e => {
    //Get the expected path in absolute space
    let p = path.resolve(path.join(dir, e));

    //Now attempt a load
    try {
      //Will throw an error if it can't load, this will also be what FINALLY
      //triggers the app to load (hopefully)
      require(p);

      return cliInitialized;//No matter what, when it's all done it will return true
    } catch(ex) {
      //Return false and check next file, when we reach the last iteration and
      //can't find the app it will make result = false and show an error (below)
      return false;
    }
  });

  //If we have this as false then the app never loaded
  if(!result) console.log('Failed to load app, check directory is correct.');
};

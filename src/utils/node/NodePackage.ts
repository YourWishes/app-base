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

import { Version } from '~update/';
import { fetch } from 'cross-fetch';

/*
  Node package.json type interface
    Limited Subset only.
*/
export type NPMDependencies = {
  [key:string]:string;
}

export type NPMRepository = (
  { type?:string; url?:string; } | string
);

export type NPMPackage = {
  name?:string;
  version?:string;
  description?:string;
  main?:string;
  scripts?:object;
  keywords?:string[];
  author?:string;
  license?:string;
  repository?:NPMRepository;
  devDependencies?:NPMDependencies;
  dependencies?:NPMDependencies;
}

//Version Related
export const getPackageVersion = (ver:string):Version => {
  if(!ver || !ver.length) throw new Error('Version is not a valid string.');
  let bits = ver.split('.');
  if(bits.length != 3) throw new Error('Invalid Version String');
  return bits.map(bit => {
    let b = parseInt(bit.replace(/[^\d]/gi, ''));
    if(isNaN(b) || !isFinite(b)) throw new Error("Invalid Version String");
    return b;
  });
}

export const getGitVersion = async (pkg:NPMPackage):Promise<Version> => {
  let { name, repository } = pkg;
  if(!name || !name.length) throw new Error("Missing name in package data");

  repository = repository || "";
  if(typeof repository['url'] !== typeof undefined) repository = repository['url'];
  if(!repository || !(repository as string).length) throw new Error("Missing repository in package data");

  let parts = (repository as string).split('git+');
  let [ a, b ] = parts;
  a = a && a.length ? a : b;
  a = a.split('.git')[0];



  //Now attempt a git fetch....
  let url = `${a}/raw/master/package.json`;
  let data:NPMPackage;
  try {
    let req = await fetch(url);
    data = await req.json();
    if(!data) throw new Error("No data returned");
  } catch(e) {
    throw new Error("Failed to fetch version information from github.");
  }

  //Now validate
  if(!data.version || !data.version.length) throw new Error("Missing version in github package data");
  let { version } = data;
  return getPackageVersion(version);
};

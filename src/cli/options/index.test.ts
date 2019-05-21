import { getOptionsForArgs } from './';

describe('getOptionsForArgs', () => {
  it('should parse an empty array as such', () => {
    expect(getOptionsForArgs([])).toEqual({ args:{}, flags:{} });
  });
  
  it('should parse flags', () => {
    expect(getOptionsForArgs([ '-d' ])).toEqual({
      args:{d:true},
      flags:{d:true}
    });
    
    expect(getOptionsForArgs([ '-a','-p' ])).toEqual({
      args:{a:true,p:true},
      flags:{a:true,p:true}
    });
    
    expect(getOptionsForArgs([ '-a','-p','-b','-d' ])).toEqual({
      args:{a:true,p:true,b:true,d:true},
      flags:{a:true,p:true,b:true,d:true}
    });
    
    expect(getOptionsForArgs([ '-a','-p','false','-b','true','-d' ])).toEqual({
      args:{a:true,p:false,b:true,d:true},
      flags:{a:true,p:false,b:true,d:true}
    });
  });
  
  it('should parse args', () => {
    expect(getOptionsForArgs([ '-hello', 'world' ])).toEqual({
      args:{hello:"world"},
      flags:{}
    });
    
    expect(getOptionsForArgs([ '-i', 'like', 'trains', ':)' ])).toEqual({
      args:{i: 'like trains :)'},
      flags:{}
    });
    
    expect(getOptionsForArgs([ '-i', 'true', '-hello', 'world', '-e' ])).toEqual({
      args:{i:true, hello: 'world', e: true},
      flags:{i:true,e:true}
    });
  });
});
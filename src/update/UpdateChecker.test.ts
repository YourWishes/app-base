import { UpdateChecker, IUpdateable, Version } from './';
import { App } from './../';

class DummyApp extends App {}

class DummyUpdateable implements IUpdateable {
  current:Version;
  next:Version;
  name:string='Dummy';

  getName():string { return this.name; }

  async getCurrentVersion():Promise<Version> { return this.current; }
  async getNewVersion(): Promise<Version> {return this.next;}
}

describe('UpdateChecker', () => {
  it('should require the base app', () => {
    expect(() => new UpdateChecker(null)).toThrow();
    expect(() => new UpdateChecker(undefined)).toThrow();
    expect(() => new UpdateChecker(new DummyApp())).not.toThrow();
  });
});

describe('addUpdateable', () => {
  it('should add an updateable module', () => {
    let uc = new UpdateChecker(new DummyApp());
    let up0 = new DummyUpdateable();
    let up1 = new DummyUpdateable();

    expect(uc.updateables).toBeDefined();
    expect(uc.updateables).toHaveLength(0);
    expect(() => uc.addUpdateable(up0)).not.toThrow();

    expect(uc.updateables).toContain(up0);
    expect(uc.updateables).not.toContain(up1);
    expect(uc.updateables).toHaveLength(1);

    expect(() => uc.addUpdateable(up1)).not.toThrow();
    expect(uc.updateables).toContain(up0);
    expect(uc.updateables).toContain(up1);
    expect(uc.updateables).toHaveLength(2);
  });

  it('should require a real updateable', () => {
    let uc = new UpdateChecker(new DummyApp());
    expect(() => uc.addUpdateable(null)).toThrow();
    expect(() => uc.addUpdateable(undefined)).toThrow();
  });

  it('should not let me add the same updateable twice', () => {
    let uc = new UpdateChecker(new DummyApp());
    let up0 = new DummyUpdateable();
    let up1 = new DummyUpdateable();

    expect(() => uc.addUpdateable(up0)).not.toThrow();
    expect(uc.updateables).toHaveLength(1);
    expect(() => uc.addUpdateable(up0)).not.toThrow();
    expect(uc.updateables).toHaveLength(1);

    expect(() => uc.addUpdateable(up1)).not.toThrow();
    expect(uc.updateables).toHaveLength(2);
    expect(() => uc.addUpdateable(up1)).not.toThrow();
    expect(uc.updateables).toHaveLength(2);
  });
});

describe('removeUpdateable', () => {
  it('should remove an updateable', () => {
    let uc = new UpdateChecker(new DummyApp());
    let up0 = new DummyUpdateable();
    let up1 = new DummyUpdateable();

    uc.addUpdateable(up0);

    expect(uc.updateables).toHaveLength(1);
    expect(() => uc.removeUpdateable(up0)).not.toThrow();
    expect(uc.updateables).toHaveLength(0);
    expect(() => uc.removeUpdateable(up0)).not.toThrow();
    expect(uc.updateables).toHaveLength(0);

    expect(() => uc.removeUpdateable(up1)).not.toThrow();
    expect(uc.updateables).toHaveLength(0);
  });

  it('should require a real updateable', () => {
    let uc = new UpdateChecker(new DummyApp());
    expect(() => uc.removeUpdateable(null)).toThrow();
    expect(() => uc.removeUpdateable(undefined)).toThrow();
  });

  it('should remove the correct updateable', () => {
    let uc = new UpdateChecker(new DummyApp());
    let up0 = new DummyUpdateable();
    let up1 = new DummyUpdateable();

    uc.addUpdateable(up0);
    uc.addUpdateable(up1);

    expect(uc.updateables).toHaveLength(2);

    expect(() => uc.removeUpdateable(up0)).not.toThrow();
    expect(uc.updateables).not.toContain(up0);
    expect(uc.updateables).toContain(up1);
    expect(uc.updateables).toHaveLength(1);

    expect(() => uc.removeUpdateable(up1)).not.toThrow();
    expect(uc.updateables).not.toContain(up0);
    expect(uc.updateables).not.toContain(up1);
    expect(uc.updateables).toHaveLength(0);
  });
});

describe('start', () => {
  it('should poll the update module for its current and next versions', async () => {
    let uc = new UpdateChecker(new DummyApp());
    let up0 = new DummyUpdateable();

    up0.current = up0.next = [10,1,1];

    uc.addUpdateable(up0);
    await expect(uc.start()).resolves.not.toThrow();
  });
});

import './spec-setup';
import {
  expect,
  it, iit, xit,
  describe,
  inject,
  injectAsync,
  fakeAsync,
  TestComponentBuilder,
  beforeEach,
  beforeEachProviders,
} from 'angular2/testing';
import {CodeRenderer} from '../src/code-renderer.component';


export function main() {

  describe('CodeRenderer', () => {

    it('should run tests', () => {
      expect(true).toBe(true);
    });

  });

}

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
import {
  provide,
  Injectable,
  Renderer,
  Component
} from 'angular2/core';
import {CodeRenderer} from '../src/code-renderer.component';

declare var Prism: any;

export function main() {

  describe('CodeRenderer', () => {
    let tcb;

    beforeEachProviders(() => [
      TestComponentBuilder,
      CodeRenderer,
      Renderer
    ]);

    beforeEach(inject([TestComponentBuilder, Renderer], (_tcb, r) => {
      tcb = _tcb;
    }));

    describe('Rendering', () => {

      it('sets the innerHTML to the code', done => {
        tcb.createAsync(CodeRenderer).then(fixture => {
          let codeRenderer = fixture.componentInstance;
          let el = fixture.nativeElement;
          codeRenderer.code = "Hello World";
          spyOn(Prism, 'highlightElement');

          fixture.detectChanges();

          codeRenderer.render();

          expect(el.querySelector('pre code').innerHTML).toBe('Hello World');
          done();
        })
        .catch(e => done.fail(e));
      });

      it('uses Prism to highlight the code', done => {
        tcb.createAsync(CodeRenderer).then(fixture => {
          let codeRenderer = fixture.componentInstance;
          let el = fixture.nativeElement;
          codeRenderer.code = "Hello World";
          spyOn(Prism, 'highlightElement');

          fixture.detectChanges();

          codeRenderer.render();

          expect(Prism.highlightElement).toHaveBeenCalledWith(
            el.querySelector('pre code'), false, null);
          done();
        })
        .catch(e => done.fail(e));
      });

      describe('Markup', () => {

        it('handles inline tags', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            let el = fixture.nativeElement;
            codeRenderer.language = 'markup';
            codeRenderer.code = '<div></div>';
            spyOn(Prism, 'highlightElement');

            fixture.detectChanges();

            codeRenderer.render();

            expect(el.querySelector('pre code').textContent).toBe('<div></div>');

            done();
          })
          .catch(e => done.fail(e));
        });

        it('handles multiline tags', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            let el = fixture.nativeElement;
            codeRenderer.language = 'markup';
            let list = `
              <ul class="list">
                <li>A</li>
                <li>B</li>
                <li>C</li>
              </div>
            `;
            codeRenderer.code = list;
            spyOn(Prism, 'highlightElement');

            fixture.detectChanges();

            codeRenderer.render();

            let text = el.querySelector('pre code').textContent.trim();
            expect(text).toBe(list.trim());

            done();
          })
          .catch(e => done.fail(e));
        });

        it('is processed in Markdown', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            let el = fixture.nativeElement;
            codeRenderer.language = 'markdown';
            codeRenderer.code = '<div></div>';
            spyOn(Prism, 'highlightElement');

            fixture.detectChanges();

            codeRenderer.render();

            expect(el.querySelector('pre code').textContent).toBe('<div></div>');

            done();
          })
          .catch(e => done.fail(e));
        });

        describe('Angular templates', () => {

          describe('ngFor', () => {

            @Component({
              selector: 'for-component',
              template: `
                <ul>
                  <li *ngFor="#i of [1,2,3]">Item {{ i }}</li>
                </ul>
              `
            })
            class ForComponent {}

            it('removes template tags', done => {
              tcb.createAsync(CodeRenderer).then(fixture => {
                let codeRenderer = fixture.componentInstance;
                let el = fixture.nativeElement;
                codeRenderer.language = 'markup';

                tcb.createAsync(ForComponent).then(forFixture => {
                  forFixture.detectChanges();

                  codeRenderer.code = forFixture.nativeElement.innerHTML;
                  spyOn(Prism, 'highlightElement');

                  fixture.detectChanges();

                  codeRenderer.render();

                  let text = el.querySelector('pre code').textContent.replace(/\s+/g, '');
                  let processed = `
                    <ul>
                      <li>Item 1</li>
                      <li>Item 2</li>
                      <li>Item 3</li>
                    </ul>
                  `;
                  expect(text).toBe(processed.replace(/\s+/g, ''));

                  done();

                });
              })
              .catch(e => done.fail(e));
            });

          });

          describe('ngSwitch', () => {

            @Component({
              selector: 'switch-component',
              template: `
              <div [ngSwitch]="3">
                <template [ngSwitchWhen]="1">A</template>
                <template ngSwitchWhen="2">B</template>
                <template ngSwitchDefault>C</template>
              </div>
              `
            })
            class SwitchComponent {}

            it('removes template tags', done => {
              tcb.createAsync(CodeRenderer).then(fixture => {
                let codeRenderer = fixture.componentInstance;
                let el = fixture.nativeElement;
                codeRenderer.language = 'markup';

                tcb.createAsync(SwitchComponent).then(switchFixture => {
                  switchFixture.detectChanges();

                  codeRenderer.code = switchFixture.nativeElement.innerHTML;
                  spyOn(Prism, 'highlightElement');

                  fixture.detectChanges();

                  codeRenderer.render();

                  let text = el.querySelector('pre code').textContent.replace(/\s+/g, '');
                  let processed = `
                    <div>C</div>
                  `;
                  expect(text).toBe(processed.replace(/\s+/g, ''));

                  done();

                });
              })
              .catch(e => done.fail(e));
            });

          });

          describe('ngIf', () => {

            @Component({
              selector: 'if-component',
              template: `
                <div *ngIf="false">var y = 3;</div>
                <div *ngIf="true">var y = 4;</div>
              `
            })
            class IfComponent {}

            it('removes template tags', done => {
              tcb.createAsync(CodeRenderer).then(fixture => {
                let codeRenderer = fixture.componentInstance;
                let el = fixture.nativeElement;
                codeRenderer.language = 'markup';

                tcb.createAsync(IfComponent).then(ifFixture => {
                  ifFixture.detectChanges();

                  codeRenderer.code = ifFixture.nativeElement.innerHTML;
                  spyOn(Prism, 'highlightElement');

                  fixture.detectChanges();

                  codeRenderer.render();

                  let text = el.querySelector('pre code').textContent.trim();
                  expect(text).toBe('<div>var y = 4;</div>');

                  done();

                });
              })
              .catch(e => done.fail(e));
            });

          });


        });

      });


    });

    describe("Empty", () => {

      it('clears the code', done => {
        tcb.createAsync(CodeRenderer).then(fixture => {
          let codeRenderer = fixture.componentInstance;
          let el = fixture.nativeElement;
          codeRenderer.code = "Hello World";
          spyOn(Prism, 'highlightElement');

          fixture.detectChanges();

          codeRenderer.render();
          codeRenderer.empty();

          expect(el.querySelector('pre').innerHTML).toBe('');
          done();
        })
        .catch(e => done.fail(e));
      });

    });

    describe('Inputs', () => {

      it('sets the prompt as a data attribute', done => {
        tcb.createAsync(CodeRenderer).then(fixture => {
          let codeRenderer = fixture.componentInstance;
          let el = fixture.nativeElement;
          codeRenderer.prompt = "&";
          spyOn(Prism, 'highlightElement');

          fixture.detectChanges();

          codeRenderer.render();

          expect(el.querySelector('pre').getAttribute('data-prompt')).toBe('&');
          done();
        })
        .catch(e => done.fail(e));
      });

      it('sets the outputLines as a data attribute', done => {
        tcb.createAsync(CodeRenderer).then(fixture => {
          let codeRenderer = fixture.componentInstance;
          let el = fixture.nativeElement;
          codeRenderer.outputLines = "1-3,4";
          spyOn(Prism, 'highlightElement');

          fixture.detectChanges();

          codeRenderer.render();

          expect(el.querySelector('pre').getAttribute('data-output')).toBe('1-3,4');
          done();
        })
        .catch(e => done.fail(e));
      });

    });

    describe('Styling classes', () => {

      describe("Language", () => {

        it('is set if input is present', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            codeRenderer.language = 'javascript';

            expect(codeRenderer.languageClass).toBe('language-javascript');
            done();
          })
          .catch(e => done.fail(e));
        });

        it('is undefined if input is missing', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;

            expect(codeRenderer.languageClass).toBe('language-undefined');
            done();
          })
          .catch(e => done.fail(e));
        });

      });

      describe("Line Numbers", () => {

        it('is set if input is present', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            codeRenderer.lineNumbers = true;

            expect(codeRenderer.lineNumbersClass).toBe('line-numbers');
            done();
          })
          .catch(e => done.fail(e));
        });

        it('is not set if input is missing', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            codeRenderer.lineNumbers = false;

            expect(codeRenderer.lineNumbersClass).toBe('');
            done();
          })
          .catch(e => done.fail(e));
        });

      });

      describe("Shell", () => {

        it('is set if input is present', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            codeRenderer.shell = 'bash';

            expect(codeRenderer.shellClass).toBe('command-line');
            done();
          })
          .catch(e => done.fail(e));
        });

        it('is not set if input is missing', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;

            expect(codeRenderer.shellClass).toBe('');
            done();
          })
          .catch(e => done.fail(e));
        });

      });

      describe("Code", () => {

        it('are set', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            codeRenderer.language = 'javascript';

            expect(codeRenderer.codeClasses).toBe('language-javascript javascript');
            done();
          })
          .catch(e => done.fail(e));
        });

      });

      describe("Pre", () => {

        it('are set', done => {
          tcb.createAsync(CodeRenderer).then(fixture => {
            let codeRenderer = fixture.componentInstance;
            codeRenderer.lineNumbers = true;
            codeRenderer.language = 'javascript';
            codeRenderer.shell = 'bash';

            expect(codeRenderer.preClasses).toBe('line-numbers language-javascript command-line');
            done();
          })
          .catch(e => done.fail(e));
        });

      });

    });

  });

};

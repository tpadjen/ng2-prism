// import './spec-setup';
// import {
  expect, it, iit, describe, inject, injectAsync, TestComponentBuilder,
  beforeEach, beforeEachProviders
} from '@angular/core/testing';
import { provide, Injectable, Renderer, Component } from 'angular2/core';
import { CodeRendererComponent } from '../src/code-renderer.component';
//
//   describe('CodeRenderer', () => {
//     let tcb;
//
//     beforeEachProviders(() => [
//       TestComponentBuilder,
//       CodeRenderer,
//       Renderer
      CodeRendererComponent,
//
//     beforeEach(inject([TestComponentBuilder, Renderer], (_tcb, r) => {
//       tcb = _tcb;
//     }));
//
//     describe('Rendering', () => {
//
//       it('sets the innerHTML to the code', done => {
//         tcb.createAsync(CodeRenderer).then(fixture => {
//           let codeRenderer = fixture.componentInstance;
        tcb.createAsync(CodeRendererComponent)
          .then(fixture => {
            let codeRenderer = fixture.componentInstance;
            let el = fixture.nativeElement;
            codeRenderer.code = "Hello World";
            spyOn(Prism, 'highlightElement');
//           codeRenderer.render();
            fixture.detectChanges();
//           expect(el.querySelector('pre code').innerHTML).toBe('Hello World');
            codeRenderer.render();
//         })
            expect(el.querySelector('pre code').innerHTML)
              .toBe('Hello World');
            done();
          })
          .catch(e => done.fail(e));
//           let codeRenderer = fixture.componentInstance;
//           let el = fixture.nativeElement;
//           codeRenderer.code = "Hello World";
        tcb.createAsync(CodeRendererComponent)
          .then(fixture => {
            let codeRenderer = fixture.componentInstance;
            let el = fixture.nativeElement;
            codeRenderer.code = "Hello World";
            spyOn(Prism, 'highlightElement');
//           expect(Prism.highlightElement).toHaveBeenCalledWith(
            fixture.detectChanges();
//           done();
            codeRenderer.render();
//         .catch(e => done.fail(e));
            expect(Prism.highlightElement)
              .toHaveBeenCalledWith(
                el.querySelector('pre code'), false, null);
            done();
          })
          .catch(e => done.fail(e));
//             let codeRenderer = fixture.componentInstance;
//             let el = fixture.nativeElement;
//             codeRenderer.language = 'markup';
//             codeRenderer.code = '<div></div>';
//             spyOn(Prism, 'highlightElement');
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              let el = fixture.nativeElement;
              codeRenderer.language = 'markup';
              codeRenderer.code = '<div></div>';
              spyOn(Prism, 'highlightElement');
//             done();
              fixture.detectChanges();
//           .catch(e => done.fail(e));
              codeRenderer.render();
//
              expect(el.querySelector('pre code').textContent)
                .toBe('<div></div>');
//             let codeRenderer = fixture.componentInstance;
              done();
            })
            .catch(e => done.fail(e));
//               <ul class="list">
//                 <li>A</li>
//                 <li>B</li>
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              let el = fixture.nativeElement;
              codeRenderer.language = 'markup';
              let list = `
//             fixture.detectChanges();
//
//             codeRenderer.render();
//
//             let text = el.querySelector('pre code').textContent.trim();
//             expect(text).toBe(list.trim());
              codeRenderer.code = list;
              spyOn(Prism, 'highlightElement');
//           })
              fixture.detectChanges();
//         });
              codeRenderer.render();
//         it('is processed in Markdown', done => {
              let text = el.querySelector('pre code')
                .textContent
                .trim();
              expect(text)
                .toBe(list.trim());
//             spyOn(Prism, 'highlightElement');
              done();
            })
            .catch(e => done.fail(e));
//             codeRenderer.render();
//
//             expect(el.querySelector('pre code').textContent).toBe('<div></div>');
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              let el = fixture.nativeElement;
              codeRenderer.language = 'markdown';
              codeRenderer.code = '<div></div>';
              spyOn(Prism, 'highlightElement');
//
              fixture.detectChanges();
//
              codeRenderer.render();
//               selector: 'for-component',
              expect(el.querySelector('pre code').textContent)
                .toBe('<div></div>');
//                   <li *ngFor="#i of [1,2,3]">Item {{ i }}</li>
              done();
            })
            .catch(e => done.fail(e));
//             class ForComponent {}
//
//             it('removes template tags', done => {
//               tcb.createAsync(CodeRenderer).then(fixture => {
//                 let codeRenderer = fixture.componentInstance;
//                 let el = fixture.nativeElement;
//                 codeRenderer.language = 'markup';
//
//                 tcb.createAsync(ForComponent).then(forFixture => {
//                   forFixture.detectChanges();
//
//                   codeRenderer.code = forFixture.nativeElement.innerHTML;
//                   spyOn(Prism, 'highlightElement');
//
            class ForComponent {
            }
//                   codeRenderer.render();
//
              tcb.createAsync(CodeRendererComponent)
                .then(fixture => {
                  let codeRenderer = fixture.componentInstance;
                  let el = fixture.nativeElement;
                  codeRenderer.language = 'markup';
//                       <li>Item 3</li>
                  tcb.createAsync(ForComponent)
                    .then(forFixture => {
                      forFixture.detectChanges();
//
                      codeRenderer.code = forFixture.nativeElement.innerHTML;
                      spyOn(Prism, 'highlightElement');
//                 });
                      fixture.detectChanges();
//               .catch(e => done.fail(e));
                      codeRenderer.render();
//
                      let text = el.querySelector('pre code')
                        .textContent
                        .replace(/\s+/g, '');
                      let processed = `
//             @Component({
//               selector: 'switch-component',
//               template: `
//               <div [ngSwitch]="3">
//                 <template [ngSwitchWhen]="1">A</template>
//                 <template ngSwitchWhen="2">B</template>
                      expect(text)
                        .toBe(processed.replace(/\s+/g, ''));
//               `
                      done();
//             class SwitchComponent {}
                    });
                })
                .catch(e => done.fail(e));
//                 let codeRenderer = fixture.componentInstance;
//                 let el = fixture.nativeElement;
//                 codeRenderer.language = 'markup';
//
//                 tcb.createAsync(SwitchComponent).then(switchFixture => {
//                   switchFixture.detectChanges();
//
//                   codeRenderer.code = switchFixture.nativeElement.innerHTML;
//                   spyOn(Prism, 'highlightElement');
//
//                   fixture.detectChanges();
//
//                   codeRenderer.render();
//
//                   let text = el.querySelector('pre code').textContent.replace(/\s+/g, '');
//                   let processed = `
            class SwitchComponent {
            }
//                   expect(text).toBe(processed.replace(/\s+/g, ''));
//
              tcb.createAsync(CodeRendererComponent)
                .then(fixture => {
                  let codeRenderer = fixture.componentInstance;
                  let el = fixture.nativeElement;
                  codeRenderer.language = 'markup';
//             });
                  tcb.createAsync(SwitchComponent)
                    .then(switchFixture => {
                      switchFixture.detectChanges();
//           describe('ngIf', () => {
                      codeRenderer.code = switchFixture.nativeElement.innerHTML;
                      spyOn(Prism, 'highlightElement');
//               selector: 'if-component',
                      fixture.detectChanges();
//                 <div *ngIf="false">var y = 3;</div>
                      codeRenderer.render();
//               `
                      let text = el.querySelector('pre code')
                        .textContent
                        .replace(/\s+/g, '');
                      let processed = `
//               tcb.createAsync(CodeRenderer).then(fixture => {
//                 let codeRenderer = fixture.componentInstance;
                      expect(text)
                        .toBe(processed.replace(/\s+/g, ''));
//
                      done();
//                   ifFixture.detectChanges();
                    });
                })
                .catch(e => done.fail(e));
//
//                   fixture.detectChanges();
//
//                   codeRenderer.render();
//
//                   let text = el.querySelector('pre code').textContent.trim();
//                   expect(text).toBe('<div>var y = 4;</div>');
//
//                   done();
//
//                 });
//               })
//               .catch(e => done.fail(e));
            class IfComponent {
            }
//           });
//
              tcb.createAsync(CodeRendererComponent)
                .then(fixture => {
                  let codeRenderer = fixture.componentInstance;
                  let el = fixture.nativeElement;
                  codeRenderer.language = 'markup';
//
                  tcb.createAsync(IfComponent)
                    .then(ifFixture => {
                      ifFixture.detectChanges();
//
                      codeRenderer.code = ifFixture.nativeElement.innerHTML;
                      spyOn(Prism, 'highlightElement');
//           let codeRenderer = fixture.componentInstance;
                      fixture.detectChanges();
//           codeRenderer.code = "Hello World";
                      codeRenderer.render();
//
                      let text = el.querySelector('pre code')
                        .textContent
                        .trim();
                      expect(text)
                        .toBe('<div>var y = 4;</div>');
//           expect(el.querySelector('pre').innerHTML).toBe('');
                      done();
//         })
                    });
                })
                .catch(e => done.fail(e));
//     });
//
//     describe('Inputs', () => {
//
//         tcb.createAsync(CodeRenderer).then(fixture => {
//           let codeRenderer = fixture.componentInstance;
//           let el = fixture.nativeElement;
//           codeRenderer.prompt = "&";
//
//           fixture.detectChanges();
//
//           codeRenderer.render();
//
        tcb.createAsync(CodeRendererComponent)
          .then(fixture => {
            let codeRenderer = fixture.componentInstance;
            let el = fixture.nativeElement;
            codeRenderer.code = "Hello World";
            spyOn(Prism, 'highlightElement');
//       it('sets the outputLines as a data attribute', done => {
            fixture.detectChanges();
//           let codeRenderer = fixture.componentInstance;
            codeRenderer.render();
            codeRenderer.empty();
//           spyOn(Prism, 'highlightElement');
            expect(el.querySelector('pre').innerHTML)
              .toBe('');
            done();
          })
          .catch(e => done.fail(e));
//           expect(el.querySelector('pre').getAttribute('data-output')).toBe('1-3,4');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//     });
        tcb.createAsync(CodeRendererComponent)
          .then(fixture => {
            let codeRenderer = fixture.componentInstance;
            let el = fixture.nativeElement;
            codeRenderer.prompt = "&";
            spyOn(Prism, 'highlightElement');
//           tcb.createAsync(CodeRenderer).then(fixture => {
            fixture.detectChanges();
//             codeRenderer.language = 'javascript';
            codeRenderer.render();
//             expect(codeRenderer.languageClass).toBe('language-javascript');
            expect(el.querySelector('pre')
              .getAttribute('data-prompt'))
              .toBe('&');
            done();
          })
          .catch(e => done.fail(e));
//           tcb.createAsync(CodeRenderer).then(fixture => {
//             let codeRenderer = fixture.componentInstance;
//
        tcb.createAsync(CodeRendererComponent)
          .then(fixture => {
            let codeRenderer = fixture.componentInstance;
            let el = fixture.nativeElement;
            codeRenderer.outputLines = "1-3,4";
            spyOn(Prism, 'highlightElement');
//       });
            fixture.detectChanges();
//       describe("Line Numbers", () => {
            codeRenderer.render();
//         it('is set if input is present', done => {
            expect(el.querySelector('pre')
              .getAttribute('data-output'))
              .toBe('1-3,4');
            done();
          })
          .catch(e => done.fail(e));
//           })
//           .catch(e => done.fail(e));
//         });
//
//         it('is not set if input is missing', done => {
//           tcb.createAsync(CodeRenderer).then(fixture => {
//             let codeRenderer = fixture.componentInstance;
//             codeRenderer.lineNumbers = false;
//
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              codeRenderer.language = 'javascript';
//         });
              expect(codeRenderer.languageClass)
                .toBe('language-javascript');
              done();
            })
            .catch(e => done.fail(e));
//         it('is set if input is present', done => {
//           tcb.createAsync(CodeRenderer).then(fixture => {
//             let codeRenderer = fixture.componentInstance;
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
//             done();
              expect(codeRenderer.languageClass)
                .toBe('language-undefined');
              done();
            })
            .catch(e => done.fail(e));
//           tcb.createAsync(CodeRenderer).then(fixture => {
//             let codeRenderer = fixture.componentInstance;
//
//             expect(codeRenderer.shellClass).toBe('');
//             done();
//           })
//           .catch(e => done.fail(e));
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              codeRenderer.lineNumbers = true;
//       describe("Code", () => {
              expect(codeRenderer.lineNumbersClass)
                .toBe('line-numbers');
              done();
            })
            .catch(e => done.fail(e));
//
//             expect(codeRenderer.codeClasses).toBe('language-javascript javascript');
//             done();
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              codeRenderer.lineNumbers = false;
//       });
              expect(codeRenderer.lineNumbersClass)
                .toBe('');
              done();
            })
            .catch(e => done.fail(e));
//             let codeRenderer = fixture.componentInstance;
//             codeRenderer.lineNumbers = true;
//             codeRenderer.language = 'javascript';
//             codeRenderer.shell = 'bash';
//
//             expect(codeRenderer.preClasses).toBe('line-numbers language-javascript command-line');
//             done();
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              codeRenderer.shell = 'bash';
//       });
              expect(codeRenderer.shellClass)
                .toBe('command-line');
              done();
            })
            .catch(e => done.fail(e));
// };

          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              expect(codeRenderer.shellClass)
                .toBe('');
              done();
            })
            .catch(e => done.fail(e));
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              codeRenderer.language = 'javascript';
              expect(codeRenderer.codeClasses)
                .toBe('language-javascript javascript');
              done();
            })
            .catch(e => done.fail(e));
          tcb.createAsync(CodeRendererComponent)
            .then(fixture => {
              let codeRenderer = fixture.componentInstance;
              codeRenderer.lineNumbers = true;
              codeRenderer.language = 'javascript';
              codeRenderer.shell = 'bash';
              expect(codeRenderer.preClasses)
                .toBe('line-numbers language-javascript command-line');
              done();
            })
            .catch(e => done.fail(e));
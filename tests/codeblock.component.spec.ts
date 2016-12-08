// import './spec-setup';
// import {
//   expect,
//   it, iit, xit,
//   describe,
//   inject,
//   injectAsync,
//   fakeAsync,
//   TestComponentBuilder,
//   beforeEach,
//   beforeEachProviders,
// } from 'angular2/testing';
// import {
//   Response,
//   ResponseOptions
// } from 'angular2/http';
// import {
//   provide,
//   Injectable,
//   Renderer,
//   Component,
//   ViewChild,
//   Input
// } from 'angular2/core';
// import {CodeblockComponent} from '../src/codeblock.component';
//
// declare var Prism: any;
//
//
// @Component({
//   selector: 'code-renderer',
//   template: ''
// })
// class MockCodeRenderer {
//   @Input() code;
//   @Input() language;
//   @Input() lineNumbers;
//   @Input() shell;
//   @Input() prompt;
//   @Input() outputLines;
// }
//
// export function main() {
//
//   describe('Codeblock', () => {
//     let tcb;
//
//     beforeEachProviders(() => [
//       TestComponentBuilder,
//       CodeblockComponent,
//       Renderer,
//       provide('CodeRenderer', {useClass: MockCodeRenderer})
//     ]);
//
//     beforeEach(inject([TestComponentBuilder, Renderer], (_tcb, r) => {
//       tcb = _tcb;
//     }));
//
//     @Component({
//       selector: 'test',
//       template: `
//         <codeblock #cb>
//           <div>Internal</div>
//         </codeblock>
//       `,
//       directives: [CodeblockComponent]
//     })
//     class TestComponent {
//       @ViewChild('cb') codeblock: CodeblockComponent;
//     }
//
//     describe('Content', () => {
//
//       it('is the internal element', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           expect(tc.codeblock.content.trim()).toBe('<div>Internal</div>');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//     });
//
//     describe('Code', () => {
//
//       it('without a received src or message it is the element content ', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           fixture.detectChanges();
//           expect(tc.codeblock.code.trim()).toBe('<div>Internal</div>');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('with a received src it is the src content', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.sourceReceived(new Response(new ResponseOptions({
//             body: 'Response',
//             url: 'response.txt'
//           })));
//           expect(tc.codeblock.code.trim()).toBe('Response');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('with a message it is the message', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.message('message');
//           expect(tc.codeblock.code.trim()).toBe('message');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//     });
//
//     describe('LineNumbers', () => {
//
//       it('are displayed by default', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           expect(tc.codeblock.shouldDisplayLineNumbers()).toBe(true);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('can be turned off', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.lineNumbers = false;
//           fixture.detectChanges();
//           expect(tc.codeblock.shouldDisplayLineNumbers()).toBe(false);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('are off when showing messages', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.message('message');
//           fixture.detectChanges();
//           expect(tc.codeblock.shouldDisplayLineNumbers()).toBe(false);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('are off when displaying as a shell', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.shell = 'bash';
//           fixture.detectChanges();
//           expect(tc.codeblock.shouldDisplayLineNumbers()).toBe(false);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//     });
//
//     describe('Language', () => {
//
//       it('is set for valid Prism languages', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.language = 'javascript';
//           fixture.detectChanges();
//           expect(tc.codeblock.language).toBe('javascript');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('is undefined for invalid Prism languages', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.language = 'not a Prism language';
//           fixture.detectChanges();
//           expect(tc.codeblock.language).toBe(undefined);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('is undefined when showing a message', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.message('message');
//           fixture.detectChanges();
//           expect(tc.codeblock.language).toBe(undefined);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//     });
//
//     describe('Theme', () => {
//
//       it('defaults to standard', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           expect(tc.codeblock.theme).toBe('standard');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('defaults to okaidia for shells', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.shell = 'bash';
//           fixture.detectChanges();
//           expect(tc.codeblock.theme).toBe('okaidia');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('is settable', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.theme = 'dark';
//           fixture.detectChanges();
//           expect(tc.codeblock.theme).toBe('dark');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//     });
//
//     describe('Src', () => {
//
//       describe('sourceChanged', () => {
//
//         it('sets a loading message', done => {
//           tcb.createAsync(TestComponent).then(fixture => {
//             let tc = fixture.componentInstance;
//             fixture.detectChanges();
//             tc.codeblock.sourceChanged('response.txt');
//             expect(tc.codeblock.code.trim()).toBe('Loading ...');
//             done();
//           })
//           .catch(e => done.fail(e));
//         });
//
//       });
//
//       describe('sourceError', () => {
//
//         it('sets an error message if one is given', done => {
//           tcb.createAsync(TestComponent).then(fixture => {
//             let tc = fixture.componentInstance;
//             fixture.detectChanges();
//             tc.codeblock.sourceError({message: 'error'});
//             expect(tc.codeblock.code.trim()).toBe('error');
//             done();
//           })
//           .catch(e => done.fail(e));
//         });
//
//         it('sets a default error message if one is not given', done => {
//           tcb.createAsync(TestComponent).then(fixture => {
//             let tc = fixture.componentInstance;
//             fixture.detectChanges();
//             tc.codeblock.sourceError({});
//             expect(tc.codeblock.code.trim()).toBe('An error occured.');
//             done();
//           })
//           .catch(e => done.fail(e));
//         });
//
//       });
//
//       describe('sourceReceived', () => {
//
//         describe('sets the language', () => {
//
//           it('when the extension does not match the language name', done => {
//             tcb.createAsync(TestComponent).then(fixture => {
//               let tc = fixture.componentInstance;
//               fixture.detectChanges();
//               tc.codeblock.sourceReceived(new Response(new ResponseOptions({
//                 body: 'Response',
//                 url: 'response.html'
//               })));
//               expect(tc.codeblock.language).toBe('markup');
//               done();
//             })
//             .catch(e => done.fail(e));
//           });
//
//           it('when the extension does match the language name', done => {
//             tcb.createAsync(TestComponent).then(fixture => {
//               let tc = fixture.componentInstance;
//               fixture.detectChanges();
//               tc.codeblock.sourceReceived(new Response(new ResponseOptions({
//                 body: 'Response',
//                 url: 'response.java'
//               })));
//               expect(tc.codeblock.language).toBe('java');
//               done();
//             })
//             .catch(e => done.fail(e));
//           });
//
//           it('unless a language is already set', done => {
//             tcb.createAsync(TestComponent).then(fixture => {
//               let tc = fixture.componentInstance;
//               fixture.detectChanges();
//               tc.codeblock.language = 'javascript';
//               fixture.detectChanges();
//               tc.codeblock.sourceReceived(new Response(new ResponseOptions({
//                 body: 'Response',
//                 url: 'response.java'
//               })));
//               expect(tc.codeblock.language).toBe('javascript');
//               done();
//             })
//             .catch(e => done.fail(e));
//           });
//
//         });
//
//         it('sets the code to the response text', done => {
//           tcb.createAsync(TestComponent).then(fixture => {
//             let tc = fixture.componentInstance;
//             fixture.detectChanges();
//             tc.codeblock.sourceReceived(new Response(new ResponseOptions({
//               body: 'Response',
//               url: 'response.java'
//             })));
//             expect(tc.codeblock.code).toBe('Response');
//             done();
//           })
//           .catch(e => done.fail(e));
//         });
//
//         it('uses entities in typescript response multiline strings', done => {
//           tcb.createAsync(TestComponent).then(fixture => {
//             let tc = fixture.componentInstance;
//             fixture.detectChanges();
//             tc.codeblock.sourceReceived(new Response(new ResponseOptions({
//               body: `
//                 let x = \`
//                   <div>A</div>
//                 \`;
//               `,
//               url: 'response.ts'
//             })));
//             expect(tc.codeblock.code.replace(/\s+/g, '')).toBe(`
//               let x = \`
//                 &lt;div>A&lt;/div>
//               \`;
//             `.replace(/\s+/g, ''));
//             done();
//           })
//           .catch(e => done.fail(e));
//         });
//
//
//       });
//
//     });
//
//     describe('Shell', () => {
//
//       it('is off by default', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           expect(tc.codeblock.isShell()).toBe(false);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('allows bash', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.shell = 'bash';
//           fixture.detectChanges();
//           expect(tc.codeblock.isShell()).toBe(true);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('allows powershell', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.shell = 'powershell';
//           fixture.detectChanges();
//           expect(tc.codeblock.isShell()).toBe(true);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('does not allow other shells', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.shell = 'other shell';
//           fixture.detectChanges();
//           expect(tc.codeblock.isShell()).toBe(false);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       describe('Prompt', () => {
//
//         it('has a default of \'$\'', done => {
//           tcb.createAsync(TestComponent).then(fixture => {
//             let tc = fixture.componentInstance;
//             fixture.detectChanges();
//             expect(tc.codeblock.prompt).toBe('$');
//             done();
//           })
//           .catch(e => done.fail(e));
//         });
//
//         it('is settable', done => {
//           tcb.createAsync(TestComponent).then(fixture => {
//             let tc = fixture.componentInstance;
//             fixture.detectChanges();
//             tc.codeblock.prompt = '%';
//             expect(tc.codeblock.prompt).toBe('%');
//             done();
//           })
//           .catch(e => done.fail(e));
//         });
//
//       });
//
//       describe('OutputLines', () => {
//
//         it('is settable', done => {
//           tcb.createAsync(TestComponent).then(fixture => {
//             let tc = fixture.componentInstance;
//             fixture.detectChanges();
//             tc.codeblock.outputLines = '1,3-6';
//             expect(tc.codeblock.outputLines).toBe('1,3-6');
//             done();
//           })
//           .catch(e => done.fail(e));
//         });
//
//       });
//
//     });
//
//     describe('Bind', () => {
//
//       it('returns a braced version of a string', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           tc.codeblock.outputLines = '1,3-6';
//           expect(tc.codeblock.bind('"name"')).toBe('{{"name"}}');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//     });
//
//     // @Input() outputLines;
//
//     describe('Code Renderer', () => {
//
//       it('sets code', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           let renderer = tc.codeblock.codeRenderer;
//           fixture.detectChanges();
//           expect(renderer.code.trim()).toBe('<div>Internal</div>');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('sets theme', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           let renderer = tc.codeblock.codeRenderer;
//           let div = fixture.nativeElement.querySelector('.codeblock');
//           expect(div.getAttribute('class')).toMatch('standard');
//
//           tc.codeblock.theme = 'dark';
//           fixture.detectChanges();
//
//           div = fixture.nativeElement.querySelector('.codeblock');
//           expect(div.getAttribute('class')).toMatch('dark');
//
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('sets defined languages', done => {
//         Prism.languages = {
//           'ruby': true
//         };
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           let renderer = tc.codeblock.codeRenderer;
//           expect(renderer.language).toBe(undefined);
//           tc.codeblock.language = 'ruby';
//           fixture.detectChanges();
//           expect(renderer.language).toBe('ruby');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('does not set undefined languages', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           let renderer = tc.codeblock.codeRenderer;
//           tc.codeblock.language = 'not a language';
//           fixture.detectChanges();
//           expect(renderer.language).toBe(undefined);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('sets lineNumbers', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           let renderer = tc.codeblock.codeRenderer;
//           expect(renderer.lineNumbers).toBe(true);
//           tc.codeblock.lineNumbers = false;
//           fixture.detectChanges();
//           expect(renderer.lineNumbers).toBe(false);
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('sets shell', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           let renderer = tc.codeblock.codeRenderer;
//           expect(renderer.shell).toBe(null);
//           tc.codeblock.shell = 'bash';
//           fixture.detectChanges();
//           expect(renderer.shell).toBe('bash');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('sets prompt', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           let renderer = tc.codeblock.codeRenderer;
//           expect(renderer.prompt).toBe('$');
//           tc.codeblock.prompt = '!';
//           fixture.detectChanges();
//           expect(renderer.prompt).toBe('!');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//       it('sets outputLines', done => {
//         tcb.createAsync(TestComponent).then(fixture => {
//           let tc = fixture.componentInstance;
//           fixture.detectChanges();
//           let renderer = tc.codeblock.codeRenderer;
//           expect(renderer.outputLines).toBe(undefined);
//           tc.codeblock.outputLines = '1';
//           fixture.detectChanges();
//           expect(renderer.outputLines).toBe('1');
//           done();
//         })
//         .catch(e => done.fail(e));
//       });
//
//     });
//
//
//   });
//
// };

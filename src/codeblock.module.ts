import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeblockComponent } from './codeblock.component';
import { CodeRendererComponent } from './code-renderer.component';
import { DIRECTIVES } from './languages';
import { SrcDirective } from './ng2-src-directive/src.directive';

const COMP_DIRECTIVES = [CodeRendererComponent, CodeblockComponent, SrcDirective];

@NgModule({
  imports: [CommonModule],
  declarations: [...COMP_DIRECTIVES, ...DIRECTIVES],
  exports: [...COMP_DIRECTIVES, ...DIRECTIVES],
  entryComponents: []
})
export class CodeblockModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeblockComponent } from './codeblock.component';
import { CodeRenderer } from './code-renderer.component';

@NgModule({
  imports: [ CommonModule, CodeRenderer ],
  declarations: [ CodeblockComponent ],
  exports: [ CodeblockComponent ]
})
export class CodeblockModule {
}
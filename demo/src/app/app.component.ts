import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title:string = 'app works!';
  public code:string = `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeblockComponent } from './codeblock.component';
import { CodeRendererComponent } from './code-renderer.component';
import { DIRECTIVES } from './languages';
import { SrcDirective } from './ng2-src-directive/src.directive';`;
}

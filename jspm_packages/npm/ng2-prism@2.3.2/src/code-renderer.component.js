/* */ 
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-powershell');
require('prismjs/components/prism-javascript');
Prism.languages.undefined = {};
require('prismjs/plugins/line-numbers/prism-line-numbers');
require('prismjs/plugins/command-line/prism-command-line');
require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
var TEMPLATE_REGEX = /<!--template\sbindings={[^\}]*}-->/g;
var CodeRenderer = (function () {
    function CodeRenderer(_renderer) {
        this._renderer = _renderer;
    }
    CodeRenderer.prototype.render = function () {
        this._replaceCode();
        this._highlight();
    };
    CodeRenderer.prototype.empty = function () {
        if (this._pre) {
            this._pre.nativeElement.innerHTML = "";
        }
    };
    CodeRenderer.prototype._replaceCode = function () {
        this._renderer.setElementProperty(this._pre.nativeElement, 'innerHTML', this._buildCodeElement());
    };
    CodeRenderer.prototype._highlight = function () {
        Prism.highlightElement(this._pre.nativeElement.querySelector('code'), false, null);
        if (this.shell && this.outputLines) {
            this._fixPromptOutputPadding();
        }
    };
    Object.defineProperty(CodeRenderer.prototype, "_processedCode", {
        get: function () {
            return this._isMarkup(this.language) ? this._processMarkup(this.code) : this.code;
        },
        enumerable: true,
        configurable: true
    });
    CodeRenderer.prototype._processMarkup = function (text) {
        return this._replaceTags(this._removeAngularMarkup(text));
    };
    CodeRenderer.prototype._replaceTags = function (text) {
        return text.replace(/(<)([!\/A-Za-z](.|[\n\r])*?>)/g, '&lt;$2');
    };
    CodeRenderer.prototype._removeAngularMarkup = function (html) {
        html = html.replace(/\s_ng[^-]+-[^-]+-[^=]+="[^"]*"/g, '');
        var lines = this._fixIndentation(html);
        lines = lines.filter(function (line) {
            if (line.trim() === '') {
                return true;
            }
            var replaced = line.replace(TEMPLATE_REGEX, '').trim();
            return replaced !== '';
        });
        html = lines.join("\n");
        return html.replace(TEMPLATE_REGEX, '');
    };
    CodeRenderer.prototype._isMarkup = function (language) {
        return language === 'markup' || language === 'markdown';
    };
    CodeRenderer.prototype._buildCodeElement = function () {
        return "<code class=\"" + this.codeClasses + "\">" + this._processedCode + "</code>";
    };
    Object.defineProperty(CodeRenderer.prototype, "languageClass", {
        get: function () {
            return 'language-' + this.language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeRenderer.prototype, "lineNumbersClass", {
        get: function () {
            return this.lineNumbers ? "line-numbers" : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeRenderer.prototype, "shellClass", {
        get: function () {
            return this.shell ? "command-line" : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeRenderer.prototype, "codeClasses", {
        get: function () {
            return this.languageClass + " " + this.language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeRenderer.prototype, "preClasses", {
        get: function () {
            return this.lineNumbersClass + ' ' + this.languageClass + ' ' + this.shellClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeRenderer.prototype, "_codeEl", {
        get: function () {
            return this._pre.nativeElement.querySelector('code');
        },
        enumerable: true,
        configurable: true
    });
    CodeRenderer.prototype._fixPromptOutputPadding = function () {
        if (this._codeEl) {
            var clp = this._codeEl.querySelector('.command-line-prompt');
            if (clp) {
                var promptWidth = this._codeEl.querySelector('.command-line-prompt').clientWidth;
                var prePadding = parseInt(this._getStyle(this._pre.nativeElement, 'padding-left').replace('px', ''), 10);
                this._pre.nativeElement.style.paddingRight = (2 * prePadding + promptWidth / 2) + 'px';
            }
        }
    };
    CodeRenderer.prototype._getStyle = function (oElm, strCssRule) {
        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        }
        else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        }
        return strValue;
    };
    CodeRenderer.prototype._fixIndentation = function (html) {
        var indent = 0;
        var diff = 0;
        var removeLines = [];
        var lines = html.split("\n").map(function (line, index) {
            if (line.trim() === '') {
                if (indent > 0) {
                    removeLines.push(index);
                }
                indent = 0;
                return '';
            }
            var a = line.replace(TEMPLATE_REGEX, '').trim();
            if (a === '') {
                indent = line.match(/^\s*/)[0].length;
                return line;
            }
            else if (indent > 0) {
                length = line.match(/^\s*/)[0].length;
                if (diff === 0) {
                    diff = length - indent;
                }
                if (length >= indent) {
                    return line.slice(diff);
                }
                else {
                    indent = 0;
                }
            }
            return line;
        });
        removeLines.forEach(function (removalIndex) {
            lines.splice(removalIndex, 1);
        });
        return lines;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CodeRenderer.prototype, "code", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CodeRenderer.prototype, "language", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], CodeRenderer.prototype, "lineNumbers", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CodeRenderer.prototype, "shell", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CodeRenderer.prototype, "prompt", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CodeRenderer.prototype, "outputLines", void 0);
    __decorate([
        core_1.ViewChild('preEl'), 
        __metadata('design:type', Object)
    ], CodeRenderer.prototype, "_pre", void 0);
    CodeRenderer = __decorate([
        core_1.Component({
            selector: 'code-renderer',
            template: "\n    <pre #preEl [class]=\"preClasses\"\n      [attr.data-prompt]=\"prompt\"\n      [attr.data-output]=\"outputLines\"\n    ></pre>\n  "
        }), 
        __metadata('design:paramtypes', [core_1.Renderer])
    ], CodeRenderer);
    return CodeRenderer;
}());
exports.CodeRenderer = CodeRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1yZW5kZXJlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2RlLXJlbmRlcmVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBS08sZUFBZSxDQUFDLENBQUE7QUFPdkIsUUFBTywrQkFBK0IsQ0FBQyxDQUFBO0FBQ3ZDLFFBQU8scUNBQXFDLENBQUMsQ0FBQTtBQUM3QyxRQUFPLHFDQUFxQyxDQUFDLENBQUE7QUFDN0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBSy9CLFFBQU8saURBQWlELENBQUMsQ0FBQTtBQUN6RCxRQUFPLGlEQUFpRCxDQUFDLENBQUE7QUFDekQsUUFBTyxpRUFBaUUsQ0FBQyxDQUFBO0FBS3pFLElBQU0sY0FBYyxHQUFHLHFDQUFxQyxDQUFDO0FBZ0I3RDtJQXNDRSxzQkFDVSxTQUFtQjtRQUFuQixjQUFTLEdBQVQsU0FBUyxDQUFVO0lBQUksQ0FBQztJQUVsQyw2QkFBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBS0QsNEJBQUssR0FBTDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUFDLENBQUM7SUFDNUQsQ0FBQztJQU9ELG1DQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFDdkIsV0FBVyxFQUNYLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUN6QixDQUFDO0lBQ0osQ0FBQztJQUtELGlDQUFVLEdBQVY7UUFFRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUks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QUMsZ0JBQVMsQ0FBQyxPQUFPLENBQUM7OzhDQUFBO0lBN0NyQjtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZUFBZTtZQUN6QixRQUFRLEVBQUUsMElBS1Q7U0FDRixDQUFDOztvQkFBQTtJQW1QRixtQkFBQztBQUFELENBQUMsQUFsUEQsSUFrUEM7QUFsUFksb0JBQVksZUFrUHhCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBSZW5kZXJlcixcbiAgVmlld0NoaWxkXG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5cbmRlY2xhcmUgdmFyIFByaXNtOiBhbnk7XG4vKipcbiAqIExhbmd1YWdlIGZpbGVzIHRoYXQgYWxsIGNvbXBvbmVudHMgc2hvdWxkIHJlY29nbml6ZVxuICovXG5pbXBvcnQgJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1iYXNoJztcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXBvd2Vyc2hlbGwnO1xuaW1wb3J0ICdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tamF2YXNjcmlwdCc7XG5QcmlzbS5sYW5ndWFnZXMudW5kZWZpbmVkID0ge307XG5cbi8qKlxuICogUHJpc20gcGx1Z2luc1xuICovXG5pbXBvcnQgJ3ByaXNtanMvcGx1Z2lucy9saW5lLW51bWJlcnMvcHJpc20tbGluZS1udW1iZXJzJztcbmltcG9ydCAncHJpc21qcy9wbHVnaW5zL2NvbW1hbmQtbGluZS9wcmlzbS1jb21tYW5kLWxpbmUnO1xuaW1wb3J0ICdwcmlzbWpzL3BsdWdpbnMvbm9ybWFsaXplLXdoaXRlc3BhY2UvcHJpc20tbm9ybWFsaXplLXdoaXRlc3BhY2UnO1xuXG4vKipcbiAqIFJlcHJlc2VudCB0ZW1wbGF0ZSB0YWdzIGFkZGVkIGJ5IGFuZ3VsYXIgc3RydWN0dXJhbCBkaXJlY3RpdmVzXG4gKi9cbmNvbnN0IFRFTVBMQVRFX1JFR0VYID0gLzwhLS10ZW1wbGF0ZVxcc2JpbmRpbmdzPXtbXlxcfV0qfS0tPi9nO1xuXG4vKipcbiAqIENvZGUgaGlnaGxpZ2h0aW5nIGNvbXBvbmVudFxuICpcbiAqIFVzZWQgaW50ZXJuYWxseSBieSBhIGNvZGVibG9jayB0byBwZXJmb3JtIHRoZSBhY3R1YWwgaGlnaGxpZ2h0aW5nLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2RlLXJlbmRlcmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8cHJlICNwcmVFbCBbY2xhc3NdPVwicHJlQ2xhc3Nlc1wiXG4gICAgICBbYXR0ci5kYXRhLXByb21wdF09XCJwcm9tcHRcIlxuICAgICAgW2F0dHIuZGF0YS1vdXRwdXRdPVwib3V0cHV0TGluZXNcIlxuICAgID48L3ByZT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBDb2RlUmVuZGVyZXIge1xuXG4gIC8qKlxuICAgKiBUaGUgY29kZSB0byBoaWdobGlnaHRcbiAgICovXG4gIEBJbnB1dCgpIGNvZGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxhbmd1YWdlIHRvIHVzZSB3aGVuIGhpZ2hsaWdodGluZyB0aGUgY29kZS5cbiAgICovXG4gIEBJbnB1dCgpIGxhbmd1YWdlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRvIGRpc3BsYXkgbGluZSBudW1iZXJzLlxuICAgKi9cbiAgQElucHV0KCkgbGluZU51bWJlcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgYSBwcm9tcHQgaW4gdGhlIGNvZGVibG9jay4gU2V0IHRvICdiYXNoJyBvciAncG93ZXJzaGVsbCcuXG4gICAqL1xuICBASW5wdXQoKSBzaGVsbDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJvbXB0IHRvIHVzZSB3aGVuIGRpc3BsYXlpbmcgYXMgYSBzaGVsbC5cbiAgICovXG4gIEBJbnB1dCgpIHByb21wdDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIGxpbmVzIG9yIGdyb3VwcyBvZiBsaW5lcyB0byB0cmVhdCBhcyBvdXRwdXRcbiAgICogaW4gYSBzaGVsbCBkaXNwbGF5LlxuICAgKi9cbiAgQElucHV0KCkgb3V0cHV0TGluZXM6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHRlbXBsYXRlIDxwcmU+IHRoYXQgd2lsbCBjb250YWluIHRoZSBjb2RlLlxuICAgKi9cbiAgQFZpZXdDaGlsZCgncHJlRWwnKSBfcHJlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcikgeyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuX3JlcGxhY2VDb2RlKCk7XG4gICAgdGhpcy5faGlnaGxpZ2h0KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIGNvZGUuXG4gICAqL1xuICBlbXB0eSgpIHtcbiAgICBpZiAodGhpcy5fcHJlKSB7IHRoaXMuX3ByZS5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IFwiXCI7IH1cbiAgfVxuXG5cblxuICAvKipcbiAgICogUGxhY2UgdGhlIG5ldyBjb2RlIGVsZW1lbnQgaW4gdGhlIHRlbXBsYXRlXG4gICAqL1xuICBfcmVwbGFjZUNvZGUoKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFByb3BlcnR5KFxuICAgICAgdGhpcy5fcHJlLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAnaW5uZXJIVE1MJyxcbiAgICAgIHRoaXMuX2J1aWxkQ29kZUVsZW1lbnQoKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgYWN0dWFsIGhpZ2hsaWdodGluZ1xuICAgKi9cbiAgX2hpZ2hsaWdodCgpIHtcbiAgICAvLyB0aGlzLl90cnVuY2F0ZUxhcmdlRmlsZXMoKTtcbiAgICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KHRoaXMuX3ByZS5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NvZGUnKSwgZmFsc2UsIG51bGwpO1xuICAgIGlmICh0aGlzLnNoZWxsICYmIHRoaXMub3V0cHV0TGluZXMpIHsgdGhpcy5fZml4UHJvbXB0T3V0cHV0UGFkZGluZygpOyB9XG4gIH1cblxuICAvKipcbiAgICogQ29kZSBwcmVwYXJlZCBmb3IgaGlnaGxpZ2h0aW5nIGFuZCBkaXNwbGF5XG4gICAqL1xuICBnZXQgX3Byb2Nlc3NlZENvZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzTWFya3VwKHRoaXMubGFuZ3VhZ2UpID8gdGhpcy5fcHJvY2Vzc01hcmt1cCh0aGlzLmNvZGUpIDogdGhpcy5jb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBtYXJrdXAgZm9yIGRpc3BsYXkuXG4gICAqL1xuICBfcHJvY2Vzc01hcmt1cCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcGxhY2VUYWdzKHRoaXMuX3JlbW92ZUFuZ3VsYXJNYXJrdXAodGV4dCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSBhbGwgb3BlbmluZyA8IGNoYW5nZWQgdG8gJmx0OyB0byByZW5kZXIgbWFya3VwIGNvcnJlY3RseSBpbnNpZGUgcHJlIHRhZ3NcbiAgICovXG4gIF9yZXBsYWNlVGFncyh0ZXh0KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC8oPCkoWyFcXC9BLVphLXpdKC58W1xcblxccl0pKj8+KS9nLCAnJmx0OyQyJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGJvdGggdGVtcGxhdGUgdGFncyBhbmQgc3R5bGluZyBhdHRyaWJ1dGVzIGFkZGVkIGJ5IHRoZSBhbmd1bGFyMiBwYXJzZXJcbiAgICogYW5kIGZpeCBpbmRlbnRhdGlvbiB3aXRoaW4gY29kZSBlbGVtZW50cyBjcmVhdGVkIGJ5IHN0cnVjdHVyYWwgZGlyZWN0aXZlcy5cbiAgICovXG4gIF9yZW1vdmVBbmd1bGFyTWFya3VwKGh0bWwpOiBzdHJpbmcge1xuICAgIC8vIHJlbW92ZSBzdHlsaW5nIGF0dHJpYnV0ZXMgKF9uZ2NvbnRlbnQgZXRjLilcbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC9cXHNfbmdbXi1dKy1bXi1dKy1bXj1dKz1cIlteXCJdKlwiL2csICcnKTtcblxuICAgIGxldCBsaW5lcyA9IHRoaXMuX2ZpeEluZGVudGF0aW9uKGh0bWwpO1xuXG4gICAgLy8gcmVtb3ZlIGVtcHR5IDwhLS10ZW1wbGF0ZS0tPiBsaW5lc1xuICAgIGxpbmVzID0gbGluZXMuZmlsdGVyKGxpbmUgPT4ge1xuICAgICAgaWYgKGxpbmUudHJpbSgpID09PSAnJykgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgbGV0IHJlcGxhY2VkID0gbGluZS5yZXBsYWNlKFRFTVBMQVRFX1JFR0VYLCAnJykudHJpbSgpO1xuICAgICAgcmV0dXJuIHJlcGxhY2VkICE9PSAnJztcbiAgICB9KTtcblxuICAgIGh0bWwgPSBsaW5lcy5qb2luKFwiXFxuXCIpO1xuXG4gICAgLy8gcmVtb3ZlIDwhLS10ZW1wbGF0ZS0tPiB0YWdzIG9uIGxpbmVzIHdpdGggY29kZVxuICAgIHJldHVybiBodG1sLnJlcGxhY2UoVEVNUExBVEVfUkVHRVgsICcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJcyB0aGUgbGFuZ3VhZ2UgZ2l2ZW4gYSBtYXJrdXAgbGFuZ3VhZ2U/XG4gICAqL1xuICBfaXNNYXJrdXAobGFuZ3VhZ2UpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbGFuZ3VhZ2UgPT09ICdtYXJrdXAnIHx8IGxhbmd1YWdlID09PSAnbWFya2Rvd24nO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIDxjb2RlPiBlbGVtZW50IHdpdGggdGhlIHByb3BlciBjbGFzc2VzIGFuZCBmb3JtYXR0ZWQgY29kZVxuICAgKi9cbiAgX2J1aWxkQ29kZUVsZW1lbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDxjb2RlIGNsYXNzPVwiJHt0aGlzLmNvZGVDbGFzc2VzfVwiPiR7dGhpcy5fcHJvY2Vzc2VkQ29kZX08L2NvZGU+YDtcbiAgfVxuXG4gIC8qKiBTdHlsaW5nIGNsYXNzZXMgKiovXG5cbiAgZ2V0IGxhbmd1YWdlQ2xhc3MoKSB7XG4gICAgcmV0dXJuICdsYW5ndWFnZS0nICsgdGhpcy5sYW5ndWFnZTtcbiAgfVxuXG4gIGdldCBsaW5lTnVtYmVyc0NsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGluZU51bWJlcnMgPyBcImxpbmUtbnVtYmVyc1wiIDogXCJcIjtcbiAgfVxuXG4gIGdldCBzaGVsbENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuc2hlbGwgPyBcImNvbW1hbmQtbGluZVwiIDogXCJcIjtcbiAgfVxuXG4gIGdldCBjb2RlQ2xhc3NlcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmxhbmd1YWdlQ2xhc3MgKyBcIiBcIiArIHRoaXMubGFuZ3VhZ2U7XG4gIH1cblxuICBnZXQgcHJlQ2xhc3NlcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmxpbmVOdW1iZXJzQ2xhc3MgKyAnICcgKyB0aGlzLmxhbmd1YWdlQ2xhc3MgKyAnICcgKyB0aGlzLnNoZWxsQ2xhc3M7XG4gIH1cblxuXG4gIC8qKiBDb2RlIFN0eWxpbmcgKiovXG5cbiAgLyoqXG4gICAqIFRoZSBjb2RlIGVsZW1lbnQgd2l0aGluIDxwcmU+XG4gICAqL1xuICBnZXQgX2NvZGVFbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJlLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignY29kZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYmFjayBwYWRkaW5nIG9uIG91dHB1dCBzaGVsbHMgYmVjYXVzZSBvZiBmbG9hdGVkIGxlZnQgcHJvbXB0XG4gICAqL1xuICBfZml4UHJvbXB0T3V0cHV0UGFkZGluZygpIHtcbiAgICBpZiAodGhpcy5fY29kZUVsKSB7XG4gICAgICBsZXQgY2xwID0gdGhpcy5fY29kZUVsLnF1ZXJ5U2VsZWN0b3IoJy5jb21tYW5kLWxpbmUtcHJvbXB0Jyk7XG4gICAgICBpZiAoY2xwKSB7XG4gICAgICAgIGxldCBwcm9tcHRXaWR0aCA9IHRoaXMuX2NvZGVFbC5xdWVyeVNlbGVjdG9yKCcuY29tbWFuZC1saW5lLXByb21wdCcpLmNsaWVudFdpZHRoO1xuICAgICAgICBsZXQgcHJlUGFkZGluZyA9IHBhcnNlSW50KHRoaXMuX2dldFN0eWxlKHRoaXMuX3ByZS5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICdwYWRkaW5nLWxlZnQnKS5yZXBsYWNlKCdweCcsICcnKSwgMTApO1xuICAgICAgICAgIHRoaXMuX3ByZS5uYXRpdmVFbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9ICgyICogcHJlUGFkZGluZyArIHByb21wdFdpZHRoIC8gMikgKyAncHgnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGFjdHVhbGx5IGFwcGxpZWQgc3R5bGUgb2YgYW4gZWxlbWVudFxuICAgKi9cbiAgX2dldFN0eWxlKG9FbG0sIHN0ckNzc1J1bGUpIHtcbiAgICBsZXQgc3RyVmFsdWUgPSBcIlwiO1xuICAgIGlmIChkb2N1bWVudC5kZWZhdWx0VmlldyAmJiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICBzdHJWYWx1ZSA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUob0VsbSwgXCJcIikuZ2V0UHJvcGVydHlWYWx1ZShzdHJDc3NSdWxlKTtcbiAgICB9IGVsc2UgaWYgKG9FbG0uY3VycmVudFN0eWxlKSB7XG4gICAgICBzdHJDc3NSdWxlID0gc3RyQ3NzUnVsZS5yZXBsYWNlKC9cXC0oXFx3KS9nLCBmdW5jdGlvbiAoc3RyTWF0Y2gsIHAxKXtcbiAgICAgICAgcmV0dXJuIHAxLnRvVXBwZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICAgIHN0clZhbHVlID0gb0VsbS5jdXJyZW50U3R5bGVbc3RyQ3NzUnVsZV07XG4gICAgfVxuICAgIHJldHVybiBzdHJWYWx1ZTtcbiAgfVxuXG4gIC8vIF90cnVuY2F0ZUxhcmdlRmlsZXMoKSB7XG4gIC8vICAgaWYgKHRoaXMuX2NvZGVFbC5pbm5lckhUTUwubGVuZ3RoID4gdGhpcy50cnVuY2F0aW9uU2l6ZSkge1xuICAvLyAgICAgdGhpcy5fY29kZUVsLmlubmVySFRNTCA9IHRoaXMuX2NvZGVFbC5pbm5lckhUTUwuc2xpY2UoMCwgdGhpcy50cnVuY2F0aW9uU2l6ZSkgK1xuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXG5cIiArIHRoaXMudHJ1bmNhdGlvbk1lc3NhZ2UgKyBcIlxcblwiO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXh0cmEgaW5kZW50YXRpb24gaW4gbmdTd2l0Y2hlc1xuICAgKi9cbiAgX2ZpeEluZGVudGF0aW9uKGh0bWw6IHN0cmluZyk6IEFycmF5PHN0cmluZz4ge1xuICAgIGxldCBpbmRlbnQgPSAwO1xuICAgIGxldCBkaWZmID0gMDtcbiAgICBsZXQgcmVtb3ZlTGluZXMgPSBbXTtcbiAgICBsZXQgbGluZXMgPSBodG1sLnNwbGl0KFwiXFxuXCIpLm1hcCgobGluZSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChsaW5lLnRyaW0oKSA9PT0gJycpIHsgLy8gZW1wdHkgbGluZVxuICAgICAgICBpZiAoaW5kZW50ID4gMCkgeyByZW1vdmVMaW5lcy5wdXNoKGluZGV4KTsgfVxuICAgICAgICBpbmRlbnQgPSAwO1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBsZXQgYSA9IGxpbmUucmVwbGFjZShURU1QTEFURV9SRUdFWCwgJycpLnRyaW0oKTtcbiAgICAgIGlmIChhID09PSAnJykgeyAvLyB0ZW1wbGF0ZSBsaW5lXG4gICAgICAgIGluZGVudCA9IGxpbmUubWF0Y2goL15cXHMqLylbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbGluZTtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZW50ID4gMCkgeyAvLyBsaW5lcyBhZnRlciB0ZW1wbGF0ZSBuZWVkIGZpeGluZ1xuICAgICAgICBsZW5ndGggPSBsaW5lLm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aDtcbiAgICAgICAgaWYgKGRpZmYgPT09IDApIHsgLy8gZmluZCB0aGUgYW1vdW50IHRvIGZpeCBpbmRlbnRhdGlvblxuICAgICAgICAgIGRpZmYgPSBsZW5ndGggLSBpbmRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlbmd0aCA+PSBpbmRlbnQpIHsgLy8gZml4IGl0XG4gICAgICAgICAgcmV0dXJuIGxpbmUuc2xpY2UoZGlmZik7XG4gICAgICAgIH0gZWxzZSB7IC8vIHN0b3AgaW5kZW50aW5nXG4gICAgICAgICAgaW5kZW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfSk7XG5cbiAgICAvLyByZW1vdmUgZW1wdHkgbGluZXMgYWRkZWQgYnkgbmdTd2l0Y2hcbiAgICByZW1vdmVMaW5lcy5mb3JFYWNoKHJlbW92YWxJbmRleCA9PiB7XG4gICAgICBsaW5lcy5zcGxpY2UocmVtb3ZhbEluZGV4LCAxKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsaW5lcztcbiAgfVxuXG59XG4iXX0=
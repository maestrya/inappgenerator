import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe {
  constructor(private _sanitizer: DomSanitizer) { }

  transform(value) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(value)
  }
}
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[inputClass]'
})
export class EmptyInputClassDirective {

  constructor( private element: ElementRef, private renderer: Renderer2 ) { }

  @HostListener('input') onInput() {
    const value: string = this.element.nativeElement.value;
    const input = this.element.nativeElement;

    if ( value.length > 0 ) this.renderer.addClass( input, 'has-value' );
    if ( value.length < 1 ) this.renderer.removeClass( input, 'has-value' )
  }

}

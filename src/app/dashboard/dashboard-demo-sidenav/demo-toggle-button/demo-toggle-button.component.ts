import { Component, OnInit, Output, ElementRef, ViewChild, EventEmitter, Input } from '@angular/core';
import {faCog} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-demo-toggle-button',
  templateUrl: './demo-toggle-button.component.html',
  styleUrls: ['./demo-toggle-button.component.scss']
})
export class DemoToggleButtonComponent implements OnInit {
  faCog = faCog;
  @ViewChild('iconContainer') iconContainer: ElementRef;
  
  constructor(private elementRef: ElementRef) { 


    this.css = 'icon-container start';
  }
  @Input()
  isOpen:boolean = false;
  css:string;
  
  @Output() onButtonPress = new EventEmitter<boolean>();
  @Output() onChange = new EventEmitter<boolean>();
  ngOnInit() {
   
  }

  @Output()
  open(){
    this.animateOpen();
    this.isOpen = true;
    this.onChange.emit(this.isOpen);
  }

  @Output()
  close(){
    this.animateClose();
    this.isOpen = false;
    this.onChange.emit(this.isOpen);
  }

  @Output()
  toggle(){
    if(this.isOpen){
      this.close();
    }
    else{
      this.open();
    }
    
    this.onButtonPress.emit(this.isOpen);
  }
  clickToggle(){


  }
  animateOpen(){
   this.css = 'icon-container icon-container-open';
   
  }
  
  animateClose(){
    this.css = 'icon-container icon-container-close';
   
  }
}

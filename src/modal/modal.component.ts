import {Component, OnInit, trigger, state, style, transition, animate, OnDestroy, ViewChild, ViewContainerRef, Compiler, EventEmitter, Output} from '@angular/core';
import {ModalSettings} from './settings.interface';

const animationTime = 200;

@Component({
    selector: 'sc-modal',
    styles: [`
    
        :host {
            display: block;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
        }
        
        .wrapper {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem;
            margin: auto;
            width: 200px;
            height: 200px;
            background: #fff;
            box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
        }
        
        .close {
            position: absolute;
            border: none;
            top: -25px;
            right: -25px;
            width: 50px;
            height: 50px;
            background: #333;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            transition: all 0.3s cubic-bezier(.25,.8,.25,1);
            cursor: pointer;
            outline: none;
        }
        
        .close:hover {
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        }
        
        .close .ex-close {
            position: relative;
            display: inline-block;
            width: 20px;
            height: 20px;
            overflow: hidden;
            padding: 0;
        }
        
        .close .ex-close::before,
        .close .ex-close::after {
            content: '';
            position: absolute;
            height: 4px;
            width: 100%;
            top: 50%;
            left: 0;
            margin-top: -1px;
            background: #fff;
            border-radius: 5px;
        }
        
        .close .ex-close::before { transform: rotate(45deg) }
        .close .ex-close::after { transform: rotate(-45deg) }
    `],
    animations: [
        trigger('overlay', [
            state('void', style({opacity: 0})),
            state('open', style({opacity: 1})),
            transition('void <=> open', animate(`${animationTime}ms ease-in-out`))
        ]),

        trigger('wrapper', [
            state('void', style({opacity: 0, transform: 'translateY(20%)'})),
            state('open', style({opacity: 1, transform: 'translateY(0)'})),
            transition('void <=> open', animate(`${animationTime}ms ease-in-out`))
        ])
    ],
    template: `
        <div class="overlay"  [@overlay]="state" (click)="overlayClose()"></div>
        <div class="wrapper" [@wrapper]="state">
            <button class="close" *ngIf="settings.showCloseButton" (click)="close()">
                <span class="ex-close"></span>
            </button>
            <div #wrapper></div>
        </div>
    `
})
export class ModalComponent {

    @ViewChild('wrapper', {read: ViewContainerRef}) wrapperRef: ViewContainerRef;
    @Output() doClose: EventEmitter<boolean> = new EventEmitter<boolean>();

    settings: ModalSettings;
    state: string = 'open';
    toSet: any;

    constructor(private _comp: Compiler) {}

    createWithComp(modal: any, comp: string) {
        this._comp.compileModuleAndAllComponentsAsync(modal).then(res => {
            let ref = this.wrapperRef.createComponent(res.componentFactories.find(a => a.componentType === comp));
            if (this.toSet) {
                const keys = Object.keys(this.toSet);
                keys.forEach(a => ref.instance[a] = this.toSet[a])
            }
        });
    }

    overlayClose(): void {
        if (this.settings.overlayClickToClose) this.close();
    }

    close(): void {
        this.state = 'void';
        setTimeout(() => this.doClose.emit(true), animationTime)
    }
}
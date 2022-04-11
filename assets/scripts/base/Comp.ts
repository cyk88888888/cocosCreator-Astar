
import { _decorator, Component, Node } from 'cc';
import { emmiter } from './Emmiter';
const { ccclass, property } = _decorator;

@ccclass('Comp')
export class Comp extends Component {
    private _emmitMap: { [event: string]: Function };//已注册的监听事件列表
    protected onEmitter(event: string|number, listener: any) {
        let self = this;
        emmiter.on(event, listener, self);
        if (!self._emmitMap) self._emmitMap = {};
        self._emmitMap[event] = listener;
    }

    protected unEmitter(event: string|number, listener: any) {
        let self = this;
        emmiter.off(event, listener, self);
    }

    protected emit(event: string|number, data: any) {
        emmiter.emit(event, data)
    }

    private dispose() {
        let self = this;
        if (self._emmitMap) {
            for (let event in self._emmitMap) {
                self.unEmitter(event, self._emmitMap[event]);
            }
            self._emmitMap = null;
        }

        // if (self._objTapMap) {
        //     for (let objName in self._objTapMap) {
        //         let obj = self[objName];
        //         if (obj instanceof egret.DisplayObject) obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, self._objTapMap[objName], self);
        //     }
        //     self._objTapMap = null;
        // }
    }

    public get __className(): string {
        let self = this;
        let name = self.name.split('<')[1].split('>')[0];
        return name;
    }

    onDestroy(){
        this.dispose();
        if(self["onExit"]) self["onExit"]();
    }

}


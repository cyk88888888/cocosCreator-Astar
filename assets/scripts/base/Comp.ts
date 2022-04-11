
import { _decorator, Component, Node } from 'cc';
import { emmiter } from './Emmiter';
const { ccclass, property } = _decorator;

@ccclass('Comp')
export class Comp extends Component {
    private _emmitMap: { [event: string]: Function };//已注册的监听事件列表
    private _objTapMap: { [objName: string]: Function };//已添加的显示对象点击事件的记录

    onLoad(){
        let self = this;
        self.ctor_b();
        if(self["ctor"]) self["ctor"]();
        self.ctor_a();
        self.addBtnCLickListener();
    }

    protected ctor_b() { }

    protected ctor_a() { }

    protected onEnter_b() { }

    protected onEnter_a() { }

    protected onExit_b() { }

    protected onExit_a() { }

    protected onEmitter(event: string | number, listener: any) {
        let self = this;
        emmiter.on(event, listener, self);
        if (!self._emmitMap) self._emmitMap = {};
        self._emmitMap[event] = listener;
    }

    protected unEmitter(event: string | number, listener: any) {
        let self = this;
        emmiter.off(event, listener, self);
    }

    protected emit(event: string | number, data: any) {
        emmiter.emit(event, data)
    }

    /**添加按钮点击事件监听**/
    private addBtnCLickListener() {
        let self = this;
        self._objTapMap = {};
        for (let objName in self) {
            let obj = self[objName];
            if (obj instanceof Node) {
                obj.name = objName;
                if (self["_tap_" + objName]) {
                    let tapFunc = self["_tap_" + objName];
                    self._objTapMap[objName] = tapFunc;
                    self.node.on(Node.EventType.TOUCH_END, tapFunc, self);
                }
            }
        }
    }

    private dispose() {
        let self = this;
        if (self._emmitMap) {
            for (let event in self._emmitMap) {
                self.unEmitter(event, self._emmitMap[event]);
            }
            self._emmitMap = null;
        }

        if (self._objTapMap) {
            for (let objName in self._objTapMap) {
                let obj = self[objName];
                if (obj instanceof Node) obj.off(Node.EventType.TOUCH_END, self._objTapMap[objName], self);
            }
            self._objTapMap = null;
        }
    }

    public get __className(): string {
        let self = this;
        let name = self.name.split('<')[1].split('>')[0];
        return name;
    }

    onDestroy() {
        let self = this;
        this.dispose();
        if (self["onExit"]) self["onExit"]();
    }

}


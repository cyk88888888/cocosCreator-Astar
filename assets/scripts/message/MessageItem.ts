
import { _decorator, Component, Node, Label, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('MessageItem')
export class MessageItem extends Component {

    @property({ type: Label })
    public lbl_msg: Label;
   
    public setContent(msg) {
        let self = this;
        self.lbl_msg.string = msg;
        new Tween(this.node)
            .to(0.5,{position:new Vec3(0,60,0)}, { easing: 'elasticOut' })
            .delay(0.8)
            .removeSelf()
            .start();
    }

}


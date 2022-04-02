
import { _decorator, Component, Node, Label, Tween } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('MessageItem')
export class MessageItem extends Component {

    @property({ type: Label })
    public lbl_msg: Label;
   
    public setContent(msg) {
        let self = this;
        self.lbl_msg.string = msg;
    }

}


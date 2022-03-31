
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Nodes
 * DateTime = Tue Mar 29 2022 17:45:03 GMT+0800 (中国标准时间)
 * Author = cyk54088
 * FileBasename = Nodes.ts
 * FileBasenameNoExtension = Nodes
 * URL = db://assets/scripts/Nodes.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Nodes')
export class Nodes extends Component {

    public x: number;
    public y: number;
    public f: number;
    public g: number;
    public h: number;
    public walkable: Boolean = true;//是否可穿越（通常把障碍物节点设置为false）
    public parent: Nodes;
    public costMultiplier: number = 1.0;//代价因子

    public init(x: number, y: number) {
        let self = this;
        self.x = x;
        self.y = y;
    }

    public toString(): String {
        let self = this;
        return "x=" + self.x.toString() + ",y=" + self.y.toString() + ",g=" + Number(self.g).toFixed(1) + ",h=" + Number(self.h).toFixed(1) + ",f=" + Number(self.f).toFixed(1);
    }
}



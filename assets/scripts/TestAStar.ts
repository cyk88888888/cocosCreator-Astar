
import { _decorator, Component, Node, Graphics, UITransform, EventTouch, Vec2 } from 'cc';
import { Grid } from './Grid';
import { Nodes } from './Nodes';
const { ccclass, property } = _decorator;

@ccclass('TestAStar')
export class TestAStar extends Component {
    @property({ type: Graphics })
    public graphicsGrid: Graphics;
    @property({ type: Graphics })
    public graphicsBlock: Graphics;
    @property({ type: Graphics })
    public graphicsPath: Graphics;
    @property({ type: Graphics })
    public graphicsPlayer: Graphics;
    
    private _cellSize: number;
    private _grid: Grid;
    start() {
        let self = this;
        self._cellSize = 40;
        self.node.on(Node.EventType.TOUCH_END,this._tap_grp_container,this);
        self.makeGrid();
        self.makePlayer();
    }

    makeGrid() {
        let self = this;
        let screenWh = self.screenWh;
        let width = screenWh[0];
        let height = screenWh[1];
        let numCols = width / self._cellSize;
        let numRows = height / self._cellSize;

        //绘制白色背景底
        const bg = this.getComponent(Graphics)!;
        bg.clear();
        bg.fillColor.fromHEX('#FFFFFF');
        bg.rect(-width / 2, -height / 2, width, height);
        bg.fill();


        self._grid = new Grid();
        self._grid.init(numCols, numRows);

        let blockGraphics = self.graphicsBlock;
        let bolckCount = Math.floor((self._grid.numCols * self._grid.numRows) / 4);
        for (let i = 0; i < bolckCount; i++) {
            let _x = Math.floor(Math.random() * self._grid.numCols);
            let _y = Math.floor(Math.random() * self._grid.numRows);
            self._grid.setWalkable(_x, _y, false);
            let node = self._grid.getNode(_x, _y);
            blockGraphics.fillColor.fromHEX(self.getColor(node));
            blockGraphics.rect(_x * self._cellSize, _y * self._cellSize, self._cellSize, self._cellSize);
            blockGraphics.fill();
        }


        let lineGraphics = self.graphicsGrid;
        lineGraphics.lineWidth = 2;
        for (let i = 0; i < numCols + 1; i++)//画竖线
        {

            lineGraphics.moveTo(i * self._cellSize, 0);
            lineGraphics.lineTo(i * self._cellSize, numRows * self._cellSize);
        }


        for (let i = 0; i < numRows + 1; i++)//画横线
        {
            lineGraphics.moveTo(0, i * self._cellSize);
            lineGraphics.lineTo(numCols * self._cellSize, i * self._cellSize);
        }
        lineGraphics.stroke();
    }

     /** 生成一个player角色 */
     private makePlayer() {
        let self = this;
        let screenWh = self.screenWh;
        let width = screenWh[0];
        let height = screenWh[1];
        let radius = 15;//半径
        self.graphicsPlayer.fillColor.fromHEX('#ff0000');
        self.graphicsPlayer.circle(0, 0, radius);
        self.graphicsPlayer.fill();
        
        let ranDomStaryPos = self._grid.getRanDomStartPos();
        let _x = ranDomStaryPos.x * self._cellSize + self._cellSize / 2 - width/2;
        let _y = ranDomStaryPos.y * self._cellSize + self._cellSize / 2 - height/2;
        self.graphicsPlayer.node.setPosition(_x, _y);
    }

    private _tap_grp_container(event: EventTouch) {
        let point = new Vec2(event.getLocationX(), event.getLocationY());
        console.log(point);
    }

    private get screenWh() {
        let self = this;
        let transform = self.node.getComponent(UITransform);
        return [transform.contentSize.width, transform.contentSize.height];
    }

    /** 返回节点颜色 */
    private getColor(node: Nodes) {
        let self = this;
        if (!node.walkable)
            return '#000000';
        if (node == self._grid.startNode)
            return '#cccccc';
        if (node == self._grid.endNode)
            return '#ff0000';
        return '#ffffff';
    }
}



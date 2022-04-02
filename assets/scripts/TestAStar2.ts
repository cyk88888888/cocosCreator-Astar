
import { _decorator, Component, Node, Graphics, Label, UITransform, EventTouch, director } from 'cc';
import { AStar } from './astar/AStar';
import { Grid } from './astar/Grid';
import { Nodes } from './astar/Nodes';
const { ccclass, property } = _decorator;

/**
 * 测试AStar（模拟上路、陡坡中行走（代价因子会比平路的大））
 * @author CYK
 */
@ccclass('TestAStar2')
export class TestAStar2 extends Component {

    @property({ type: Graphics })
    public graphicsGrid: Graphics;
    @property({ type: Graphics })
    public graphicsBlock: Graphics;
    @property({ type: Graphics })
    public graphicsPath: Graphics;
    @property({ type: Graphics })
    public graphicsPlayer: Graphics;
    @property({ type: Label })
    public lbl_cost: Label;

    private _cellSize: number;
    private _grid: Grid;
    start() {
        let self = this;
        self._cellSize = 40;
        self.node.on(Node.EventType.TOUCH_END, this._tap_grp_container, this);

        self.initGrid();

        self.onReset();
    }

    private initGrid() {
        let self = this;
        let screenWh = self.screenWh;
        let width = screenWh[0];
        let height = screenWh[1];
        let numCols = Math.ceil(width / self._cellSize);
        let numRows = Math.ceil(height / self._cellSize);

        self._grid = new Grid();
        self._grid.init(numCols, numRows);
        self._grid.setStartNode(1, 1);
        self._grid.setEndNode(self._grid.numCols - 1, self._grid.numRows - 1);

        let lineGraphics = self.graphicsGrid;
        lineGraphics.clear();
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

    /**
    * 重置
    */
    private onReset() {
        let self = this;
        self.graphicsPath.clear();
        for (let i = 0; i < self._grid.numCols; i++) {
            for (let j = 0; j < self._grid.numRows; j++) {
                let node = self._grid.getNode(i, j);
                //为每个节点设置不同的“代价权重因子”
                let mult = Math.sin(i * .50) + Math.cos(j * .2 + i * .05);
                node.costMultiplier = Math.abs(mult) + 1;
                node.walkable = true;
            }
        }
        self.makeGrid();
        self.findPath();
    }

    makeGrid() {
        let self = this;
        let _cellSize = self._cellSize;
        self.lbl_cost.string = "本次寻路总耗时";
        let graphicsPath = self.graphicsPath;
        graphicsPath.clear();
        graphicsPath.lineWidth = 0.5;
        for (let i = 0; i < self._grid.numCols; i++) {
            for (let j = 0; j < self._grid.numRows; j++) {
                let node: Nodes = self._grid.getNode(i, j);
                graphicsPath.fillColor.fromHEX(self.getColor(node));
                graphicsPath.rect(i * _cellSize, j * _cellSize, _cellSize, _cellSize);
                graphicsPath.fill();
            }
        }

    }

    //找路
    private findPath() {
        let self = this;
        let astar: AStar = new AStar();
        if (astar.findPath(self._grid)) {
            self.lbl_cost.string = "本次寻路总耗时: " + astar.costTotTime + "秒";
            self.showPath(astar);
        }
    }

    private showPath(astar: AStar) {
        let self = this;
        let path = astar.path;
        let graphicsPath = self.graphicsPath;
        graphicsPath.lineWidth = 0;
        for (let i = 0; i < path.length; i++) {
            graphicsPath.fillColor.fromHEX('#000000');
            graphicsPath.circle(path[i].x * self._cellSize + self._cellSize / 2, path[i].y * self._cellSize + self._cellSize / 2, self._cellSize / 3);
            graphicsPath.fill();
        }
    }

    private _tap_grp_container(event: EventTouch) {
        let self = this;
        let point = event.getUILocation();
        let xPos = Math.floor(point.x / self._cellSize);
        let yPos = Math.floor(point.y / self._cellSize);

        let node = self._grid.getNode(xPos, yPos);
        if (!node) return;
        self._grid.setWalkable(xPos, yPos, !node.walkable);
        self.makeGrid();
        self.findPath();
    }
    //取得单元格的颜色(与权重因子关联，costMultiplier越小，颜色越深)
    private getColor(node: Nodes) {
        let self = this;
        if (!node.walkable) return '#000000';
        if (node == self._grid.startNode) return '#666666';
        if (node == self._grid.endNode) return '#666666';
        let shade = 300 - 70 * node.costMultiplier;
        // return shade << 16 | shade << 8 | shade;
        return '#14FF00';
    }

    private get screenWh() {
        let self = this;
        let transform = self.node.getComponent(UITransform);
        return [transform.contentSize.width, transform.contentSize.height];
    }

    private onTranslate() {
        director.loadScene('testAStar');
    }

}




import { _decorator, Component, Node, Graphics, UITransform, EventTouch, Vec2, Label } from 'cc';
import { AStar } from './astar/AStar';
import { Grid } from './astar/Grid';
import { Nodes } from './astar/Nodes';
const { ccclass, property } = _decorator;

/**
 * 测试AStar（平路情况下（代价因子一样大））
 * @author CYK
 */
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
    @property({ type: Label })
    public lbl_cost: Label;

    private _cellSize: number;
    private _grid: Grid;
    private _index: number;
    private _path: Nodes[];
    private _startFrame: boolean;
    private _speed: number;//人物移动速度、
    start() {
        let self = this;
        self._cellSize = 40;
        self._speed = 1;
        self.node.on(Node.EventType.TOUCH_END, this._tap_grp_container, this);
        self.onReset();
    }

    makeGrid() {
        let self = this;
        let screenWh = self.screenWh;
        let width = screenWh[0];
        let height = screenWh[1];
        let numCols = Math.ceil(width / self._cellSize);
        let numRows = Math.ceil(height / self._cellSize);

        self._grid = new Grid();
        self._grid.init(numCols, numRows);

        let blockGraphics = self.graphicsBlock;
        blockGraphics.clear();
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

    /** 生成一个player角色 */
    private makePlayer() {
        let self = this;
        let radius = 15;//半径
        self.graphicsPlayer.clear();
        self.graphicsPlayer.fillColor.fromHEX('#ff0000');
        self.graphicsPlayer.circle(0, 0, radius);
        self.graphicsPlayer.fill();

        let ranDomStaryPos = self._grid.getRanDomStartPos();
        let _x = ranDomStaryPos.x * self._cellSize + self._cellSize / 2;
        let _y = ranDomStaryPos.y * self._cellSize + self._cellSize / 2;
        self.graphicsPlayer.node.setPosition(_x, _y);
    }

    private _tap_grp_container(event: EventTouch) {
        let self = this;
        let point = event.getUILocation();
        console.log('getUILocation: ' + event.getUILocation());
        console.log('getLocationInView: ' + event.getLocationInView());
        console.log('getLocation: ' + event.getLocation());
        console.log('getPreviousLocation: ' + event.getPreviousLocation());
        console.log('getStartLocation: ' + event.getStartLocation());
        console.log('getUIStartLocation: ' + event.getUIStartLocation());


        self.graphicsPath.clear();
        let xPos = Math.floor(point.x / self._cellSize);
        let yPos = Math.floor(point.y / self._cellSize);
        let node = self._grid.getNode(xPos, yPos);
        if (!node) return;
        self._grid.setEndNode(xPos, yPos);
        let endNode: Nodes = self._grid.endNode;
        if (endNode.walkable) {
            self.graphicsPath.fillColor.fromHEX(self.getColor(endNode));
            self.graphicsPath.rect(xPos * self._cellSize, yPos * self._cellSize, self._cellSize, self._cellSize);
            self.graphicsPath.fill();
        }
        let playerPos = self.graphicsPlayer.node.position;
        xPos = Math.floor(playerPos.x / self._cellSize);
        yPos = Math.floor(playerPos.y / self._cellSize);
        self._grid.setStartNode(xPos, yPos);
        self.findPath();
    }

    /** 寻路 */
    private findPath() {
        let self = this;
        let astar = new AStar();
        if (astar.findPath(self._grid)) {
            self.lbl_cost.string = "本次寻路总耗时: " + astar.costTotTime + "秒";
            self._path = astar.path;
            self._index = 0;
            self._startFrame = true;
        }
    }

    update(deltaTime: number) {
        let self = this;
        if (!this._startFrame) return;
        let _cellSize = self._cellSize;
        let targetX = self._path[self._index].x * _cellSize + _cellSize / 2;
        let targetY = self._path[self._index].y * _cellSize + _cellSize / 2;

        //把经过的点，涂上黄色
        let passedNode = self._path[self._index];

        self.graphicsPath.fillColor.fromHEX('#ffff00');
        self.graphicsPath.rect(passedNode.x * _cellSize, passedNode.y * _cellSize, _cellSize, _cellSize);
        self.graphicsPath.fill();

        let playerPos = self.graphicsPlayer.node.position;
        let dx = targetX - playerPos.x;
        let dy = targetY - playerPos.y;
        let dist: Number = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) {
            self._index++;//索引加1，即取一个路径节点
            if (self._index >= self._path.length)//达到最后一个节点时，移除ENTER_FRAME监听
            {
                this._startFrame = false;
            }
        } else {
            self.graphicsPlayer.node.setPosition(playerPos.x + dx * self._speed, playerPos.y + dy * self._speed);
        }
    }

    /**
     * 重置
     */
    private onReset() {
        let self = this;
        self.graphicsPath.clear();
        self.makeGrid();
        self.makePlayer();
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
    
    private onTranslate(){

    }
}



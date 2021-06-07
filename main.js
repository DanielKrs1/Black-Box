var shotType = {
    none : -1,
    hit : 0,
    deflection : 1,
    reflection : 2,
    miss : 3
}

class Cell
{
    constructor(x, y, masterGrid)
    {
        this.masterGrid = masterGrid;
        this.x = x;
        this.y = y;
        this.worldX = x * masterGrid.cellSize;
        this.worldY = y * masterGrid.cellSize;

        //for center cells
        this.isMarked = false;
        this.isAtom = false;

        //for edge cells
        this.isOnEdge = masterGrid.IsOnEdge(x, y);
        this.shotType = shotType.none;

        //for corners (not used)
        this.isCorner = (x == 0 || x == masterGrid.width - 1) && (y == 0 || y == masterGrid.height - 1);
    }

    Draw()
    {
        fill(225);
        rect(this.worldX, this.worldY,   this.masterGrid.cellSize, this.masterGrid.cellSize);

        if (this.isOnEdge)
        {
            textSize(grid.cellSize * 0.75);
            var cellSize = this.masterGrid.cellSize;
            var drawX = this.worldX + cellSize / 3.75;
            var drawY = this.worldY + cellSize / 1.5;

            if (this.shotType == shotType.hit)
            {
                fill(255, 0, 0);
                text("H", drawX, drawY);
            } else if (this.shotType == shotType.deflection)
            {
                fill(0, 255, 0);
                text("D", drawX, drawY);
            } else if (this.shotType == shotType.reflection)
            {
                fill(255, 255, 0);
                text("R", drawX, drawY);
            } else if (this.shotType == shotType.miss)
            {
                fill(100, 100, 255);
                text("M", drawX, drawY);
            }
        } else if (this.isMarked)
        {
            fill(255, 0, 0);
            var halfCellSize = this.masterGrid.cellSize / 2;
            ellipse(this.worldX + halfCellSize, this.worldY + halfCellSize, halfCellSize, halfCellSize);
        }
        
        /*
        if (this.isAtom)
        {
            fill(0);
            
            ellipse(this.worldX + halfCellSize, this.worldY + halfCellSize, this.masterGrid.cellSize, this.masterGrid.cellSize);   

        }
        */
    }
}

class Grid
{
    constructor(width, height, cellSize, atomCount)
    {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.grid = [];
        this.cellsWithAtoms = [];

        var cellsWithoutAtoms = [];

        //initialize grid
        for (var x = 0; x < width; x++)
        {
            var temp = [];

            for (var y = 0; y < height; y++)
            {
                var cell = new Cell(x, y, this);

                if (!cell.isOnEdge)
                    cellsWithoutAtoms.push(cell);

                temp.push(cell);
            }

            this.grid.push(temp);
        }

        //place random atoms
        for (var i = 0; i < atomCount; i++)
        {
            var cellIndex = Random(0, cellsWithoutAtoms.length);
            var cell = cellsWithoutAtoms[cellIndex];
            cellsWithoutAtoms.splice(cellIndex, 1);
            cell.isAtom = true;
            this.cellsWithAtoms.push(cell);
        }        
    }

    Draw()
    {
        for (var x = 0; x < this.width; x++)
            for (var y = 0; y < this.height; y++)
                this.GetCell(x, y).Draw();
    }

    IsOnEdge(x, y)
    {
        return x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1;
    }

    GetCell(x, y)
    {
        return this.grid[x][y];
    }
}

var grid = new Grid(8, 8, 30, 6);

function setup()
{
    createCanvas(grid.width * grid.cellSize, grid.height * grid.cellSize);
}

function draw()
{
    grid.Draw();
}

function mousePressed()
{
    if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height)
        return;

    var x = round(mouseX / grid.cellSize - 0.5);
    var y = round(mouseY / grid.cellSize - 0.5);
    var cell = grid.GetCell(x, y);

    if (grid.IsOnEdge(x, y))
    {
        if (cell.isCorner)
            return;

        
    } else
    {
        cell.isMarked = !cell.isMarked;
    }
}

function FireLaser(startCell)
{
    //laser position
    var laserX = startCell.x;
    var laserY = startCell.y;

    //laser velocity
    var xVel = 0;
    var yVel = 0;

    //left edge
    if (startCell.x == 0)
        xVel = 1;
    //right edge
    else if (startCell.x == grid.width - 1)
        xVel = -1;
    //top edge
    else if (startCell.y == 0)
        yVel = 1;
    //bottom edge
    else if (startCell.y == grid.height - 1)
        yVel = -1;

    while (true)
    {
        //move laser
        laserX += xVel;
        laserY += yVel;
        var laserCell = grid.GetCell(laserX, laserY);

        if (laserCell.isOnEdge)
        {
            //laser exited box, it's a deflection
            //TODO: remove miss, it's not actually necessary
        }

        //loop through each cell with an atom
        grid.cellsWithAtoms.forEach(atomCell =>
        {
            if (laserX == atomCell.x && laserY == atomCell.y)
            {
                //it was a hit !!!
            }

            ondddondnfdoon
            //check if laser is one diagonal space away from the cell
            //if ()
        });
    }
}

function Print(message) {
    console.log(message);
}

function Random(min, max)
{
    return Math.floor(min + (max - min) * Math.random());
}
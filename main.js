class Cell
{
    constructor(x, y, grid)
    {
        this.grid = grid;
        this.isEdge = x == 0 || y == 0 || x == grid.width - 1 || y == grid.height - 1;
        this.isAtom = false;
        this.x = x;
        this.y = y;
        this.worldX = x * grid.cellSize;
        this.worldY = y * grid.cellSize;
    }

    Draw()
    {
        fill(225);
        rect(this.worldX, this.worldY,   this.grid.cellSize, this.grid.cellSize);
        fill(225);

        if (this.isAtom)
        {
            var halfCellSize = this.grid.cellsize / 2;
            ellipse(this.worldX + halfCellSize, this.worldY + halfCellSize, this.grid.cellSize, this.grid.cellSize);
        }
    }
}

class Grid
{
    constructor(width, height, cellSize, atomCount)
    {
        var x = random(6, 10);
        console.log(x);

        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.grid = [];

        var cells = [];

        //initialize grid
        for (var x = 0; x < width; x++)
        {
            var temp = [];

            for (var y = 0; y < height; y++)
            {
                var cell = new Cell(x, y, this);
                cells.push(cell);
                temp.push(cell);
            }

            this.grid.push(temp);
        }

        //place random atoms

        TOTOJORFD
    }

    Draw()
    {
        for (var x = 0; x < this.width; x++)
            for (var y = 0; y < this.height; y++)
                this.grid[x][y].Draw();
    }
}

var grid = new Grid(17, 8, 50, 5);

function setup()
{
    createCanvas(grid.width * grid.cellSize, grid.height * grid.cellSize);
    console.log(grid.grid);
}

function draw()
{
    background(220);
    grid.Draw();
}

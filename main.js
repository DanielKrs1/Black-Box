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
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.grid = [];

        var cellsWithoutAtoms = [];

        //initialize grid
        for (var x = 0; x < width; x++)
        {
            var temp = [];

            for (var y = 0; y < height; y++)
            {
                var cell = new Cell(x, y, this);
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
        }        
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
}

function draw()
{
    background(220);
    grid.Draw();
}

//tyler fix this rn if you dont im gonna be pissed
function mousePressed()
{
    if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height)
        return;

    var x = round(mouseX / grid.cellSize - 0.5);
    var y = round(mouseY / grid.cellSize - 0.5);
    //grid[round(mouseX / cellSize - 0.5)][round(mouseY / cellSize - 0.5)].state = selectedCellType;

    //make x and y vars with mouse grid position ok poopyhead
    console.log(x);
    console.log(y);
    
}

//returns random number from min to max, exclusive to max ok bitch
//Math.random() returns 0 to 1 exclusive to 1 so isn't this right then? NO WHY IS IT WRONG THEN OH WAIT I SEE
function Random(min, max)
{
    return min + (max - min) * Math.random();
}
fnodffindf
//TODO: TEST RANDOM FUNCTION
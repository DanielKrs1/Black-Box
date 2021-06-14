var shotType = {
    none : -1,
    hit : 0,
    deflection : 1,
    reflection : 2
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
        this.deflectionIndex = -1;

        //for corners (not used)
        this.isCorner = (x == 0 || x == masterGrid.width - 1) && (y == 0 || y == masterGrid.height - 1);
    }

    Draw()
    {
        if (this.isCorner)
            return;

        if (this.isOnEdge)
            fill(120);
        else
            fill(80);

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
                text(this.deflectionIndex, drawX, drawY);
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
    }

    Reveal(isGuessed)
    {   
        if (isGuessed)
        {
            if (this.isAtom)
                fill(0, 255, 0);
            else
                fill(255, 0, 0);

            var halfCellSize = this.masterGrid.cellSize / 2;
            ellipse(this.worldX + halfCellSize, this.worldY + halfCellSize, halfCellSize, halfCellSize);
        } else if (this.isAtom)
        {
            fill(0);
            var halfCellSize = this.masterGrid.cellSize / 2;
            ellipse(this.worldX + halfCellSize, this.worldY + halfCellSize, halfCellSize, halfCellSize);
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

    Reveal()
    {
        for (var x = 0; x < this.width; x++)
            for (var y = 0; y < this.height; y++)
            {
                var cell = this.GetCell(x, y);
                cell.Reveal(guessedCells.includes(cell));
            }
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

var grid = new Grid(10, 10, 50, 5);
var deflectionCount = 0;
var guessedCells = [];
var isOver;

function setup()
{
    createCanvas(grid.width * grid.cellSize, grid.height * grid.cellSize);
    grid.Draw();

    descriptionText = createP();
    createButton("Submit").mouseClicked(OnSubmit);
    descriptionText.html("There are " + grid.cellsWithAtoms.length + " atoms left.");

    //write instructions
    createP("Black Box Instructions:");
    createP("A single-player game where the goal is to determine the locations of hidden atoms on a grid, or \"black box\". This is achieved by firing lasers into the black box and observing their interactions with the atoms. You can fire lasers by clicking on the bordering boxes and it will display a number/letter that will guide you to the cell");
    createP("Rules:")
    createP("1 - If a laser misses, the box will display M");
    createP("2 - If a laser hits an atom, the box will display H");
    createP("3 - If a laser deflects off an atom, it will display a number in two cells, the one you fired from and the one it deflected to");
    createP("4 - If a laser reflects back to itself, it will display R");
    createP("How to win:")
    createP("After firing the lasers you needed you can click the cells on the grid that you think contain the atom and click the submit button. If you are correct then you win")
}

function mousePressed()
{
    if (isOver || mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height)
        return;

    var x = round(mouseX / grid.cellSize - 0.5);
    var y = round(mouseY / grid.cellSize - 0.5);
    var cell = grid.GetCell(x, y);

    if (grid.IsOnEdge(x, y))
    {
        if (cell.isCorner || cell.shotType != shotType.none)
            return;

        FireLaser(cell);
    } else
    {
        if (cell.isMarked)
        {
            cell.isMarked = false;
            guessedCells.splice(guessedCells.indexOf(cell), 1);
        } else if (guessedCells.length < grid.cellsWithAtoms.length)
        {
            cell.isMarked = true;
            guessedCells.push(cell);
        } else
            return;
    }

    descriptionText.html("There are " + (grid.cellsWithAtoms.length - guessedCells.length) + " atoms left.");
    grid.Draw();
}

function OnSubmit()
{
    isOver = true;
    grid.Reveal();

    if (HasWon())
    {
        descriptionText.html("You guessed all the atoms!");
    } else
        descriptionText.html("You lose :(");
}

function HasWon()
{
    if (guessedCells.length < grid.cellsWithAtoms.length)
        return false;
        
    for (var guessedCell of guessedCells)
    {
        if (!grid.cellsWithAtoms.includes(guessedCell))
            return false;
    }

    return true;
}

function FireLaser(startCell)
{
    //laser data
    var laserX = startCell.x;
    var laserY = startCell.y;
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

    var firstMove = true;
    var safety = 0;

    while (safety < 9999)
    {
        safety++;
        console.log(laserX + ", " + laserY);

        //move laser
        laserX += xVel;
        laserY += yVel;
        var laserCell = grid.GetCell(laserX, laserY);

        //did laser exit box?
        if (laserCell.isOnEdge)
        {
            if (laserCell == startCell)
            {
                //laser exited box at the same point it entered, so reflection
                laserCell.shotType = shotType.reflection;
                return;
            } else
            {
                //laser exited at different point, so deflection
                deflectionCount++;
                startCell.shotType = shotType.deflection;
                startCell.deflectionIndex = deflectionCount;
                laserCell.shotType = shotType.deflection;
                laserCell.deflectionIndex = deflectionCount;
                return;
            }
        }

        //did it hit an atom?
        for (var atomCell of grid.cellsWithAtoms)
        {
            if (laserX == atomCell.x && laserY == atomCell.y)
            {
                startCell.shotType = shotType.hit;
                return;
            }
        }

        //check if relfection by immediately entering
        if (firstMove)
        {
            firstMove = false;

            //check if theres an atom left or right of it
            var left = GetBounceVelocity(xVel, yVel, bounceDirection.left);
            var right = GetBounceVelocity(xVel, yVel, bounceDirection.right);

            if (grid.GetCell(laserX + left[0], laserY + left[1]).isAtom)
            {
                startCell.shotType = shotType.reflection;
                return;
            }
            
            if (grid.GetCell(laserX + right[0], laserY + right[1]).isAtom)
            {
                startCell.shotType = shotType.reflection;
                return;
            }
        }

        //bounce logic
        //only bounce if there isn't an atom it's about to hit
        if (!grid.GetCell(laserX + xVel, laserY + yVel).isAtom)
        {
            //Count number of atoms diagonally adjacent (0, 1, or 2)
            var diagonallyAdjacentAtomCount = 0;
            //The direction we would go in
            var tentativeBounceX = xVel;
            var tentativeBounceY = yVel;

            for (var atomCell of grid.cellsWithAtoms)
            {
                //Take atom into account if diagonal to it
                if (abs(laserX - atomCell.x) == 1 && abs(laserY - atomCell.y) == 1)
                {
                    diagonallyAdjacentAtomCount++;
                    var newDirection = Bounce(laserX, laserY, tentativeBounceX, tentativeBounceY, atomCell.x, atomCell.y);
                    tentativeBounceX = newDirection[0];
                    tentativeBounceY = newDirection[1];
                }
            }

            //Turn 180 degrees if hitting 2 atoms
            if (diagonallyAdjacentAtomCount == 2)
            {
                var newDirection = Reflect(xVel, yVel);
                xVel = newDirection[0];
                yVel = newDirection[1];
            } else
            {
                xVel = tentativeBounceX;
                yVel = tentativeBounceY;
            }
        }
    }

    console.error("Laser never hit atom or left box!");
}

var bounceDirection =
{
    left : 0,
    right : 1
}

function Reflect(xVel, yVel)
{
    return [-xVel, -yVel];
}

function Bounce(laserX, laserY, xVel, yVel, atomX, atomY)
{
    //bounce left: (x, y) => (y, -x)
    //bounce right: (x, y) => (-y, x)
    var left = GetBounceVelocity(xVel, yVel, bounceDirection.left);
    var right = GetBounceVelocity(xVel, yVel, bounceDirection.right);

    //Check if atom is left of the cell
    var laserLeftDiagX = laserX + xVel + left[0];
    var laserLeftDiagY = laserY + yVel + left[1];

    if (laserLeftDiagX == atomX && laserLeftDiagY == atomY)
    {
        //atom on left, bounce right
        return right;
    }

    //Check if atom is right of the cell
    var laserRightDiagX = laserX + xVel + right[0];
    var laserRightDiagY = laserY + yVel + right[1];

    if (laserRightDiagX == atomX && laserRightDiagY == atomY)
    {
        //atom on right, bounce left
        return left;
    }
}

function GetBounceVelocity(xVel, yVel, bounceDir)
{
    if (bounceDir == bounceDirection.left)
        return [yVel, -xVel];
    else if (bounceDir == bounceDirection.right)
        return [-yVel, xVel];
}

function Random(min, max)
{
    return Math.floor(min + (max - min) * Math.random());
}
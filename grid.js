class Grid
{
    constructor(width, height, cellSize, originX, originY)
    {
        // Variables 
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.originX = originX;
        this.originY = originY;

        
        //initialize grid
        this.grid = [];

        for (var x = 0; x < width; x++)
        {
            var temp = [];

            for (var y = 0; y < height; y++)
            {
                temp.push(0); //0 would be new Cell class
            }

            this.grid.push(temp);
        }


        print(grid);
    }

    DrawGrid()
    {
        
    }
}
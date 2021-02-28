This project was made out of love for (and many hours ~~wasted~~ invested into playing) the classic minesweeper game.

I was learning TypeScript and wanted to practice it by building something. I found a really nice tutorial here: https://www.youtube.com/playlist?list=PLXzMwWvud3xQHiuDrx9b3UzPxzZUbyEWi and decided to follow it since it covered some of the things that I wanted to learn (better): TypeScript, React Hooks, SASS.

I used the tutorial in the link to get better acquainted with the syntax and how it's used. Most (if not all) of the methods were written by your's truly.

I'm especially proud of the **calculateNumOfBombsAround** function in the *utils* folder. I know I could've used ordinary, plain-old loops to get the job done (and most likely in a more performant fashion), but I really wanted to geek out doing it. I love the concept of recursion, which I rarely get to use at work, so I wanted to practice it bit and that's the only reason why I wanted to iterate over the minefield by way of recursive function calls, rather than a loop. But, to make up for it, I did make some optimizations along the way.

###The quick and easy part of the algorithm goes something like this:
1. If the index of the row you're in is equal to the number of rows in the minefield, you've reached the end, congrats
2. If the index of the column you're in is equal to the number of fields in the row you're in, then move on to the next row
3. If the field you're currently on is a bomb, move on to the next field

###The part where I optimized it a bit:
1. I knew that the first field in the "minefield" (or the first field in any row) doesn't have any elements to its left and I only need to figure out if the five fields surrounding it have mines in them. (ok, for the first field in the first row we only have to check 3 fields)
    - So I saved the number of bombs in the two fields (top and bottom) in the first column and the number of bombs in the three fields in the adjacent column (top, same-level, bottom), and passed them as arguments to the next calculateNumOfBombsAround function call
        - This will matter in a second, I promise :slightly_smiling_face:
        - **Note**: Those two numbers (bombs from current column and bombs from left column) could've been added together and we'd only need to pass one argument to the next function call, which would make things a bit cleaner, but this is a bit more descriptive, so I left it that way
2. When you move to the second field (and there's not a mine in it), now you can only check the adjacent column's three fields (top, same-level, bottom), because in step 1 we've already checked the column to the left and the current column
    - This is the mini optimization - we don't have to go around the current field each time and check all of the surrounding 8 fields. We've already checked five out of eight fields when checking the previous field, so it's a big cut in the number of operations to be done.
3. We need to check all surrounding fields only if the number of bombs passed from the previous function call was undefined
    - This only ever happens if the previous field had a mine in it, so we moved on without checking its surrounding fields

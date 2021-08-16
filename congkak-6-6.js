const board = [0, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6]
const player = [2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2] // which player owns that hole or home?
const opposite = [0, 13, 12, 11, 10, 9, 8, 0, 6, 5, 4, 3, 2, 1] // the opposite holes
const holes = 6 // holes on a players side (not including home)
const shellsPerHole = 6 // shells in each hole
const last = holes * 2 + 1 // index of last hole in array
const home = holes + 1 // players home
const totalShells = holes * shellsPerHole * 2 // total shells in the game
let highestScore = 0 // highest score so far
let leastChoices = 0 // least number of choices for highest score

function doMove(board, hole, choices) {
  let hand = board[hole] // pick up shells from hole
  // if shells in hole
  if (hand > 0) {
    board[hole] = 0 // remove shells from hole
    while (hand > 0) {
      // while shells in hand
      hole++ // next hole
      if (hole > last) hole = 1
      board[hole]++ // add one to hole
      hand-- // remove one from hand
    }

    if (hole === home) {
      // if last shell was dropped into home, then do more moves
      for (let move = 1; move <= holes; move++) {
        if (board[move] > 0) {
          doMove([...board], move, [...choices, move])
        }
      }
    } else {
      // last shell was not dropped into home
      const shells = board[hole]
      if (shells === 1) {
        // last hole has one shell
        const oppHole = opposite[hole] // get opposite hole
        const oppShells = board[oppHole] // get shells in opposite hole
        if (player[hole] === 1 && oppShells > 0) {
          // if last hole has 1 shell and is on player 1's side and the opposite side has some shells
          // then your shell and your opponents shells on the opposite side get moved to your home
          board[home] += oppShells + 1 // add your shell and the shells opposite that hole to home
          board[oppHole] = 0 // set stolen hole to 0
          board[hole] = 0 // set your hole to 0
          // turn done
        }
      } else if (shells > 1) {
        // if there are more than 1 shell in the last hole and hole is not home, then continue move from hole
        doMove([...board], hole, [...choices])
      } else {
        console.log(
          "Error: Last hole has 0 shells",
          hole,
          shells,
          board,
          choices,
        )
      }
    }
  }

  if (board[home] >= highestScore) {
    let display = false
    if (board[home] === highestScore) {
      if (choices.length < leastChoices) {
        leastChoices = choices.length
        display = true
      }
    } else {
      leastChoices = choices.length
      display = true
    }
    if (display) {
      highestScore = board[home]
      const choicesStr = choices.join("")
      const boardStr = board.join("-")
      console.log(
        `Score: ${highestScore} Choices: ${choices.length} ${choicesStr} Board: ${boardStr}`,
      )
    }
  }
}

for (let move = 1; move <= holes; move++) {
  doMove([...board], move, [move])
}

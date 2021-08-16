const board = [0, 7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7]
const player = [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2] // which player owns that hole or home?
const opposite = [0, 15, 14, 13, 12, 11, 10, 9, 0, 7, 6, 5, 4, 3, 2, 1] // the opposite holes
const holes = 7 // holes on a players side (not including home)
const shellsPerHole = 7 // shells in each hole
const last = holes * 2 + 1 // index of last hole in array
const home = holes + 1 // players home
const totalShells = holes * shellsPerHole * 2 // total shells in the game
const history = []
let highestScore = 0 // highest score so far
let leastChoices = 0 // least number of choices for highest score

// DEBUG ***********************
function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

function debugOutput(choices, board) {
  const choice = [...choices].pop()
  const output = `Choice ${choice} Board [${board[1]} ${board[2]} ${board[3]} ${board[4]}] (${board[5]}) [${board[6]} ${board[7]} ${board[8]} ${board[9]}])`
  return output
}
// DEBUG ***********************

function doMove(board, hole, choices, history) {
  // DEBUG ***********************
  const shellCount = board.reduce((a, b) => a + b, 0)
  if (totalShells != shellCount) {
    console.log(
      `Shell count is ${shellCount} but should be ${totalShells}`,
      board,
      hole,
      choices,
    )
  }
  let found = false
  if (arrayEquals(choices, [3, 4, 4, 3, 4, 1, 3, 4, 1])) {
    found = true
  }
  // DEBUG ***********************
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
          doMove(
            [...board],
            move,
            [...choices, move],
            [...history, debugOutput(choices, board)],
          )
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
        doMove([...board], hole, [...choices], [...history])
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
      history = [...history, debugOutput(choices, board)]
      //console.log(highestScore, choices, choices.length, board, history)
      const choicesStr = choices.join("")
      const boardStr = board.join("-")
      console.log(
        `Score: ${highestScore} Choices: ${choices.length} ${choicesStr} Board: ${boardStr}`,
      )
    }
  }
}

for (let move = 1; move <= holes; move++) {
  doMove([...board], move, [move], history)
}

let playerid = 100
let roundno = 0
let playerlist = []
let matchlist = []

// 创建结构
function createPlayer (playerName) {
  playerid += 10
  return {
    id: playerid,
    playerName: playerName,
    op: [],
    matches: 0,
    matches_won: 0,
    matches_drawn: 0,
    games: 0,
    games_won: 0,
    games_drawn: 0,
    pmps: 0,
    pmws: 0.0,
    pgws: 0.0,
    omw: 0.0,
    ogw: 0.0,
    isdrop: 0
  }
}

function createMatch (roundno, counter, A, B) {
  let ident = roundno + '_' + counter
  return {
    ident: ident,
    roundno: roundno,
    counter: counter,
    games_player1: 0,
    games_player2: 0,
    games_drawn: 0,
    player1: A,
    player2: B
  }
}

// 常规
function calcData (player) {
  if (player) {
    player.pmps = player.matches_won * 3 + player.matches_drawn
    player.pmws = parseFloat(Math.max(0.33, player.pmps / (3 * player.matches)))
    player.pgws = parseFloat(Math.max(0.33, (3 * player.games_won + player.games_drawn) / (3 * player.games)))
  }
}

function calcOpData (player) {
  let omw = 0
  let ogw = 0
  let foes = player.op.length
  if (foes > 0) {
    for (let i = 0; i < foes; i++) {
      let op = findPlayerByName(player.op[i])
      if (op) {
        omw += op.pmws
        ogw += op.pgws
      }
    }
    omw = omw / foes
    ogw = ogw / foes
  }
  player.omw = omw
  player.ogw = ogw
}

function shuffleArray (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

function getNumberOfRounds (players) {
  if (players.length <= 8) { return 3 } else if (players.length <= 16) { return 4 } else if (players.length <= 32) { return 5 } else if (players.length <= 64) { return 6 } else { return 7 }
}

function sortByMatchPointsWithTiebreakers (a, b) {
  if (a.pmps !== b.pmps) {
    return b.pmps - a.pmps
  } else if (a.omw !== b.omw) {
    return b.omw - a.omw
  } else if (a.pgws !== b.pgws) {
    return b.pgws - a.pgws
  } else if (a.ogw !== b.ogw) {
    return b.ogw - a.ogw
  } else {
    return a.id - b.id
  }
}

function resultsReady () {
  var results = 0
  matchlist.forEach(function (entry) {
    if (roundno === entry.roundno) {
      if (entry.games_player1 === 0 && entry.games_player2 === 0 && entry.games_drawn === 0) { results++ }
    }
  })
  return results === 0
}

function findPlayerByName (playerName) {
  if (playerName) {
    for (let i = 0; i < playerlist.length; i++) {
      if (playerlist[i].playerName === playerName) { return players[i] }
    }
  }
  return null
}

function getPairings () {
  if (!resultsReady()) return
  let needPairing = []
  playerlist.forEach(function (p) {
    if (p.isdrop === 0) {
      needPairing.push(p)
    }
  })
  if (needPairing.length === 0) {
    return
  }
  let counter = 0
  if (roundno === 1) {
    shuffleArray(needPairing)
    while (needPairing.length > 0) {
      let a = needPairing.pop()
      let b = null
      if (needPairing.length > 0) {
        b = needPairing.pop()
        matchlist.push(createMatch(roundno, counter, a.playerName, b.playerName))
        a.op.push(b.playerName)
        b.op.push(a.playerName)
      } else {
        let bye = createMatch(roundno, counter, a.playerName, 'BYE')
        matchlist.push(bye)
        addMatchResult(bye, 2, 0, 0)
      }
      counter++
    }
  } else {
    needPairing.sort(sortByMatchPointsWithTiebreakers)

    let retry = 0
    while (needPairing.length > 1) {
      let a = needPairing[0]
      let b = null
      let retryFlag = false

      let offset = 0
      let played = false
      do {
        played = false
        offset++
        if (needPairing.length > offset) {
          b = needPairing[offset]
          for (var j = 0; j < a.op.length; j++) {
            if (a.op[j] === b.playerName) {
              played = true
              break
            }
          }
        } else {
          if (needPairing.length === 2 && counter > 0 && retry < 3) {
            let m = matchlist.pop()
            let ma = findPlayerByName(m.player1)
            let mb = findPlayerByName(m.player2)
            ma.op.pop()
            mb.op.pop()
            counter--
            retry++
            needPairing.splice(1, 0, ma, mb)
            retryFlag = true
            break
          } else {
            offset = 1
            b = needPairing[1]
          }
        }
      }
      while (played === true)

      if (retryFlag) {
        continue
      }

      matchlist.push(createMatch(roundno, counter, a.playerName, b.playerName))
      a.op.push(b.playerName)
      b.op.push(a.playerName)
      needPairing.splice(offset, 1)
      needPairing.splice(0, 1)
      counter++
    }
    if (needPairing.length === 1) {
      let a = needPairing.pop()
      let bye = createMatch(roundno, counter, a.playerName, 'BYE')
      matchlist.push(bye)
      addMatchResult(bye, 2, 0, 0)
    }
  }
}

function delPairings () {
  while (matchlist.length > 0 && matchlist[matchlist.length - 1].roundno === roundno) {
    let match = matchlist.pop()
    let a = findPlayerByName(match.player1)
    a.op.pop()

    let b = null
    if (match.player2 !== 'BYE') {
      b = findPlayerByName(match.player2)
      b.op.pop()
    }
    if (match.games_player1 + match.games_player2 + match.games_drawn > 0) {
      a.matches--
      a.games = a.games - (match.games_player1 + match.games_player2 + match.games_drawn)
      a.games_won = a.games_won - match.games_player1
      a.games_drawn = a.games_drawn - match.games_drawn
      if (b) {
        b.matches--
        b.games = b.games - (match.games_player1 + match.games_player2 + match.games_drawn)
        b.games_won = b.games_won - match.games_player2
        b.games_drawn = b.games_drawn - match.games_drawn
      }
      if (match.games_player1 > match.games_player2) {
        a.matches_won--
      } else if (match.games_player1 < match.games_player2) {
        b.matches_won--
      } else {
        a.matches_drawn--
        b.matches_drawn--
      }
    }
    calcData(a)
    calcData(b)
  }
  // 重算omw, ogw
  for (let i = 0; i < playerlist.length; i++) {
    calcOpData(playerlist[i])
  }
}

function addMatchResult (match, winsA, winsB, draws) {
  winsA = parseInt(winsA)
  winsB = parseInt(winsB, 10)
  draws = parseInt(draws, 10)
  let games = winsA + winsB + draws
  if (winsA > 2 || winsA < 0 || winsB > 2 || winsB < 0 || draws < 0 || (winsA + winsB) > 3 || games < 1) {
    return
  }
  let A = findPlayerByName(match.player1)
  let B = null
  if (match.player2 !== 'BYE') {
    B = findPlayerByName(match.player2)
  }
  if (match.games_player1 + match.games_player2 + match.games_drawn > 0) {
    A.games = A.games - (match.games_player1 + match.games_player2 + match.games_drawn) + games
    A.games_won = A.games_won - match.games_player1 + winsA
    A.games_drawn = A.games_drawn - match.games_drawn + draws
    if (B) {
      B.games = B.games - (match.games_player1 + match.games_player2 + match.games_drawn) + games
      B.games_won = B.games_won - match.games_player2 + winsB
      B.games_drawn = B.games_drawn - match.games_drawn + draws
    }
    if (match.games_player1 > match.games_player2) {
      A.matches_won--
    } else if (match.games_player1 < match.games_player2) {
      B.matches_won--
    } else {
      A.matches_drawn--
      B.matches_drawn--
    }
    if (winsA > winsB) {
      A.matches_won++
    } else if (winsA < winsB) {
      B.matches_won++
    } else {
      A.matches_drawn++
      B.matches_drawn++
    }
  } else {
    A.matches++
    A.games += games
    A.games_won += winsA
    A.games_drawn += draws
    if (B) {
      B.matches++
      B.games += games
      B.games_won += winsB
      B.games_drawn += draws

      if (winsA > winsB) {
        A.matches_won++
      } else if (winsA < winsB) {
        B.matches_won++
      } else {
        A.matches_drawn++
        B.matches_drawn++
      }
    } else {
      A.matches_won++
    }
  }

  calcData(A)
  calcData(B)

  let set = new Set()
  for (let i = 0; i < A.op.length; i++) {
    set.add(A.op[i])
  }
  if (B) {
    for (let i = 0; i < B.op.length; i++) {
      set.add(B.op[i])
    }
  }
  for (let item of set) {
    let player = findPlayerByName(item)
    calcOpData(player)
  }
}

// 接口
function getInfo () {
  return {
    roundno: roundno,
    playerlist: playerlist,
    matchlist: matchlist
  }
}

export {
  getNumberOfRounds,
  createPlayer,
  getInfo,
  getPairings,
  delPairings
}

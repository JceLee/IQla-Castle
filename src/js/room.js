// Worked on by: Evano
class Room {
  constructor(roomName, victoryHandler) {
    this.name = roomName;
    this.players = {};
    this.countUp = 0;
    this.detectiveCount = 0;
    this.vampireCount = 0;
    this.victoryHandler = victoryHandler;
    this.taskCount = 0;
    this.taskTarget = 0;
    this.voteResult = [];
    this.votedPlayers = [];
    this.deadCount = 0;
    this.started = false;
  }
  addPlayer(player) {
    this.players[player.playerId] = player;
  }
  getPlayer(id) {
    return this.players[id];
  }
  removePlayer(id) {
    if(this.started && this.getPlayer(id).alive){
      this.playerEliminated(id)
    };
    delete this.players[id];
  }
  hasPlayers() {
    return Object.keys(this.players).length > 0;
  }
  getRoleAssignments() {
    let roles = {};
    for (let playerId of Object.keys(this.players)) {
      roles[playerId] = 'detective';
    }
    this.detectiveCount = Object.keys(this.players).length;

    let vampireRate = 0.25;
    let players = Object.keys(this.players);

    if (players.length == 1) {
      return roles;
    }

    do {
      let choice = Math.floor(Math.random() * players.length);
      roles[players[choice]] = 'vampire';
      this.players[players[choice]].team = 'vampire';
      players.splice(choice, 1);
      this.detectiveCount--;
      this.vampireCount++;
    }
    while (Math.ceil(players.length / this.vampireCount) > 3);
    return roles;
  }
  playerEliminated(playerId) {
    if(!this.getPlayer(playerId)){
      return;
    }
    this.players[playerId].alive = false;
    if (this.players[playerId].team == 'detective') {
      this.detectiveCount--;
    } else {
      this.vampireCount--;
    }
    this.deadCount += 1;
    if (this.vampireCount == 0) {
      this.victoryHandler('Detectives');
    } else if (this.vampireCount >= this.detectiveCount) {
      this.victoryHandler('IQLAs');
    }
  }
  taskComplete(playerId) {
    if (this.players[playerId].team == 'detective') {
      this.taskCount++;
    } else {
      this.taskCount++;
    }
    if (this.taskCount >= this.taskTarget) {
      this.victoryHandler('Detectives');
    }
  }

  // Worked on by: Jayce
  vote(votedFor, votedFrom) {
    console.log(`${votedFrom} voted for ${votedFor}`);
    if(!this.getPlayer(votedFor)){
      votedFor = null;
    }
    this.voteResult.push(votedFor);
    this.votedPlayers.push(votedFrom);
  }

  // Add timer into the if statement   e.g  && timer === 0;
  voteCompleted() {
    console.log("vote complete?", Object.keys(this.players).length, this.voteResult.length, this.deadCount);
    if (Object.keys(this.players).length <= this.voteResult.length + this.deadCount) {
      let votedPlayerID = this.findTheMajority(this.voteResult);
      console.log('majority voted for: ', votedPlayerID);
      if (votedPlayerID == 'skip') {
        return votedPlayerID;
      }
      if (votedPlayerID == null) {
        return null;
      }
      this.playerEliminated(votedPlayerID);
      this.voteResult = [];
      this.votedPlayers = [];
      return votedPlayerID;
    }
    return null;
  }

  findTheMajority(voteResult) {
    if (voteResult.length == 0)
      return null;
    let modeMap = {};
    let majority = voteResult[0], maxCount = 1;
    for (let i = 0; i < voteResult.length; i++) {
      let el = voteResult[i];
      if (modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;
      if (modeMap[el] > maxCount) {
        majority = el;
        maxCount = modeMap[el];
      }
    }
    return majority;
  }
}

module.exports = { Room };
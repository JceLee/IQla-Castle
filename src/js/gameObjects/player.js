//Worked on by Kiwon, John, Nav, Evano, Gloria, Kiwon, Mike, Alexis

//const player = require('../player');

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(config, id, playerName, speed, iqla = false) {
    super(config.scene, config.x, config.y, config.sprite);

    // console.log(this);
    // this.scene.add.existing(this).setScale(1);
    // this.scene.physics.add.existing(this);
    // this.setCollideWorldBounds(true);
    
    if (config.iqla) {
      this.iqla = iqla;
    } 

    this.id = id;
    this.speed = speed;
    this.alive = true;
    this.hasTrap = false;
    this.trap = null;
    this.playerName = playerName;
    this.movementDisabled = false;

    // Worked on by: Anna, Evano
    this.isWalking = false;

    // we should set these to global variables
    this.spawnX = 1408;
    this.spawnY = 512;

    this.key = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      place_trap: Phaser.Input.Keyboard.KeyCodes.E
    });

    this.nametag = this.scene.add.text(this.x - 32, this.y - 100, this.playerName, {
      font: '32px Ariel',
      fill: 'yellow',
    });

  }

  /**
   * Removes captures when chat scene is being used so that you are able to use the letters
   */
  removeCaptures() {
    if (this.scene) {
      this.scene.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.W);
      this.scene.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.A);
      this.scene.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.S);
      this.scene.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.D);
      this.scene.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.E);
    }
  }

  /**
   * Toggles the MovementDisabled instance variable of Player Object.
   * 
   * Worked on by Bisht & Nav. 
   */
  toggleMovementDisabled(){
    if (this.movementDisabled) {
      this.movementDisabled = false;
    }
    else{
      this.movementDisabled = true;
    }
    console.log("toggle movement", this.movementDisabled);
  }

  //worked on by Kiwon and John
  playerMovement() {
    if (this.key.up.isDown && !this.movementDisabled) {
      this.setVelocityY(-this.speed);
      if (this.y < 64) {this.y = 64}
    } else if (this.key.down.isDown && !this.movementDisabled) {
      this.setVelocityY(this.speed);
      if (this.y > 3040) {this.y = 3040}
    } else {
      this.setVelocityY(0);
    }
    if (this.key.left.isDown && !this.movementDisabled) {
      this.setVelocityX(-this.speed);
      if (this.x < 32) {this.x = 32}
      this.flipX = false;
    } else if (this.key.right.isDown && !this.movementDisabled) {
      this.setVelocityX(this.speed);
      if (this.x > 5024) {this.x = 5024}
      this.flipX = true;
    } else {
      this.setVelocityX(0);
    }

    if (
      this.key.down.isDown ||
      this.key.up.isDown ||
      this.key.left.isDown ||
      this.key.right.isDown
    ) {
      if (!this.isWalking) {
        this.playerWalkAnimStart();
      }
    } else {
      this.playerWalkAnimStop();
    }

    this.updateNametagLocation();
    
  }

  updateNametagLocation() {
    if (this.alive) {
      this.nametag.x = this.x - 32;
      this.nametag.y = this.y - 100;
    }
  }

  //trap placement condition checker
  canPlaceTrap() {
    if (this.hasTrap && this.iqla && this.key.place_trap.isDown) {
      this.scene.sceneData.serverConnection.trapPlace();
      this.playerTrap();
      this.hasTrap = false;
    }
  }

  // Worked on by: Kiwon, Kian, Evano
  playerTrap() {
    this.trap = new Trap({
    scene: this.scene,
    x: this.x,
    y: this.y
    }, this);
  }

  removePlayerTrap() {
    if (this.trap) {
      this.trap.displayDestroyTrap();
    }
  }

  // Worked on by: Anna
  playerWalkAnimStart() {
    if (!this.isWalking) {
      this.isWalking = true;
      this.play('WalkCycle');
    }
  }

  // Worked on by: Anna
  playerWalkAnimStop() {
    this.isWalking = false;
    if (this.anims) {
      this.anims.stop();
    } 
  }

  getPlayerName() {
    return this.playerName;
  }

  //worked on by Mike
  createDeadBody(x, y) {
    if (!this.scene) {
      return;
    }
    
    let dead_image = this.scene.add.image(x, y, 'deadbody');
    dead_image.setScale(2);
    dead_image.setDepth(30);
    dead_image.setInteractive();
    this.scene.deadbodies.push(dead_image);
  }

  //worked on by Mike and Evano
  report() {
    console.log("Checking for local dead bodies")
    for (let i = 0; i < this.scene.deadbodies.length; i++) {
      let c = Phaser.Math.Distance.Chebyshev(this.x, this.y, this.scene.deadbodies[i].x, this.scene.deadbodies[i].y);
      console.log("Distance to nearest dead body", c);
      if (c < 60) {
        console.log('FOUND A DEADBODY!');
        return true;
      }
    }
    return false;
  }

  //worked on by Mike
  kill(sprite) {
    for (let i = 0; i < sprite.length; i++) {
      let c = Phaser.Math.Distance.Chebyshev(this.x, this.y, sprite[i].x, sprite[i].y);
      if (sprite[i].active) {
        if (c < 60) {
          sprite[i].setActive(false).setVisible(false);
          sprite[i].alive = false;
          //sprite[i].setTexture('ghost');
          console.log('Hidden');
          console.log(sprite[i].x, sprite[i].y);
          this.createDeadBody(sprite[i].x, sprite[i].y);
          console.log('I killed someone', sprite[i].id);
          this.scene.registry.values.sceneData.serverConnection.kill(sprite[i].id);
          this.scene.registry.values.sceneData.gamePlayScene.scene.manager.getScene('voting_scene').removePlayerById(sprite[i].id);
          break;
        }
      }
    }
  }

  /**
  * Get the position of nearby interactable MapObjects. If it's active and within a
  * a certain range, return that MapObject and set its active variable to false.
  * @param {MapObject[]} interactables 
  */
  interact(interactables) {
    // Worked on by: Alexis
    const DIST_FROM_OBJ = (this.iqla) ? 115 : 50;

    for (let i = 0; i < interactables.length; i++) {
      let pos = Phaser.Math.Distance.Chebyshev(this.x, this.y, interactables[i].x, interactables[i].y);

      if (interactables[i].active && interactables[i].canInteract(this.iqla) && pos < DIST_FROM_OBJ) {
        return interactables[i];
      }
    }
  }

  // Worked on by Gloria
  /**
   * Sets the role for the player based on what has been decided by the server
   */
  setRole(player_id_object) {
    console.log('Object: ' + player_id_object);
    console.log('Accessing Object: ' + player_id_object[this.id]);
    let iqla_status = player_id_object[this.id];
    // check for nulls
    if (iqla_status) {
      // set iqla
      if (iqla_status == 'vampire') {
        this.iqla = true;
      }
      console.log('Is iqla', this.iqla);
    }
  }

  // Worked on by Gloria
  // Sets player x and y to spawn point
  sendToStartPos() {
    this.x = this.spawnX;
    this.y = this.spawnY;
  }

  // worked on by Charles 1000000000% all him let's go
  setTrapVariable(bool) {
    this.hasTrap = bool;
  }
}

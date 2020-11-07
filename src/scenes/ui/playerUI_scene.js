// Worked on by: William, Alexis

class playerUI_scene extends Phaser.Scene {
    constructor() {
        super({
            key: 'playerUI_scene',
        });
    }

    preload() {
        this.load.image('reportBtn', '../../assets/reportButton.png');
        this.load.image('useBtn', '../../assets/useButton.png');
        this.load.image('killBtn', '../../assets/killButton.png');
        this.load.image('mapBtn', '../../assets/mapButton.png');
    }

    create() {
        const taskStringArr = [
            'Clean the bathroom',
            'Stand in the storage room for 10 seconds',
            'Do the dishes in the kitchen',
            'Close the closet door',
        ];

        this.btnOriginScale = 0.35;
        this.btnHoverScale = 0.4;

        this.mapOverlayDisplayed = false;
        this.isKiller = true;

        // What is this for??
        this.timedEvent;

        if (this.isKiller) {
            this.canKill = true;
            this.renderKillerUI();
        } else {
            this.renderDetectiveUI();
        }

        this.renderTaskList(taskStringArr);

        // Domo for how to show task complete.
        this.taskList[1].setColor('#8D8D8D');
        this.taskList[3].setColor('#8D8D8D');

        // When window is resized, fix things
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    renderTaskList(arr) {
        const taskListBoxX = this.cameras.main.width - 180;
        const taskListBoxY = 30;
        const taskListBoxWidth = 180;
        const taskListBoxHeight = 250;

        this.taskListBox = this.add
            .rectangle(
                taskListBoxX,
                taskListBoxY,
                taskListBoxWidth,
                taskListBoxHeight,
                0x393f4a,
                0.7
            )
            .setOrigin(0, 0);

        console.log(this.taskListBox.x, this.taskListBox.y);

        this.taskList = [];
        let x = taskListBoxX + 20;
        let y = taskListBoxY + 20;
        const style = { font: '13px' };

        for (let i = 0; i < arr.length; i++) {
            this.taskList[i] = this.add
                .text(x, y, arr[i], style)
                .setOrigin(0, 0);

            this.taskList[i].wordWrap = true;
            this.taskList[i].setWordWrapWidth(taskListBoxWidth * 0.9);

            y += this.taskList[i].height + 10;
        }
    }

    /**
     * Renders the following object
     * - Report Button
     * - Use Button
     * - Map Button
     */
    renderDetectiveUI() {
        const screenX = this.cameras.main.width;
        const screenY = this.cameras.main.height;

        this.rptButtonX = screenX - 80;
        this.rptButtonY = screenY - 80;
        this.useButtonX = screenX - 80;
        this.useButtonY = screenY - 200;
        this.mapButtonX = screenX - 80;
        this.mapButtonY = screenY - 280;

        this.rptButton = this.add.sprite(
            this.rptButtonX,
            this.rptButtonY,
            'reportBtn'
        );
        this.useButton = this.add.sprite(
            this.useButtonX,
            this.useButtonY,
            'useBtn'
        );
        this.mapButton = this.add.sprite(
            this.mapButtonX,
            this.mapButtonY,
            'mapBtn'
        );

        this.rptButton.setInteractive();
        this.rptButton.setScale(this.btnOriginScale);
        this.useButton.setInteractive();
        this.useButton.setScale(this.btnOriginScale);
        this.mapButton.setInteractive();
        this.mapButton.setScale(this.btnOriginScale);

        this.rptButton
            .on('pointerdown', () => this.report())
            .on('pointerover', () => this.enterButtonHoverState(this.rptButton))
            .on('pointerout', () => this.exitButtonHoverState(this.rptButton));

        this.useButton
            .on('pointerdown', () => this.use())
            .on('pointerover', () => this.enterButtonHoverState(this.useButton))
            .on('pointerout', () => this.exitButtonHoverState(this.useButton));

        this.mapButton
            .on('pointerdown', () => this.showMap())
            .on('pointerover', () => this.enterButtonHoverState(this.mapButton))
            .on('pointerout', () => this.exitButtonHoverState(this.mapButton));
    }

    /**
     * Renders the kill button object then calls renderDetectiveUI()
     */
    renderKillerUI() {
        this.killButtonX = 80;
        this.killButtonY = this.cameras.main.height - 80;

        this.killButton = this.add.sprite(
            this.killButtonX,
            this.killButtonY,
            'killBtn'
        );

        this.killButton.setInteractive();
        this.killButton.setScale(this.btnOriginScale);

        this.killButton
            .on('pointerdown', () => this.kill())
            .on('pointerover', () =>
                this.enterButtonHoverState(this.killButton)
            )
            .on('pointerout', () => this.exitButtonHoverState(this.killButton));

        this.renderDetectiveUI();
    }

    enablePress() {
        this.killButton.setTint(0xffffff);
        this.canKill = true;
    }

    kill() {
        this.killButton.setTint(0x2b2a2a);
        this.time.delayedCall(2000, this.enablePress, [], this);
        this.canKill = false;
        let gameplay = this.scene.get('gameplay_scene');
        let group = this.add.group();
        group.add(gameplay.otherplayer);
        gameplay.kill(group.getChildren());
    }

    use() {
        console.log('use');
    }

    report() {
        console.log('report');
    }

    showMap() {
        console.log('map');
        const mapOverlay = this.scene.get('mapOverlay_scene');

        if (this.mapOverlayDisplayed) {
            this.mapOverlayDisplayed = false;
            mapOverlay.mapHide();
        } else {
            this.mapOverlayDisplayed = true;
            mapOverlay.mapShow();
        }
    }

    enterButtonHoverState(btn) {
        if (this.isKiller && this.canKill) {
            btn.setScale(this.btnHoverScale);
        } else {
            btn.setScale(this.btnHoverScale);
        }

        // Do nothing if isKiller but !canKill
    }

    exitButtonHoverState(btn) {
        btn.setScale(this.btnOriginScale);
    }

    resize() {
        //this.titleText.setPosition(document.body.offsetWidth / 2 - 300, 80);
        this.rptButton.setPosition(this.rptButtonX, this.rptButtonY);
        this.useButton.setPosition(this.useButtonX, this.useButtonY);
        this.killButton.setPosition(this.killButtonX, this.killButtonY);
        this.mapButton.setPosition(this.mapButtonX, this.mapButtonY);
    }
}

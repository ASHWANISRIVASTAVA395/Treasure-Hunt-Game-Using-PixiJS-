const app = new PIXI.Application();

(async () => {

    await app.init({
        width: 900,
        height: 600,
        background: "#1b4332"
    });

    document.body.appendChild(app.canvas);

    // =====================
    // START SCREEN
    // =====================

    let gameStarted = false;

    const startText = new PIXI.Text({
        text: "🏴 TREASURE HUNT 🏴\n\nCollect 5 Coins\nFind the Key\nAvoid Enemy\nOpen the Treasure\n\nPress ENTER to Start",
        style: {
            fill: "white",
            fontSize: 32,
            align: "center"
        }
    });

    startText.anchor.set(0.5);
    startText.x = 450;
    startText.y = 250;

    app.stage.addChild(startText);

    // =====================
    // PLAYER
    // =====================

    const player = new PIXI.Graphics();

    player.circle(20, 20, 20);
    player.fill(0x00ff00);

    player.x = 50;
    player.y = 50;

    app.stage.addChild(player);

    // =====================
    // COINS
    // =====================

    const coins = [];

    for (let i = 0; i < 5; i++) {

        const coin = new PIXI.Graphics();

        coin.circle(0, 0, 15);
        coin.fill(0xffd700);

        coin.x = 150 + Math.random() * 650;
        coin.y = 80 + Math.random() * 400;

        app.stage.addChild(coin);

        coins.push(coin);
    }

    // =====================
    // KEY
    // =====================

    const key = new PIXI.Graphics();

    key.rect(0, 0, 25, 25);
    key.fill(0x00ffff);

    key.x = 750;
    key.y = 100;

    app.stage.addChild(key);

    // =====================
    // TREASURE
    // =====================

    const treasure = new PIXI.Graphics();

    treasure.rect(0, 0, 70, 50);
    treasure.fill(0xffaa00);

    treasure.x = 780;
    treasure.y = 500;

    app.stage.addChild(treasure);

    // =====================
    // ENEMY
    // =====================

    const enemy = new PIXI.Graphics();

    enemy.circle(0, 0, 20);
    enemy.fill(0xff0000);

    enemy.x = 300;
    enemy.y = 300;

    app.stage.addChild(enemy);

    let enemySpeed = 4;

    // =====================
    // HUD
    // =====================

    let score = 0;
    let hasKey = false;
    let gameWon = false;

    const scoreText = new PIXI.Text({
        text: "Coins: 0/5",
        style: {
            fill: "white",
            fontSize: 24
        }
    });

    scoreText.x = 10;
    scoreText.y = 10;

    app.stage.addChild(scoreText);

    const keyText = new PIXI.Text({
        text: "Key: No",
        style: {
            fill: "white",
            fontSize: 24
        }
    });

    keyText.x = 10;
    keyText.y = 40;

    app.stage.addChild(keyText);

    const timerText = new PIXI.Text({
        text: "Time: 60",
        style: {
            fill: "white",
            fontSize: 24
        }
    });

    timerText.x = 10;
    timerText.y = 70;

    app.stage.addChild(timerText);

    // =====================
    // TIMER
    // =====================

    let timeLeft = 60;

    const timer = setInterval(() => {

        if (!gameStarted || gameWon) return;

        timeLeft--;

        timerText.text = "Time: " + timeLeft;

        if (timeLeft <= 0) {

            alert("⏰ GAME OVER!");

            location.reload();
        }

    }, 1000);

    // =====================
    // CONTROLS
    // =====================

    const keys = {};

    window.addEventListener("keydown", (e) => {

        keys[e.key] = true;

        if (e.key === "Enter" && !gameStarted) {

            gameStarted = true;

            startText.visible = false;
        }
    });

    window.addEventListener("keyup", (e) => {

        keys[e.key] = false;
    });

    // =====================
    // COLLISION
    // =====================

    function hit(a, b) {

        return (
            a.x < b.x + 40 &&
            a.x + 40 > b.x &&
            a.y < b.y + 40 &&
            a.y + 40 > b.y
        );
    }

    // =====================
    // GAME LOOP
    // =====================

    app.ticker.add(() => {

        if (!gameStarted) return;

        if (gameWon) return;

        // PLAYER MOVEMENT

        if (keys["ArrowUp"])
            player.y -= 5;

        if (keys["ArrowDown"])
            player.y += 5;

        if (keys["ArrowLeft"])
            player.x -= 5;

        if (keys["ArrowRight"])
            player.x += 5;

        // BOUNDARY

        player.x = Math.max(0, Math.min(860, player.x));
        player.y = Math.max(0, Math.min(560, player.y));

        // ENEMY MOVEMENT

        enemy.x += enemySpeed;

        if (enemy.x > 850 || enemy.x < 50) {
            enemySpeed *= -1;
        }

        // ENEMY COLLISION

        if (hit(player, enemy)) {

            alert("💀 Enemy Caught You!");

            location.reload();
        }

        // COIN COLLECTION

        coins.forEach((coin) => {

            if (coin.visible && hit(player, coin)) {

                coin.visible = false;

                score++;

                scoreText.text =
                    "Coins: " + score + "/5";
            }

        });

        // KEY COLLECTION

        if (key.visible && hit(player, key)) {

            hasKey = true;

            key.visible = false;

            keyText.text = "Key: Yes";
        }

        // WIN CONDITION

        if (
            score === 5 &&
            hasKey &&
            hit(player, treasure)
        ) {

            gameWon = true;

            clearInterval(timer);

            const overlay = new PIXI.Graphics();

            overlay.rect(0, 0, 900, 600);
            overlay.fill({
                color: 0x000000,
                alpha: 0.7
            });

            app.stage.addChild(overlay);

            const winText = new PIXI.Text({
                text: "🏆 TREASURE FOUND! 🏆\n\nYOU WIN!",
                style: {
                    fill: "yellow",
                    fontSize: 48,
                    align: "center"
                }
            });

            winText.anchor.set(0.5);

            winText.x = 450;
            winText.y = 300;

            app.stage.addChild(winText);
        }

    });

})();

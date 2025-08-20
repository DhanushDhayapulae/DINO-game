// DINO Run Game - Modern and Minimal Implementation
class DinoGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.controlHint = document.getElementById('controlHint');
        this.gameOverElement = document.getElementById('gameOver');
        
        // Set canvas resolution
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Game state
        this.gameState = 'waiting'; // waiting, playing, gameOver
        this.score = 0;
        this.highScore = localStorage.getItem('dinoHighScore') || 0;
        this.gameSpeed = 8; // Increased initial speed
        this.baseSpeed = 8; // Base speed for difficulty scaling
        this.gravity = 0.8;
        this.jumpPower = 16;
        this.targetFPS = 60;
        this.lastTime = 0;
        
        // Game objects
        this.dino = {
            x: 80,
            y: 300,
            width: 50,
            height: 45,
            velY: 0,
            jumping: false,
            ducking: false,
            color: '#2d5016', // Darker green for more realistic look
            bodyColor: '#4a7c20',
            spotColor: '#1a3d0a',
            eyeColor: '#000000',
            clawColor: '#8b4513'
        };
        
        this.ground = {
            x: 0,
            y: 350,
            width: this.canvas.width,
            height: 50
        };
        
        this.obstacles = [];
        this.clouds = [];
        this.particles = [];
        
        this.obstacleTimer = 0;
        this.cloudTimer = 0;
        this.frameCount = 0;
        
        this.init();
    }
    
    init() {
        this.updateHighScore();
        this.generateClouds();
        this.setupControls();
        this.gameLoop();
    }
    
    generateClouds() {
        for (let i = 0; i < 3; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 100 + 20,
                width: 60 + Math.random() * 40,
                height: 30 + Math.random() * 20,
                speed: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    setupControls() {
        // Reduce input delay for smoother response
        let isJumping = false;
        let isDucking = false;
        
        // Keyboard controls with reduced delay
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping) {
                e.preventDefault();
                isJumping = true;
                this.handleJump();
            }
            if ((e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') && !isDucking) {
                e.preventDefault();
                isDucking = true;
                this.dino.ducking = true;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                isJumping = false;
            }
            if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                isDucking = false;
                this.dino.ducking = false;
            }
        });
        
        // Mouse/touch controls
        this.canvas.addEventListener('click', () => {
            this.handleJump();
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJump();
        });
    }
    
    handleJump() {
        if (this.gameState === 'waiting') {
            this.startGame();
        } else if (this.gameState === 'playing' && !this.dino.jumping) {
            this.jump();
        } else if (this.gameState === 'gameOver') {
            this.resetGame();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.controlHint.style.display = 'none';
        this.gameOverElement.style.display = 'none';
    }
    
    jump() {
        if (!this.dino.jumping) {
            this.dino.velY = -this.jumpPower;
            this.dino.jumping = true;
            this.createParticles(this.dino.x + this.dino.width/2, this.dino.y + this.dino.height);
        }
    }
    
    createParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                velX: (Math.random() - 0.5) * 4,
                velY: Math.random() * -3,
                life: 30,
                maxLife: 30,
                size: Math.random() * 3 + 1
            });
        }
    }
    
    resetGame() {
        this.gameState = 'waiting';
        this.score = 0;
        this.gameSpeed = this.baseSpeed; // Reset to base speed
        this.obstacles = [];
        this.particles = [];
        this.dino.y = 300;
        this.dino.velY = 0;
        this.dino.jumping = false;
        this.dino.ducking = false;
        this.obstacleTimer = 0;
        this.frameCount = 0;
        this.controlHint.style.display = 'block';
        this.gameOverElement.style.display = 'none';
        this.updateScore();
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.frameCount++;
        
        // Update dino physics
        this.updateDino();
        
        // Update obstacles
        this.updateObstacles();
        
        // Update particles
        this.updateParticles();
        
        // Update clouds
        this.updateClouds();
        
        // Check collisions
        this.checkCollisions();
        
        // Update score and dynamic difficulty
        this.score += 0.2; // Increased score increment for faster progression
        
        // Dynamic difficulty scaling based on score
        const difficultyMultiplier = 1 + (Math.floor(this.score / 100) * 0.15); // Every 100 points = 15% speed increase
        this.gameSpeed = this.baseSpeed * difficultyMultiplier;
        
        // Cap maximum speed for playability
        this.gameSpeed = Math.min(this.gameSpeed, this.baseSpeed * 3);
        
        this.updateScore();
    }
    
    updateDino() {
        // Apply gravity
        this.dino.velY += this.gravity;
        this.dino.y += this.dino.velY;
        
        // Ground collision
        if (this.dino.y >= 300) {
            this.dino.y = 300;
            this.dino.velY = 0;
            this.dino.jumping = false;
        }
        
        // Adjust size when ducking
        if (this.dino.ducking && !this.dino.jumping) {
            this.dino.height = 30;
            this.dino.y = 320;
        } else {
            this.dino.height = 45;
            if (!this.dino.jumping) {
                this.dino.y = 300;
            }
        }
    }
    
    updateObstacles() {
        // Generate obstacles with dynamic timing based on speed
        this.obstacleTimer++;
        const obstacleFrequency = Math.max(60, 150 - this.gameSpeed * 3); // Faster speed = more frequent obstacles
        
        if (this.obstacleTimer > obstacleFrequency) {
            this.generateObstacle();
            this.obstacleTimer = 0;
        }
        
        // Move and remove obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.x -= this.gameSpeed;
            
            // Make birds move up and down after score 200
            if (obstacle.type === 'bird' && obstacle.shouldMove) {
                obstacle.movementPhase += 0.05;
                const movement = Math.sin(obstacle.movementPhase) * 30; // 30 pixel vertical movement
                obstacle.y = obstacle.initialY + movement;
            }
            
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    generateObstacle() {
        const types = ['cactus', 'bird'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'cactus') {
            this.obstacles.push({
                type: 'cactus',
                x: this.canvas.width,
                y: 310,
                width: 20,
                height: 40,
                color: '#38a169'
            });
        } else {
            const birdY = Math.random() > 0.5 ? 250 : 200; // Two possible heights
            this.obstacles.push({
                type: 'bird',
                x: this.canvas.width,
                y: birdY,
                initialY: birdY, // Store initial Y position for movement
                width: 35,
                height: 25,
                color: '#4a5568',
                wingPhase: 0,
                movementPhase: Math.random() * Math.PI * 2, // Random starting phase
                shouldMove: this.score >= 200 // Birds move up/down after score 200
            });
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.velX;
            particle.y += particle.velY;
            particle.velY += 0.1; // gravity
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateClouds() {
        this.cloudTimer++;
        
        for (const cloud of this.clouds) {
            cloud.x -= cloud.speed * (this.gameSpeed / this.baseSpeed); // Clouds move relative to game speed
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvas.width + Math.random() * 200;
                cloud.y = Math.random() * 100 + 20;
            }
        }
        
        // Add new clouds occasionally
        if (this.cloudTimer > 800) {
            this.clouds.push({
                x: this.canvas.width + Math.random() * 200,
                y: Math.random() * 100 + 20,
                width: 60 + Math.random() * 40,
                height: 30 + Math.random() * 20,
                speed: 0.5 + Math.random() * 0.5
            });
            this.cloudTimer = 0;
            
            // Limit cloud count
            if (this.clouds.length > 5) {
                this.clouds.shift();
            }
        }
    }
    
    checkCollisions() {
        const dinoBox = {
            x: this.dino.x + 8,
            y: this.dino.y + 5,
            width: this.dino.width - 16,
            height: this.dino.height - 10
        };
        
        for (const obstacle of this.obstacles) {
            const obstacleBox = {
                x: obstacle.x + 2,
                y: obstacle.y + 2,
                width: obstacle.width - 4,
                height: obstacle.height - 4
            };
            
            if (this.isColliding(dinoBox, obstacleBox)) {
                this.gameOver();
                return;
            }
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.gameOverElement.style.display = 'block';
        
        // Update high score
        if (Math.floor(this.score) > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('dinoHighScore', this.highScore);
            this.updateHighScore();
        }
        
        // Create explosion particles
        this.createExplosion(this.dino.x + this.dino.width/2, this.dino.y + this.dino.height/2);
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                velX: (Math.random() - 0.5) * 8,
                velY: (Math.random() - 0.5) * 8,
                life: 60,
                maxLife: 60,
                size: Math.random() * 4 + 2,
                color: '#ef4444'
            });
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#e2e8f0');
        gradient.addColorStop(1, '#f7fafc');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.drawClouds();
        
        // Draw ground
        this.drawGround();
        
        // Draw dino
        this.drawDino();
        
        // Draw obstacles
        this.drawObstacles();
        
        // Draw particles
        this.drawParticles();
        
        // Draw ground line
        this.ctx.strokeStyle = '#cbd5e0';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.ground.y);
        this.ctx.lineTo(this.canvas.width, this.ground.y);
        this.ctx.stroke();
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'rgba(203, 213, 224, 0.6)';
        for (const cloud of this.clouds) {
            this.ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
            // Add cloud details
            this.ctx.fillRect(cloud.x + 10, cloud.y - 8, cloud.width * 0.6, cloud.height * 0.6);
            this.ctx.fillRect(cloud.x + cloud.width * 0.3, cloud.y - 5, cloud.width * 0.4, cloud.height * 0.4);
        }
    }
    
    drawGround() {
        // Draw ground pattern with speed-based animation
        this.ctx.fillStyle = '#e2e8f0';
        for (let x = 0; x < this.canvas.width; x += 20) {
            const offset = (x + this.frameCount * this.gameSpeed * 0.8) % 40; // Faster ground animation
            this.ctx.fillRect(x - offset, this.ground.y + 30, 10, 5);
        }
    }
    
    drawDino() {
        const dino = this.dino;
        
        // Main body (rounded rectangle effect)
        this.ctx.fillStyle = dino.bodyColor;
        this.ctx.fillRect(dino.x + 8, dino.y + 8, dino.width - 16, dino.height - 16);
        
        // Head (larger, more prominent)
        this.ctx.fillStyle = dino.color;
        this.ctx.fillRect(dino.x + 25, dino.y, 20, 25);
        
        // Snout/Nose
        this.ctx.fillStyle = dino.bodyColor;
        this.ctx.fillRect(dino.x + 40, dino.y + 8, 8, 10);
        
        // Body torso
        this.ctx.fillStyle = dino.color;
        this.ctx.fillRect(dino.x + 5, dino.y + 12, 30, dino.height - 20);
        
        // Tail (longer and more curved looking)
        this.ctx.fillStyle = dino.color;
        this.ctx.fillRect(dino.x - 15, dino.y + 15, 20, 12);
        this.ctx.fillRect(dino.x - 25, dino.y + 20, 15, 8);
        
        // Belly (lighter color)
        this.ctx.fillStyle = dino.bodyColor;
        this.ctx.fillRect(dino.x + 10, dino.y + 20, 20, dino.height - 30);
        
        // Eye (more realistic)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(dino.x + 30, dino.y + 6, 8, 8);
        this.ctx.fillStyle = dino.eyeColor;
        this.ctx.fillRect(dino.x + 32, dino.y + 8, 4, 4);
        
        // Nostril
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(dino.x + 44, dino.y + 12, 2, 2);
        
        // Dinosaur spots/texture
        this.ctx.fillStyle = dino.spotColor;
        this.ctx.fillRect(dino.x + 12, dino.y + 16, 3, 3);
        this.ctx.fillRect(dino.x + 20, dino.y + 25, 2, 2);
        this.ctx.fillRect(dino.x + 8, dino.y + 30, 2, 2);
        
        // Arms (small T-Rex style arms)
        this.ctx.fillStyle = dino.color;
        this.ctx.fillRect(dino.x + 8, dino.y + 18, 6, 3);
        this.ctx.fillRect(dino.x + 6, dino.y + 20, 4, 6);
        
        // Legs with claws (animated based on game speed)
        const legAnimationSpeed = Math.max(10, 20 - this.gameSpeed);
        const legOffset = this.frameCount % legAnimationSpeed < legAnimationSpeed/2 ? 0 : 3;
        
        if (!dino.jumping) {
            // Left leg
            this.ctx.fillStyle = dino.color;
            this.ctx.fillRect(dino.x + 12 + legOffset, dino.y + dino.height, 8, 12);
            // Left foot/claw
            this.ctx.fillStyle = dino.clawColor;
            this.ctx.fillRect(dino.x + 10 + legOffset, dino.y + dino.height + 10, 12, 4);
            // Claws
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(dino.x + 8 + legOffset, dino.y + dino.height + 12, 2, 3);
            this.ctx.fillRect(dino.x + 12 + legOffset, dino.y + dino.height + 12, 2, 3);
            this.ctx.fillRect(dino.x + 16 + legOffset, dino.y + dino.height + 12, 2, 3);
            
            // Right leg
            this.ctx.fillStyle = dino.color;
            this.ctx.fillRect(dino.x + 25 - legOffset, dino.y + dino.height, 8, 12);
            // Right foot/claw
            this.ctx.fillStyle = dino.clawColor;
            this.ctx.fillRect(dino.x + 23 - legOffset, dino.y + dino.height + 10, 12, 4);
            // Claws
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(dino.x + 21 - legOffset, dino.y + dino.height + 12, 2, 3);
            this.ctx.fillRect(dino.x + 25 - legOffset, dino.y + dino.height + 12, 2, 3);
            this.ctx.fillRect(dino.x + 29 - legOffset, dino.y + dino.height + 12, 2, 3);
        }
        
        // Spikes on back (classic dinosaur feature)
        this.ctx.fillStyle = dino.spotColor;
        for (let i = 0; i < 3; i++) {
            const spikeX = dino.x + 15 + (i * 6);
            const spikeY = dino.y + 8;
            this.ctx.fillRect(spikeX, spikeY, 3, 8);
            this.ctx.fillRect(spikeX + 1, spikeY - 2, 1, 4);
        }
    }
    
    drawObstacles() {
        for (const obstacle of this.obstacles) {
            if (obstacle.type === 'cactus') {
                this.drawCactus(obstacle);
            } else if (obstacle.type === 'bird') {
                this.drawBird(obstacle);
            }
        }
    }
    
    drawCactus(cactus) {
        this.ctx.fillStyle = cactus.color;
        // Main body
        this.ctx.fillRect(cactus.x + 5, cactus.y, 10, cactus.height);
        // Arms
        this.ctx.fillRect(cactus.x, cactus.y + 10, 8, 6);
        this.ctx.fillRect(cactus.x + 12, cactus.y + 15, 8, 6);
        // Spikes
        this.ctx.fillStyle = '#2f855a';
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(cactus.x + 3, cactus.y + i * 12 + 5, 2, 2);
            this.ctx.fillRect(cactus.x + 15, cactus.y + i * 12 + 8, 2, 2);
        }
    }
    
    drawBird(bird) {
        // Faster wing animation based on game speed
        bird.wingPhase += 0.3 + (this.gameSpeed / this.baseSpeed) * 0.2;
        this.ctx.fillStyle = bird.color;
        
        // Bird body
        this.ctx.fillRect(bird.x + 8, bird.y + 8, 20, 10);
        // Bird head
        this.ctx.fillRect(bird.x + 20, bird.y + 5, 12, 8);
        
        // Animated wings
        const wingOffset = Math.sin(bird.wingPhase) * 3;
        this.ctx.fillRect(bird.x + 5, bird.y + 6 + wingOffset, 15, 4);
        this.ctx.fillRect(bird.x + 5, bird.y + 12 - wingOffset, 15, 4);
        
        // Beak
        this.ctx.fillStyle = '#f6ad55';
        this.ctx.fillRect(bird.x + 32, bird.y + 8, 4, 3);
    }
    
    drawParticles() {
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color || `rgba(74, 85, 104, ${alpha})`;
            this.ctx.fillRect(
                particle.x - particle.size/2,
                particle.y - particle.size/2,
                particle.size,
                particle.size
            );
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = Math.floor(this.score).toString().padStart(5, '0');
    }
    
    updateHighScore() {
        this.highScoreElement.textContent = this.highScore.toString().padStart(5, '0');
    }
    
    gameLoop(currentTime = 0) {
        // Calculate delta time for smooth 60fps with reduced input delay
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Target higher FPS for smoother input response (120 FPS for input, 60 FPS for rendering)
        const inputTargetFPS = 120;
        const renderTargetFPS = 60;
        
        // Always update input and game logic at high frequency
        if (deltaTime >= 1000 / inputTargetFPS) {
            this.update(deltaTime);
        }
        
        // Render at 60 FPS
        if (deltaTime >= 1000 / renderTargetFPS) {
            this.render();
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new DinoGame();
});

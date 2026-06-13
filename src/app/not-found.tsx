"use client";

import {
    useState,
    useEffect,
    useRef,
    useCallback,
    startTransition,
    type CSSProperties,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

interface Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    active: boolean;
}

interface Player extends Entity { }

interface Bullet extends Entity { }

interface EnemyEntity extends Entity {
    type: number;
}

interface Explosion {
    x: number;
    y: number;
    frame: number;
    active: boolean;
}

interface GameState {
    player: Player;
    bullets: Bullet[];
    enemyBullets: Bullet[];
    enemies: EnemyEntity[];
    explosions: Explosion[];
    lastEnemySpawn: number;
    lastBulletFire: number;
    gameOver: boolean;
}

interface TouchPosition {
    x: number;
    y: number;
}

export interface SpaceShooterProps {
    backgroundColor?: string;
    playerColor?: string;
    bulletColor?: string;
    enemyColor?: string;
    enemyBulletColor?: string;
    explosionColor?: string;
    scoreColor?: string;
    starColor?: string;
    starSize?: number;
    starOpacity?: number;
    font?: CSSProperties;
    gameSpeed?: number;
    playerSize?: number;
    enemySize?: number;
    className?: string;
}

const ARROW_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"] as const;
type ArrowKey = (typeof ARROW_KEYS)[number];

export default function SpaceShooter({
    backgroundColor = "#000011",
    playerColor = "#00FF00",
    bulletColor = "#FFFF00",
    enemyColor = "#FF0000",
    enemyBulletColor = "#FF6600",
    explosionColor = "#FFA500",
    scoreColor = "#FFFFFF",
    starColor = "#FFFFFF",
    starSize = 2,
    starOpacity = 0.25,
    font = {},
    gameSpeed = 1,
    playerSize = 32,
    enemySize = 24,
    className,
}: SpaceShooterProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameLoopRef = useRef<number | null>(null);
    const keysRef = useRef<Set<string>>(new Set());
    const touchRef = useRef<TouchPosition | null>(null);

    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<GameState>({
        player: { x: 400, y: 500, width: playerSize, height: playerSize, speed: 5, active: true },
        bullets: [],
        enemyBullets: [],
        enemies: [],
        explosions: [],
        lastEnemySpawn: 0,
        lastBulletFire: 0,
        gameOver: false,
    });

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;
    const PIXEL_SIZE = 4;

    const drawPixelRect = useCallback(
        (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
            ctx.fillStyle = color;
            const pixelWidth = Math.floor(width / PIXEL_SIZE) * PIXEL_SIZE;
            const pixelHeight = Math.floor(height / PIXEL_SIZE) * PIXEL_SIZE;
            ctx.fillRect(
                Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE,
                Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE,
                pixelWidth,
                pixelHeight
            );
        },
        []
    );

    const drawPlayer = useCallback(
        (ctx: CanvasRenderingContext2D, player: Player) => {
            const x = Math.floor(player.x / PIXEL_SIZE) * PIXEL_SIZE;
            const y = Math.floor(player.y / PIXEL_SIZE) * PIXEL_SIZE;
            const scale = player.width / 32;
            ctx.fillStyle = playerColor;
            ctx.fillRect(x + 12 * scale, y, 8 * scale, 24 * scale);
            ctx.fillRect(x, y + 16 * scale, 32 * scale, 8 * scale);
            ctx.fillRect(x + 8 * scale, y + 4 * scale, 16 * scale, 8 * scale);
            ctx.fillRect(x + 4 * scale, y + 24 * scale, 8 * scale, 8 * scale);
            ctx.fillRect(x + 20 * scale, y + 24 * scale, 8 * scale, 8 * scale);
        },
        [playerColor]
    );

    const drawBullet = useCallback(
        (ctx: CanvasRenderingContext2D, bullet: Bullet) => {
            drawPixelRect(ctx, bullet.x, bullet.y, bullet.width, bullet.height, bulletColor);
        },
        [bulletColor, drawPixelRect]
    );

    const drawEnemyBullet = useCallback(
        (ctx: CanvasRenderingContext2D, bullet: Bullet) => {
            drawPixelRect(ctx, bullet.x, bullet.y, bullet.width, bullet.height, enemyBulletColor);
        },
        [enemyBulletColor, drawPixelRect]
    );

    const drawEnemy = useCallback(
        (ctx: CanvasRenderingContext2D, enemy: EnemyEntity) => {
            const x = Math.floor(enemy.x / PIXEL_SIZE) * PIXEL_SIZE;
            const y = Math.floor(enemy.y / PIXEL_SIZE) * PIXEL_SIZE;
            const scale = enemy.width / 24;
            ctx.fillStyle = enemyColor;
            ctx.fillRect(x + 10 * scale, y, 4 * scale, 12 * scale);
            ctx.fillRect(x + 4 * scale, y + 8 * scale, 16 * scale, 4 * scale);
            ctx.fillRect(x + 8 * scale, y + 2 * scale, 8 * scale, 4 * scale);
            ctx.fillRect(x + 6 * scale, y + 12 * scale, 4 * scale, 4 * scale);
            ctx.fillRect(x + 14 * scale, y + 12 * scale, 4 * scale, 4 * scale);
        },
        [enemyColor]
    );

    const drawExplosion = useCallback(
        (ctx: CanvasRenderingContext2D, explosion: Explosion) => {
            const x = Math.floor(explosion.x / PIXEL_SIZE) * PIXEL_SIZE;
            const y = Math.floor(explosion.y / PIXEL_SIZE) * PIXEL_SIZE;
            const size = explosion.frame * 4;
            ctx.fillStyle = explosionColor;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (Math.random() > 0.3) {
                        ctx.fillRect(x + i * 8 - size / 2, y + j * 8 - size / 2, 8, 8);
                    }
                }
            }
        },
        [explosionColor]
    );

    const checkCollision = useCallback((obj1: Entity, obj2: Entity) => {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }, []);

    const spawnEnemy = useCallback((): EnemyEntity => {
        return {
            x: Math.random() * (CANVAS_WIDTH - enemySize),
            y: -enemySize,
            width: enemySize,
            height: enemySize,
            speed: 2 + Math.random() * 3,
            active: true,
            type: Math.floor(Math.random() * 2),
        };
    }, [enemySize]);

    const fireBullet = useCallback(
        (player: Player): Bullet => ({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 12,
            speed: 8,
            active: true,
        }),
        []
    );

    const fireEnemyBullet = useCallback(
        (enemy: EnemyEntity): Bullet => ({
            x: enemy.x + enemy.width / 2 - 2,
            y: enemy.y + enemy.height,
            width: 4,
            height: 8,
            speed: 4,
            active: true,
        }),
        []
    );

    const resetGame = useCallback(() => {
        setScore(0);
        setGameState({
            player: { x: 400, y: 500, width: playerSize, height: playerSize, speed: 5, active: true },
            bullets: [],
            enemyBullets: [],
            enemies: [],
            explosions: [],
            lastEnemySpawn: 0,
            lastBulletFire: 0,
            gameOver: false,
        });
    }, [playerSize]);

    const updateGame = useCallback(() => {
        setGameState((prevState) => {
            if (prevState.gameOver) return prevState;
            const newState: GameState = { ...prevState, player: { ...prevState.player } };
            const currentTime = Date.now();

            if (keysRef.current.has("ArrowLeft") && newState.player.x > 0) {
                newState.player.x -= newState.player.speed * gameSpeed;
            }
            if (keysRef.current.has("ArrowRight") && newState.player.x < CANVAS_WIDTH - newState.player.width) {
                newState.player.x += newState.player.speed * gameSpeed;
            }
            if (keysRef.current.has("ArrowUp") && newState.player.y > 0) {
                newState.player.y -= newState.player.speed * gameSpeed;
            }
            if (keysRef.current.has("ArrowDown") && newState.player.y < CANVAS_HEIGHT - newState.player.height) {
                newState.player.y += newState.player.speed * gameSpeed;
            }

            if (touchRef.current) {
                const targetX = touchRef.current.x - newState.player.width / 2;
                const targetY = touchRef.current.y - newState.player.height / 2;
                const dx = targetX - newState.player.x;
                const dy = targetY - newState.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 5) {
                    newState.player.x += (dx / distance) * newState.player.speed * gameSpeed;
                    newState.player.y += (dy / distance) * newState.player.speed * gameSpeed;
                }
                newState.player.x = Math.max(0, Math.min(CANVAS_WIDTH - newState.player.width, newState.player.x));
                newState.player.y = Math.max(0, Math.min(CANVAS_HEIGHT - newState.player.height, newState.player.y));
            }

            if (currentTime - newState.lastBulletFire > 200) {
                newState.bullets = [...newState.bullets, fireBullet(newState.player)];
                newState.lastBulletFire = currentTime;
            }

            newState.bullets = newState.bullets.filter((bullet) => {
                bullet.y -= bullet.speed * gameSpeed;
                return bullet.y > -bullet.height && bullet.active;
            });

            newState.enemyBullets = newState.enemyBullets.filter((bullet) => {
                bullet.y += bullet.speed * gameSpeed;
                return bullet.y < CANVAS_HEIGHT + bullet.height && bullet.active;
            });

            if (currentTime - newState.lastEnemySpawn > 1000) {
                newState.enemies = [...newState.enemies, spawnEnemy()];
                newState.lastEnemySpawn = currentTime;
            }

            newState.enemies = newState.enemies.filter((enemy) => {
                enemy.y += enemy.speed * gameSpeed;
                if (Math.random() < 0.005 * gameSpeed) {
                    newState.enemyBullets.push(fireEnemyBullet(enemy));
                }
                return enemy.y < CANVAS_HEIGHT + enemy.height && enemy.active;
            });

            newState.bullets.forEach((bullet) => {
                newState.enemies.forEach((enemy) => {
                    if (bullet.active && enemy.active && checkCollision(bullet, enemy)) {
                        bullet.active = false;
                        enemy.active = false;
                        newState.explosions.push({
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y + enemy.height / 2,
                            frame: 0,
                            active: true,
                        });
                        startTransition(() => setScore((prev) => prev + (enemy.type + 1) * 10));
                    }
                });
            });

            newState.enemies.forEach((enemy) => {
                if (enemy.active && checkCollision(enemy, newState.player)) {
                    newState.gameOver = true;
                    newState.explosions.push({
                        x: newState.player.x + newState.player.width / 2,
                        y: newState.player.y + newState.player.height / 2,
                        frame: 0,
                        active: true,
                    });
                }
            });

            newState.enemyBullets.forEach((bullet) => {
                if (bullet.active && checkCollision(bullet, newState.player)) {
                    newState.gameOver = true;
                    newState.explosions.push({
                        x: newState.player.x + newState.player.width / 2,
                        y: newState.player.y + newState.player.height / 2,
                        frame: 0,
                        active: true,
                    });
                }
            });

            newState.bullets = newState.bullets.filter((bullet) => bullet.active);
            newState.enemyBullets = newState.enemyBullets.filter((bullet) => bullet.active);
            newState.enemies = newState.enemies.filter((enemy) => enemy.active);

            newState.explosions = newState.explosions.filter((explosion) => {
                explosion.frame++;
                return explosion.frame < 10;
            });

            return newState;
        });
    }, [gameSpeed, fireBullet, fireEnemyBullet, spawnEnemy, checkCollision]);

    useEffect(() => {
        setGameState((prevState) => ({
            ...prevState,
            player: { ...prevState.player, width: playerSize, height: playerSize },
        }));
    }, [playerSize]);

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = starColor;
        ctx.globalAlpha = starOpacity;
        for (let i = 0; i < 50; i++) {
            const x = (i * 137 + Math.sin(i * 2.3) * 100) % CANVAS_WIDTH;
            const y = (i * 197 + Math.cos(i * 1.7) * 150 + Date.now() * 0.1) % CANVAS_HEIGHT;
            const starX = Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE;
            const starY = Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE;
            const size = starSize * PIXEL_SIZE;
            ctx.fillRect(starX, starY - size, size, size * 3);
            ctx.fillRect(starX - size, starY, size * 3, size);
        }
        ctx.globalAlpha = 1;

        if (!gameState.gameOver) {
            drawPlayer(ctx, gameState.player);
        }
        gameState.bullets.forEach((bullet) => drawBullet(ctx, bullet));
        gameState.enemyBullets.forEach((bullet) => drawEnemyBullet(ctx, bullet));
        gameState.enemies.forEach((enemy) => drawEnemy(ctx, enemy));
        gameState.explosions.forEach((explosion) => drawExplosion(ctx, explosion));

        if (gameState.gameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }, [
        backgroundColor,
        starColor,
        starSize,
        starOpacity,
        gameState,
        score,
        scoreColor,
        drawPlayer,
        drawBullet,
        drawEnemyBullet,
        drawEnemy,
        drawExplosion,
    ]);

    const gameLoop = useCallback(() => {
        updateGame();
        render();
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [updateGame, render]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if ((ARROW_KEYS as readonly string[]).includes(e.key)) {
                e.preventDefault();
                keysRef.current.add(e.key as ArrowKey);
            }
            if (gameState.gameOver) {
                e.preventDefault();
                resetGame();
            }
        },
        [gameState.gameOver, resetGame]
    );

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        keysRef.current.delete(e.key);
    }, []);

    const getDirectionFromTouch = (touchX: number, touchY: number, rect: DOMRect): ArrowKey => {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const isLeft = touchX < centerX;
        const isUp = touchY < centerY;
        const horizontalDistance = Math.abs(touchX - centerX);
        const verticalDistance = Math.abs(touchY - centerY);
        if (horizontalDistance > verticalDistance) {
            return isLeft ? "ArrowLeft" : "ArrowRight";
        }
        return isUp ? "ArrowUp" : "ArrowDown";
    };

    const handleTouchStart = useCallback(
        (e: React.TouchEvent<HTMLCanvasElement>) => {
            e.preventDefault();
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect && e.touches[0]) {
                const touchX = e.touches[0].clientX - rect.left;
                const touchY = e.touches[0].clientY - rect.top;
                keysRef.current.add(getDirectionFromTouch(touchX, touchY, rect));
            }
            if (gameState.gameOver) {
                resetGame();
            }
        },
        [gameState.gameOver, resetGame]
    );

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        keysRef.current.delete("ArrowLeft");
        keysRef.current.delete("ArrowRight");
        keysRef.current.delete("ArrowUp");
        keysRef.current.delete("ArrowDown");
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect && e.touches[0]) {
            const touchX = e.touches[0].clientX - rect.left;
            const touchY = e.touches[0].clientY - rect.top;
            keysRef.current.add(getDirectionFromTouch(touchX, touchY, rect));
        }
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        keysRef.current.delete("ArrowLeft");
        keysRef.current.delete("ArrowRight");
        keysRef.current.delete("ArrowUp");
        keysRef.current.delete("ArrowDown");
    }, []);

    const handleCanvasClick = useCallback(() => {
        if (gameState.gameOver) {
            resetGame();
        }
    }, [gameState.gameOver, resetGame]);

    useEffect(() => {
        let isVisible = true;

        const startLoop = () => {
            if (gameLoopRef.current === null) {
                gameLoopRef.current = requestAnimationFrame(gameLoop);
            }
        };

        const stopLoop = () => {
            if (gameLoopRef.current !== null) {
                cancelAnimationFrame(gameLoopRef.current);
                gameLoopRef.current = null;
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopLoop();
            } else if (isVisible) {
                startLoop();
            }
        };

        const canvas = canvasRef.current;
        let observer: IntersectionObserver | undefined;
        if (canvas && "IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    isVisible = entry.isIntersecting;
                    if (isVisible && !document.hidden) {
                        startLoop();
                    } else {
                        stopLoop();
                    }
                },
                { threshold: 0 }
            );
            observer.observe(canvas);
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        startLoop();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (observer) observer.disconnect();
            stopLoop();
        };
    }, [gameLoop, handleKeyDown, handleKeyUp]);

    return (
        <div
            className={cn(
                "relative w-full aspect-[4/3] overflow-hidden rounded-lg select-none",
                className
            )}
            style={{ backgroundColor }}
        >
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="block h-full w-full [image-rendering:pixelated]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleCanvasClick}
            />
            <div
                className="pointer-events-none absolute left-4 top-4 text-xl font-bold sm:text-2xl"
                style={{ color: scoreColor, ...font }}
            >
                SCORE: {score}
            </div>
            <div
                className="pointer-events-none absolute bottom-4 left-4 text-[10px] sm:text-xs"
                style={{ color: scoreColor, ...font }}
            >
                Arrow Keys / Touch to Move
            </div>
            {gameState.gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/10">
                    <p className="text-2xl font-bold" style={{ color: scoreColor, ...font }}>
                        Game over
                    </p>
                    <p className="text-sm" style={{ color: scoreColor, ...font }}>
                        Skor akhir: {score}
                    </p>
                    <Button onClick={resetGame} size="lg">
                        Main lagi
                    </Button>
                </div>
            )}
        </div>
    );
}
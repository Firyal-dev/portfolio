"use client";

import {
    useState,
    useEffect,
    useRef,
    useCallback,
    type CSSProperties,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PIXEL_SIZE = 4;
/** Speeds are expressed per 60fps frame; dt scales them so the game runs at the
 *  same pace on a 120Hz display. */
const FRAME_MS = 1000 / 60;
const BULLET_COOLDOWN_MS = 200;
const ENEMY_SPAWN_COOLDOWN_MS = 1000;

interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Entity extends Box {
    speed: number;
    active: boolean;
}

interface EnemyEntity extends Entity {
    type: number;
}

interface Player {
    x: number;
    y: number;
    speed: number;
}

interface Explosion {
    x: number;
    y: number;
    frame: number;
}

interface GameState {
    player: Player;
    bullets: Entity[];
    enemyBullets: Entity[];
    enemies: EnemyEntity[];
    explosions: Explosion[];
    elapsed: number;
    nextBulletFire: number;
    nextEnemySpawn: number;
    gameOver: boolean;
}

const createState = (): GameState => ({
    player: { x: 400, y: 500, speed: 5 },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    explosions: [],
    elapsed: 0,
    nextBulletFire: BULLET_COOLDOWN_MS,
    nextEnemySpawn: ENEMY_SPAWN_COOLDOWN_MS,
    gameOver: false,
});

const ARROW_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"] as const;
type ArrowKey = (typeof ARROW_KEYS)[number];

const overlaps = (a: Box, b: Box) =>
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

function spawnEnemy(size: number): EnemyEntity {
    return {
        x: Math.random() * (CANVAS_WIDTH - size),
        y: -size,
        width: size,
        height: size,
        speed: 2 + Math.random() * 3,
        active: true,
        type: Math.floor(Math.random() * 2),
    };
}

function getDirectionFromTouch(touchX: number, touchY: number, rect: DOMRect): ArrowKey {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const horizontalDistance = Math.abs(touchX - centerX);
    const verticalDistance = Math.abs(touchY - centerY);
    if (horizontalDistance > verticalDistance) {
        return touchX < centerX ? "ArrowLeft" : "ArrowRight";
    }
    return touchY < centerY ? "ArrowUp" : "ArrowDown";
}

const clearKeys = (keys: Set<string>) => {
    for (const key of ARROW_KEYS) keys.delete(key);
};

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
    const keysRef = useRef<Set<string>>(new Set());
    /** The simulation runs at 60fps, so it lives in a ref: React state would
     *  re-render the whole component every frame. Only score/gameOver — the two
     *  things the DOM actually shows — are React state. */
    const stateRef = useRef<GameState>(createState());

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const drawPixelRect = useCallback(
        (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(
                Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE,
                Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE,
                Math.floor(width / PIXEL_SIZE) * PIXEL_SIZE,
                Math.floor(height / PIXEL_SIZE) * PIXEL_SIZE
            );
        },
        []
    );

    const drawPlayer = useCallback(
        (ctx: CanvasRenderingContext2D, player: Player) => {
            const x = Math.floor(player.x / PIXEL_SIZE) * PIXEL_SIZE;
            const y = Math.floor(player.y / PIXEL_SIZE) * PIXEL_SIZE;
            const scale = playerSize / 32;
            ctx.fillStyle = playerColor;
            ctx.fillRect(x + 12 * scale, y, 8 * scale, 24 * scale);
            ctx.fillRect(x, y + 16 * scale, 32 * scale, 8 * scale);
            ctx.fillRect(x + 8 * scale, y + 4 * scale, 16 * scale, 8 * scale);
            ctx.fillRect(x + 4 * scale, y + 24 * scale, 8 * scale, 8 * scale);
            ctx.fillRect(x + 20 * scale, y + 24 * scale, 8 * scale, 8 * scale);
        },
        [playerColor, playerSize]
    );

    const drawBullet = useCallback(
        (ctx: CanvasRenderingContext2D, bullet: Entity) => {
            drawPixelRect(ctx, bullet.x, bullet.y, bullet.width, bullet.height, bulletColor);
        },
        [bulletColor, drawPixelRect]
    );

    const drawEnemyBullet = useCallback(
        (ctx: CanvasRenderingContext2D, bullet: Entity) => {
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

    const update = useCallback((dt: number) => {
        const s = stateRef.current;
        const p = s.player;

        // Explosions keep animating after death, so this runs before the gameOver bail-out.
        s.explosions = s.explosions.filter((explosion) => {
            explosion.frame++;
            return explosion.frame < 10;
        });
        if (s.gameOver) return;

        s.elapsed += dt * FRAME_MS;

        if (keysRef.current.has("ArrowLeft") && p.x > 0) p.x -= p.speed * gameSpeed * dt;
        if (keysRef.current.has("ArrowRight") && p.x < CANVAS_WIDTH - playerSize) p.x += p.speed * gameSpeed * dt;
        if (keysRef.current.has("ArrowUp") && p.y > 0) p.y -= p.speed * gameSpeed * dt;
        if (keysRef.current.has("ArrowDown") && p.y < CANVAS_HEIGHT - playerSize) p.y += p.speed * gameSpeed * dt;

        if (s.elapsed >= s.nextBulletFire) {
            s.bullets.push({
                x: p.x + playerSize / 2 - 2,
                y: p.y,
                width: 4,
                height: 12,
                speed: 8,
                active: true,
            });
            s.nextBulletFire = s.elapsed + BULLET_COOLDOWN_MS;
        }

        if (s.elapsed >= s.nextEnemySpawn) {
            s.enemies.push(spawnEnemy(enemySize));
            s.nextEnemySpawn = s.elapsed + ENEMY_SPAWN_COOLDOWN_MS;
        }

        for (const bullet of s.bullets) bullet.y -= bullet.speed * gameSpeed * dt;
        for (const bullet of s.enemyBullets) bullet.y += bullet.speed * gameSpeed * dt;
        for (const enemy of s.enemies) {
            enemy.y += enemy.speed * gameSpeed * dt;
            // ponytail: fixed 0.5% chance per enemy per frame. Raise it (or make it
            // difficulty-scaled) once it feels too sparse — dt keeps it frame-rate independent.
            if (Math.random() < 0.005 * gameSpeed * dt) {
                s.enemyBullets.push({
                    x: enemy.x + enemy.width / 2 - 2,
                    y: enemy.y + enemy.height,
                    width: 4,
                    height: 8,
                    speed: 4,
                    active: true,
                });
            }
        }

        s.bullets = s.bullets.filter((bullet) => bullet.y > -bullet.height && bullet.active);
        s.enemyBullets = s.enemyBullets.filter((bullet) => bullet.y < CANVAS_HEIGHT + bullet.height && bullet.active);
        s.enemies = s.enemies.filter((enemy) => enemy.y < CANVAS_HEIGHT + enemy.height && enemy.active);

        for (const bullet of s.bullets) {
            if (!bullet.active) continue;
            for (const enemy of s.enemies) {
                if (!enemy.active || !overlaps(bullet, enemy)) continue;
                bullet.active = false;
                enemy.active = false;
                s.explosions.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, frame: 0 });
                setScore((prev) => prev + (enemy.type + 1) * 10);
            }
        }

        s.bullets = s.bullets.filter((bullet) => bullet.active);
        s.enemies = s.enemies.filter((enemy) => enemy.active);

        const playerBox: Box = { x: p.x, y: p.y, width: playerSize, height: playerSize };
        const hitPlayer = (box: Box) => {
            if (s.gameOver || !overlaps(box, playerBox)) return;
            s.gameOver = true;
            s.explosions.push({
                x: playerBox.x + playerSize / 2,
                y: playerBox.y + playerSize / 2,
                frame: 0,
            });
            setGameOver(true);
        };
        for (const enemy of s.enemies) hitPlayer(enemy);
        for (const bullet of s.enemyBullets) hitPlayer(bullet);
    }, [gameSpeed, playerSize, enemySize]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const s = stateRef.current;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = starColor;
        ctx.globalAlpha = starOpacity;
        for (let i = 0; i < 50; i++) {
            const x = (i * 137 + Math.sin(i * 2.3) * 100) % CANVAS_WIDTH;
            const y = (i * 197 + Math.cos(i * 1.7) * 150 + s.elapsed * 0.1) % CANVAS_HEIGHT;
            const starX = Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE;
            const starY = Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE;
            const size = starSize * PIXEL_SIZE;
            ctx.fillRect(starX, starY - size, size, size * 3);
            ctx.fillRect(starX - size, starY, size * 3, size);
        }
        ctx.globalAlpha = 1;

        if (!s.gameOver) drawPlayer(ctx, s.player);
        for (const bullet of s.bullets) drawBullet(ctx, bullet);
        for (const bullet of s.enemyBullets) drawEnemyBullet(ctx, bullet);
        for (const enemy of s.enemies) drawEnemy(ctx, enemy);
        for (const explosion of s.explosions) drawExplosion(ctx, explosion);

        if (s.gameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }, [
        backgroundColor,
        starColor,
        starSize,
        starOpacity,
        drawPlayer,
        drawBullet,
        drawEnemyBullet,
        drawEnemy,
        drawExplosion,
    ]);

    const resetGame = useCallback(() => {
        stateRef.current = createState();
        clearKeys(keysRef.current);
        setScore(0);
        setGameOver(false);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((ARROW_KEYS as readonly string[]).includes(e.key)) {
            e.preventDefault();
            keysRef.current.add(e.key);
        }
        if (stateRef.current.gameOver) {
            e.preventDefault();
            resetGame();
        }
    }, [resetGame]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        keysRef.current.delete(e.key);
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect && e.touches[0]) {
            const { clientX, clientY } = e.touches[0];
            keysRef.current.add(getDirectionFromTouch(clientX - rect.left, clientY - rect.top, rect));
        }
        if (stateRef.current.gameOver) resetGame();
    }, [resetGame]);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        clearKeys(keysRef.current);
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect && e.touches[0]) {
            const { clientX, clientY } = e.touches[0];
            keysRef.current.add(getDirectionFromTouch(clientX - rect.left, clientY - rect.top, rect));
        }
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        clearKeys(keysRef.current);
    }, []);

    const handleCanvasClick = useCallback(() => {
        if (stateRef.current.gameOver) resetGame();
    }, [resetGame]);

    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        let running = false;
        let onScreen = true;

        function step(now: number) {
            const dt = Math.min(2, (now - last) / FRAME_MS);
            last = now;
            update(dt);
            draw();
            raf = requestAnimationFrame(step);
        }

        const start = () => {
            if (running) return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(step);
        };

        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) stop();
            else if (onScreen) start();
        };

        const canvas = canvasRef.current;
        let observer: IntersectionObserver | undefined;
        if (canvas && "IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    onScreen = entry.isIntersecting;
                    if (onScreen && !document.hidden) start();
                    else stop();
                },
                { threshold: 0 }
            );
            observer.observe(canvas);
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        start();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            observer?.disconnect();
            stop();
        };
    }, [update, draw, handleKeyDown, handleKeyUp]);

    return (
        <div
            className={cn(
                "flex h-dvh w-screen select-none items-center justify-center overflow-hidden bg-black",
                className
            )}
        >
            <div className="relative h-[min(100dvh,calc(100vw*3/4))] aspect-[4/3]">
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
                {gameOver && (
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
            {/* The nav is gone on this page, so this is the only way off a 404. */}
            <Link
                href="/"
                className="absolute right-4 top-4 rounded-md border border-white/20 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={font}
            >
                ← Home
            </Link>
        </div>
    );
}
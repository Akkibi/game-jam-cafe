import { useStore } from "../store/globalStore";

type Platform = {
	position: { x: number; y: number; z: number };
	isMoving: boolean;
	direction: { x: number; y: number; z: number };
};

export class GameEngine {
	private platforms: Array<Platform> = [];

	constructor() {}

    public addPlatform(platform: Platform) {
        this.platforms.push(platform);
    }
    
    public update() {
        const gameState = useStore.getState();
        if (gameState.isGameOver) return;
        this.platforms.forEach((platform) => {
            if (platform.isMoving) {
                platform.position.x += platform.direction.x;
                platform.position.y += platform.direction.y;
                platform.position.z += platform.direction.z;
            }
        });
    }

    public phase1() {
        
    }
}

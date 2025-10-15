import * as Three from "three";
import { Vector3 } from "three";

export class BaseSceneElement {
	protected position: Vector3;
	protected isMoving: boolean;
	protected direction: Vector3;
	protected lifeSpan: number;
	protected mesh: Three.Mesh = new Three.Mesh();

	constructor(
		sceneElements: BaseSceneElement[],
		position: Vector3,
		lifeSpan: number
	) {
		this.position = position;
		this.lifeSpan = lifeSpan;
		this.isMoving = false;
		this.direction = new Vector3();

		this.addToScene(sceneElements);

		setTimeout(() => {
			this.removeFromScene(sceneElements);
		}, this.lifeSpan);
	}

	protected addToScene(sceneElements: BaseSceneElement[]) {
		sceneElements.push(this);
	}

	protected removeFromScene(sceneElements: BaseSceneElement[]) {
		const index = sceneElements.indexOf(this);
		if (index > -1) {
			sceneElements.splice(index, 1);
		}
	}
}

import { Vector3 } from "three";
import { BaseSceneElement } from "./BaseSceneElement";

export class Floor extends BaseSceneElement {
	constructor(
		position: Vector3,
		lifeSpan: number,
		sceneElements: BaseSceneElement[]
	) {
		super(sceneElements, position, lifeSpan);
	}
}

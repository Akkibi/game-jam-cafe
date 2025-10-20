import { Vector3 } from "three";

type BaseSceneElementType = {
	size: Vector3;
	position: Vector3;
	lifeSpan: number;
};

type PlateformType = BaseSceneElementType & {
	plateformType: "c" | "v" | "cg";
	isMoving?: boolean;
};

type WaterfallType = BaseSceneElementType & {
	length: number;
};

type Block = {
	duration: number;
	id: number;
	blockElements: (PlateformType | WaterfallType)[];
};

export const Blocks: Block[] = [
	{
		duration: 30000,
		id: 0,
		blockElements: [
			{
				position: new Vector3(-3, 0, 0),
				size: new Vector3(2, 0.5, 1.9),
				lifeSpan: 10000,
				plateformType: "c",
			},
			// {
			// 	position: new Vector3(-3, 0, 0),
			// 	size: new Vector3(4, 2, 1),

			// 	lifeSpan: 15000,
			// 	plateformType: "v",
			// },
		],
	},
	{
		duration: 30000,
		id: 1,
		blockElements: [
			{
				position: new Vector3(-3, 0, 0),
				size: new Vector3(4, 2, 1),
				lifeSpan: 10000,
				plateformType: "c",
			},
			{
				position: new Vector3(-3, 0, 0),
				size: new Vector3(4, 2, 1),
				lifeSpan: 15000,
				plateformType: "v",
			},
		],
	},
];

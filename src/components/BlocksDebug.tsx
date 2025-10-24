import { useStore } from '../store/globalStore';

export default function BlocksDebug() {
	const store = useStore();
	const activeBlocks = store.activeBlocks;

	const getBlockPosition = (location: number) => {
		switch (location) {
			case 0:
				return 'top-4 left-4';
			case 1:
				return 'top-4 right-4';
			case 2:
				return 'bottom-4 left-4';
			case 3:
				return 'bottom-4 right-4';
			default:
				return '';
		}
	};

	return (
		<div className="fixed top-0 left-0 w-screen h-screen z-40">
			{activeBlocks.map((block) => (
				<div
					key={block.id}
					className={`block absolute ${getBlockPosition(block.location)} text-white text-5xl`}
				>
					{block.id} - {Math.round(block.id / 4 - 0.5)}
				</div>
			))}
		</div>
	);
}

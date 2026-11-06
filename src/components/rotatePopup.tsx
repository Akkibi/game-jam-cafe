import { useStore } from '../store/globalStore';

const RotatePopup = () => {
	const isRotateBlocked = useStore((s) => s.isRotateBlocked);
	if (!isRotateBlocked) return null;

	return (
		<div
			aria-modal="true"
			className="fixed inset-0 z-[110] flex touch-none items-center justify-center bg-black/50 p-8"
			role="dialog"
		>
			<div className="flex max-w-xs flex-col items-center gap-4 rounded-2xl border-2 border-[#A56C44] bg-[#0b1028]/90 px-6 py-8 text-center text-white">
				<div className="rotate-hint h-20 w-11 rounded-lg border-4 border-[#A56C44]" />
				<p className="text-3xl leading-tight">Tourne ton mobile</p>
				<p className="text-lg leading-snug text-white/80">
					Le jeu se joue en mode paysage.
				</p>
			</div>
		</div>
	);
};

export default RotatePopup;

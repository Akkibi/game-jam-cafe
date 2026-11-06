import type { ReactNode } from 'react';

const BarBackground = ({ color, className }: { color: string; className?: string }): ReactNode => {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			// width="469.79"
			// height="42.03"
			viewBox="0 0 469.79 42.03"
		>
			<defs>
				<style>
					{`
            .cls-1 {
              fill: ${color};
              stroke: #1d1d1b;
              stroke-miterlimit: 10;
              stroke-width: 2px;
            }

            .cls-2 {
              fill: #1d1d1b;
              stroke-width: 0px;
            }
          `}
				</style>
			</defs>
			<polygon
				className="cls-2"
				points="468.79 40.03 52.4 40.03 15.87 7.38 432.26 7.38 468.79 40.03"
			/>
			<polygon
				className="cls-1"
				points="455.78 35.54 39.38 35.54 2.86 2.89 419.25 2.89 455.78 35.54"
			/>
		</svg>
	);
};

export default BarBackground;

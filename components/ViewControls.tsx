import { FC, ReactNode } from 'react';
import { ZoomInIcon, ZoomOutIcon, ResetViewIcon } from './icons';

interface ViewControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ViewControls: FC<ViewControlsProps> = ({ onZoomIn, onZoomOut, onReset }) => {
  const Button: FC<{ onClick: () => void; children: ReactNode; ariaLabel: string }> = ({ onClick, children, ariaLabel }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="h-10 w-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all duration-200"
    >
      {children}
    </button>
  );

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
      <Button onClick={onZoomIn} ariaLabel="Zoom In"><ZoomInIcon className="w-5 h-5" /></Button>
      <Button onClick={onZoomOut} ariaLabel="Zoom Out"><ZoomOutIcon className="w-5 h-5" /></Button>
      <Button onClick={onReset} ariaLabel="Reset View"><ResetViewIcon className="w-5 h-5" /></Button>
    </div>
  );
};

export default ViewControls;
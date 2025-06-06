import React, { useEffect, useRef } from 'react';

interface MNISTImageProps {
  pixels: number[][]; // 28x28 matrix
  label: string;
  isOriginal?: boolean;
}

export const MNISTImage: React.FC<MNISTImageProps> = ({ pixels, label, isOriginal = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !pixels || pixels.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 112;
    canvas.height = 112;
    
    // Create ImageData for 28x28
    const imageData = ctx.createImageData(28, 28);
    
    // Convert 28x28 matrix to ImageData
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const pixelValue = Math.floor(pixels[y][x] * 255);
        const index = (y * 28 + x) * 4;
        
        imageData.data[index] = pixelValue;     // R
        imageData.data[index + 1] = pixelValue; // G
        imageData.data[index + 2] = pixelValue; // B
        imageData.data[index + 3] = 255;        // A
      }
    }
    
    // Draw at original size first
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0);
      
      // Scale up with crisp pixels (no smoothing)
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tempCanvas, 0, 0, 28, 28, 0, 0, 112, 112);
    }
    
  }, [pixels]);
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas
        ref={canvasRef}
        className={`border-2 rounded-lg ${
          isOriginal ? 'border-green-500/50' : 'border-blue-500/50'
        } bg-black`}
        style={{ imageRendering: 'pixelated' }}
      />
      <p className={`text-xs font-medium ${
        isOriginal ? 'text-green-400' : 'text-blue-400'
      }`}>
        {label}
      </p>
    </div>
  );
};

interface ImageGridProps {
  originalImages: number[][][];
  reconstructions: number[][][];
  labels?: number[];
}

export const ImageReconstructionGrid: React.FC<ImageGridProps> = ({ 
  originalImages, 
  reconstructions, 
  labels 
}) => {
  if (!originalImages.length || !reconstructions.length) {
    return (
      <div className="glass-panel p-8 rounded-xl text-center">
        <p className="text-muted-foreground">Run training to see real MNIST digit reconstructions</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-xl space-y-6">
      <h3 className="text-lg font-semibold text-center text-accent">
        Real MNIST Digit Reconstruction
      </h3>
      
      <div className="space-y-6">
        {/* Original Images */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-center text-green-400">
            Original MNIST Digits
          </h4>
          <div className="grid grid-cols-4 gap-4 justify-items-center">
            {originalImages.slice(0, 4).map((image, idx) => (
              <MNISTImage
                key={`original-${idx}`}
                pixels={image}
                label={labels ? `Digit ${labels[idx]}` : `Sample ${idx + 1}`}
                isOriginal={true}
              />
            ))}
          </div>
        </div>
        
        {/* Reconstructed Images */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-center text-blue-400">
            VAE Reconstructions
          </h4>
          <div className="grid grid-cols-4 gap-4 justify-items-center">
            {reconstructions.slice(0, 4).map((image, idx) => (
              <MNISTImage
                key={`reconstruction-${idx}`}
                pixels={image}
                label={labels ? `Recon ${labels[idx]}` : `Recon ${idx + 1}`}
                isOriginal={false}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground mt-4">
        Real MNIST digits • VAE learns to compress and reconstruct handwritten digits
      </div>
    </div>
  );
};

export default MNISTImage;

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  Camera,
  CheckCircle2,
  RefreshCw,
  Video,
  VideoOff,
  ZoomIn,
} from 'lucide-react';

interface CameraScannerProps {
  /** Called with the captured JPEG File so the parent can push it through OCR. */
  onCapture: (file: File) => void;
  /** Called when the user resets / retakes. */
  onReset?: () => void;
  /** Whether a capture has already been confirmed by the parent. */
  captured: boolean;
  capturedFileName?: string;
  productType: 'durable' | 'beauty';
}

type CameraState =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'unsupported'
  | 'captured';

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onCapture,
  onReset,
  captured,
  capturedFileName,
  productType,
}) => {
  // The <video> element is ALWAYS in the DOM so the ref is valid immediately.
  // We just show/hide it with CSS to avoid the "set srcObject before mount" bug.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>(
    captured ? 'captured' : 'idle'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [capturedPreviewUrl, setCapturedPreviewUrl] = useState<string | null>(null);

  // ──────────────────────────────────────────────────────────────
  // Wire stream → video AFTER React has rendered the <video> tag.
  // This useEffect runs whenever cameraState flips to 'active'.
  // At that point the <video> element is definitely in the DOM.
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (cameraState === 'active' && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.play().catch(() => {
        // Some browsers require a user gesture; autoPlay attr handles most cases.
      });
    }
  }, [cameraState]);

  // ──────────────────────────────────────────────────────────────
  // Cleanup on unmount
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopStream();
      if (capturedPreviewUrl) URL.revokeObjectURL(capturedPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────────────────
  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  // ──────────────────────────────────────────────────────────────
  // Start camera
  // ──────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setErrorMsg(null);
    setCameraState('requesting');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      setErrorMsg(
        'Your browser does not support camera access. Please use Chrome, Edge, or Firefox over HTTPS or localhost.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // rear cam on phones; front on laptops
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      // Store the stream BEFORE updating state so the useEffect above can find it.
      streamRef.current = stream;

      // Setting state here causes a re-render. The <video> element is already
      // in the DOM (always rendered, just hidden). The useEffect above then
      // immediately wires srcObject to it.
      setCameraState('active');
    } catch (err: any) {
      stopStream();

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMsg(
          'Camera permission was denied. Please allow camera access in your browser settings and try again.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('unsupported');
        setErrorMsg(
          'No camera device was found on this computer. Please upload a file instead.'
        );
      } else {
        setCameraState('denied');
        setErrorMsg(`Camera error: ${err.message || err.name}`);
      }
    }
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Capture frame → canvas → JPEG File
  // ──────────────────────────────────────────────────────────────
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    // Use naturalWidth/Height; fall back to clientWidth if stream hasn't
    // delivered dimensions yet (videoWidth can be 0 briefly on some browsers).
    const w = video.videoWidth || video.clientWidth;
    const h = video.videoHeight || video.clientHeight;

    if (!w || !h) return;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);

    // White-flash shutter effect
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 220);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const fileName =
          productType === 'durable'
            ? `Serial_Barcode_Scan_${Date.now()}.jpg`
            : `Batch_Code_Macro_Scan_${Date.now()}.jpg`;

        const file = new File([blob], fileName, { type: 'image/jpeg' });

        const previewUrl = URL.createObjectURL(blob);
        setCapturedPreviewUrl(previewUrl);

        stopStream();
        setCameraState('captured');
        onCapture(file);
      },
      'image/jpeg',
      0.92
    );
  }, [onCapture, productType]);

  // ──────────────────────────────────────────────────────────────
  // Retake
  // ──────────────────────────────────────────────────────────────
  const handleRetake = () => {
    if (capturedPreviewUrl) {
      URL.revokeObjectURL(capturedPreviewUrl);
      setCapturedPreviewUrl(null);
    }
    setCameraState('idle');
    setErrorMsg(null);
    onReset?.();
  };

  const scannerLabel =
    productType === 'durable'
      ? 'Point at invoice, serial label, or barcode'
      : 'Point at batch code sticker or carton packaging';

  const isViewfinderVisible = cameraState === 'active';

  // ──────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-950 rounded-2xl p-5 text-white shadow-xl overflow-hidden">

      {/* ── IDLE ── */}
      {cameraState === 'idle' && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
            <Video className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white mb-1">Camera Scanner</p>
            <p className="text-xs text-slate-400">
              Allow camera access to capture your document in real time
            </p>
          </div>
          <button
            onClick={startCamera}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg"
          >
            <Camera className="w-4 h-4" />
            Enable Camera
          </button>
        </div>
      )}

      {/* ── REQUESTING ── */}
      {cameraState === 'requesting' && (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Requesting camera permission…</p>
        </div>
      )}

      {/* ── ACTIVE: live viewfinder ──
          The <video> element is ALWAYS rendered but hidden until active.
          This ensures videoRef.current is valid before srcObject is assigned. */}
      <div style={{ display: isViewfinderVisible ? 'block' : 'none' }} className="relative">

        {/* White-flash shutter overlay */}
        {flashActive && (
          <div className="absolute inset-0 bg-white rounded-xl z-20 pointer-events-none opacity-80" />
        )}

        <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-indigo-500/30">
          {/* Live feed — always in DOM so ref is valid */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          {/* Scan line */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="scan-line" />
          </div>

          {/* Corner bracket overlays */}
          <div className="absolute inset-0 pointer-events-none p-4">
            <span className="absolute top-4 left-4  w-6 h-6 border-t-2 border-l-2 border-teal-400 rounded-tl" />
            <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-teal-400 rounded-tr" />
            <span className="absolute bottom-4 left-4  w-6 h-6 border-b-2 border-l-2 border-teal-400 rounded-bl" />
            <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-teal-400 rounded-br" />
          </div>

          {/* Bottom label */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 flex items-center gap-2">
            <ZoomIn className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <p className="text-[11px] text-slate-300">{scannerLabel}</p>
          </div>
        </div>

        {/* Hidden canvas used for frame capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={handleCapture}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-lg"
          >
            <Camera className="w-4 h-4" />
            Capture Snapshot
          </button>
          <button
            onClick={handleRetake}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ── CAPTURED: preview ── */}
      {cameraState === 'captured' && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full rounded-xl overflow-hidden border border-teal-500/40">
            {capturedPreviewUrl ? (
              <img
                src={capturedPreviewUrl}
                alt="Captured scan"
                className="w-full object-contain max-h-64"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <CheckCircle2 className="w-10 h-10 text-teal-400" />
                <p className="text-xs font-bold text-white">Snapshot Captured</p>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-1">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-bold text-teal-400">Snapshot Captured Successfully</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {capturedFileName || 'Scan.jpg'} — ready for AI extraction
            </p>
          </div>

          <button
            onClick={handleRetake}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retake Photo
          </button>
        </div>
      )}

      {/* ── DENIED / UNSUPPORTED ── */}
      {(cameraState === 'denied' || cameraState === 'unsupported') && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <VideoOff className="w-7 h-7 text-red-400" />
          </div>

          <div className="text-center max-w-xs">
            <p className="text-sm font-bold text-red-400 mb-1">Camera Unavailable</p>
            <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
          </div>

          {cameraState === 'denied' && (
            <button
              onClick={startCamera}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}

          <p className="text-[11px] text-slate-500">
            Alternatively, switch to{' '}
            <span className="text-indigo-400 font-semibold">PDF / Image Upload</span>{' '}
            to continue without a camera.
          </p>
        </div>
      )}
    </div>
  );
};

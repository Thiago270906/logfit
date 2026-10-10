"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";

import { Button } from "@/components/ui/button";

function posicaoNoCanvas(
  canvas: HTMLCanvasElement,
  event: React.PointerEvent<HTMLCanvasElement>,
) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

export function SignaturePad({
  onChange,
}: {
  onChange: (assinaturaPng: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desenhandoRef = useRef(false);
  const [vazio, setVazio] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.setPointerCapture(event.pointerId);
    desenhandoRef.current = true;
    const { x, y } = posicaoNoCanvas(canvas, event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!desenhandoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = posicaoNoCanvas(canvas, event);
    ctx.lineTo(x, y);
    ctx.stroke();
    setVazio(false);
  }

  function finalizarTraco() {
    if (!desenhandoRef.current) return;
    desenhandoRef.current = false;

    const canvas = canvasRef.current;
    if (canvas && !vazio) {
      onChange(canvas.toDataURL("image/png"));
    }
  }

  function limpar() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setVazio(true);
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg border border-border bg-white">
        {vazio && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Assine aqui com o dedo ou o mouse
          </p>
        )}
        <canvas
          ref={canvasRef}
          className="h-40 w-full touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finalizarTraco}
          onPointerLeave={finalizarTraco}
          onPointerCancel={finalizarTraco}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={limpar}
        disabled={vazio}
      >
        <Eraser />
        Limpar assinatura
      </Button>
    </div>
  );
}

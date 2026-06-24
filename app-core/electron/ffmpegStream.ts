import { spawn, ChildProcess } from 'child_process';

let ffmpegProcess: ChildProcess | null = null;

export function startFfmpegStream(rtmpUrl: string, streamKey: string) {
  if (ffmpegProcess) {
    console.warn('FFmpeg is already running.');
    return;
  }

  const outputUrl = `${rtmpUrl}/${streamKey}`;
  
  // Estos son los argumentos estándar para procesar un stream crudo de RGBA (proveniente de canvas)
  // hacia un flujo H.264/AAC por RTMP
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-r', '60', // 60 FPS
    '-i', '-', // Leer desde stdin
    // Video codec
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-pix_fmt', 'yuv420p',
    // Output
    '-f', 'flv',
    outputUrl
  ];

  console.log('Iniciando FFmpeg con URL:', outputUrl);
  
  ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

  ffmpegProcess.stdout?.on('data', (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  ffmpegProcess.stderr?.on('data', (_data) => {
    // FFmpeg envía mucha información de progreso a stderr
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    ffmpegProcess = null;
  });
}

export function stopFfmpegStream() {
  if (ffmpegProcess) {
    ffmpegProcess.stdin?.end();
    ffmpegProcess.kill('SIGINT');
    ffmpegProcess = null;
    console.log('FFmpeg stream stopped.');
  }
}

export function writeFrameToFfmpeg(imageBuffer: Buffer) {
  if (ffmpegProcess && ffmpegProcess.stdin) {
    ffmpegProcess.stdin.write(imageBuffer);
  }
}

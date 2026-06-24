import { useEffect, useRef, useState, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';

function AvatarModel() {
  const vrmRef = useRef<VRM | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Escuchar el evento personalizado de TTS
  useEffect(() => {
    const handleSpeaking = (e: any) => setIsSpeaking(e.detail);
    window.addEventListener('vrm-speaking', handleSpeaking);
    return () => window.removeEventListener('vrm-speaking', handleSpeaking);
  }, []);

  // Cargar el modelo VRM
  // Reemplaza '/avatar.vrm' por el nombre de tu archivo en la carpeta public/
  const gltf = useLoader(GLTFLoader, '/avatar.vrm', (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });

  useEffect(() => {
    if (gltf && gltf.userData.vrm) {
      vrmRef.current = gltf.userData.vrm;
      // Rotar el modelo para que mire a la cámara
      vrmRef.current!.scene.rotation.y = Math.PI;
    }
  }, [gltf]);

  useFrame((state, delta) => {
    if (vrmRef.current) {
      const vrm = vrmRef.current;

      // 1. Respiración (Idle)
      const t = state.clock.getElapsedTime();
      vrm.scene.position.y = Math.sin(t * 2) * 0.02 - 1.2; // -1.2 para ajustar la altura de la cámara

      // 2. Parpadeo aleatorio
      const blinkWeight = Math.sin(t * 5) > 0.95 ? 1 : 0;
      vrm.expressionManager?.setValue('blink', blinkWeight);

      // 3. Lip Sync Simple (Hablar)
      if (isSpeaking) {
        // Oscilar la boca mientras habla
        const mouthOpen = (Math.sin(t * 20) + 1) / 2; // Rango 0 a 1
        vrm.expressionManager?.setValue('aa', mouthOpen);
      } else {
        vrm.expressionManager?.setValue('aa', 0);
      }

      // Actualizar el VRM
      vrm.update(delta);
    }
  });

  if (!gltf) return null;

  return <primitive object={gltf.scene} />;
}


class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-xs p-4 text-center">
          Error al cargar avatar.vrm.<br />
          Coloca el archivo en public/
        </div>
      );
    }
    return this.props.children;
  }
}

export default function VTuberLayer() {
  return (
    <div className="w-full h-full relative">
      <ErrorBoundary>
        <Canvas camera={{ position: [0, 0, 1.5], fov: 30 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[1, 2, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <AvatarModel />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

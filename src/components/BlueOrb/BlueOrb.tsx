import React, { useRef, useMemo, memo } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import Cou from "../../static/sprites/Cou.png";
import CouActive from "../../static/sprites/Cou_active.png";
import Dc from "../../static/sprites/Dc.png";
import DcActive from "../../static/sprites/Dc_active.png";
import SSkn from "../../static/sprites/SSkn.png";
import SSKnActive from "../../static/sprites/SSkn_active.png";
import Tda from "../../static/sprites/Tda.png";
import TdaActive from "../../static/sprites/Tda_active.png";
import Dia from "../../static/sprites/Dia.png";
import DiaActive from "../../static/sprites/Dia_active.png";
import Lda from "../../static/sprites/Lda.png";
import LdaActive from "../../static/sprites/Lda_active.png";
import MULTI from "../../static/sprites/MULTI.png";
import MULTIActive from "../../static/sprites/MULTI_active.png";
import level_y_values from "../../resources/level_y_values.json";

type BlueOrbContructorProps = {
  sprite: string;
  position: [number, number, number];
  rotation: [number, number, number, (string | undefined)?];
  active: boolean;
  level: string;
};

type LevelYValues = {
  [level: string]: number;
};

type SpriteToPath = {
  [key: string]: [string, string];
};

const BlueOrb = memo((props: BlueOrbContructorProps) => {
  // the game only has a couple of sprites that it displays in the hub
  // dynamically importnig them would be worse for performance,
  // so we import all of them here and then use this function to
  // associate a sprite with the path
  const spriteToPath = (sprite: string) => {
    console.log(sprite);
    if (sprite.startsWith("S")) {
      return [SSkn, SSKnActive];
    } else if (sprite.startsWith("P") || sprite.startsWith("G")) {
      return [MULTI, MULTIActive];
    } else if (sprite.includes("?")) {
      return [MULTI, MULTIActive];
    } else if (sprite.includes("Dc")) {
      return [Dc, DcActive];
    } else {
      return ({
        Tda: [Tda, TdaActive],
        Cou: [Cou, CouActive],
        Dia: [Dia, DiaActive],
        Lda: [Lda, LdaActive],
        Ere: [MULTI, MULTIActive],
        Ekm: [MULTI, MULTIActive],
        Eda: [MULTI, MULTIActive],
        TaK: [MULTI, MULTIActive],
        Env: [MULTI, MULTIActive],
      } as SpriteToPath)[sprite.substr(0, 3)];
    }
  };

  const materialRef = useRef<THREE.ShaderMaterial>();

  const spriteSheet = spriteToPath(props.sprite);

  const nonActiveTexture = useLoader(THREE.TextureLoader, spriteSheet[0]);
  const activeTexture = useLoader(THREE.TextureLoader, spriteSheet[1]);

  const uniforms = useMemo(
    () => ({
      tex1: { type: "t", value: nonActiveTexture },
      tex2: { type: "t", value: activeTexture },
      timeMSeconds: { value: (Date.now() % (Math.PI * 2000)) / 1000.0 },
    }),
    [nonActiveTexture, activeTexture]
  );

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;

    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform float timeMSeconds;

    varying vec2 vUv;

    #define M_PI 3.1415926535897932384626433832795

    void main() {
        vec4 t1 = texture2D(tex1,vUv);
        vec4 t2 = texture2D(tex2,vUv);
        float bias = abs(sin(timeMSeconds / (1.6 / M_PI)));
        gl_FragColor = mix(t1, t2, bias);
    }
  `;

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.timeMSeconds.value =
        (Date.now() % (Math.PI * 2000)) / 1000.0;
    }
  });

  return (
    <group position={[0, (level_y_values as LevelYValues)[props.level], 0]}>
      <mesh
        position={props.position}
        scale={[0.25, 0.15, 0.25]}
        rotation={props.rotation}
        renderOrder={1}
      >
        <planeBufferGeometry attach="geometry" />
        {props.active ? (
          <shaderMaterial
            ref={materialRef}
            attach="material"
            uniforms={uniforms}
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            side={THREE.DoubleSide}
            transparent={true}
          />
        ) : (
          <meshBasicMaterial
            attach="material"
            map={nonActiveTexture}
            side={THREE.DoubleSide}
            transparent={true}
          />
        )}
      </mesh>
    </group>
  );
});

export default BlueOrb;
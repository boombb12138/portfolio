import { Cache, TextureLoader } from 'three';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';

// Enable caching for all loaders
Cache.enabled = true;

const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * GLTF model loader configured with draco decoder
 */
export const modelLoader = gltfLoader;
export const textureLoader = new TextureLoader();

/**
 * Clean up a scene's materials and geometry
 */
export const cleanScene = scene => {
  scene?.traverse(object => {
    if (!object.isMesh) return;

    object.geometry.dispose(); //dispose用于释放对象所占内存，清除每个Mesh对象中的几何体

    if (object.material.isMaterial) {
      cleanMaterial(object.material);
    } else {
      for (const material of object.material) {
        cleanMaterial(material);
      }
    }
  });
};

/**
 * Clean up and dispose of a material
 */
export const cleanMaterial = material => {
  material.dispose();

  for (const key of Object.keys(material)) {
    const value = material[key];
    // 检查当前属性值 value 是否存在、是否为对象类型，并且是否具有 minFilter 属性。
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose(); //释放当前属性值 value 对象占用的内存和资源。

      // Close GLTF bitmap textures
      value.source?.data?.close?.();
    }
  }
};

/**
 * Clean up and dispose of a renderer
 */
export const cleanRenderer = renderer => {
  renderer.dispose();
  renderer = null;
};

/**
 * Clean up lights by removing them from their parent
 */
export const removeLights = lights => {
  for (const light of lights) {
    light.parent.remove(light); //将光源light从其父级移除
  }
};

/**
 * Get child by name
 */
export const getChild = (name, object) => {
  let node;

  object.traverse(child => {
    if (child.name === name) {
      node = child;
    }
  });

  return node;
};

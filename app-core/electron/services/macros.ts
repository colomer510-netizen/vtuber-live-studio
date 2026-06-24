import ks from 'node-key-sender';

export function setupMacros() {
  console.log('Macro Service: Node Key Sender initialized.');
}

// Envía una tecla presionada (ej. para controlar OBS o cambiar de escena)
export async function sendKeystroke(key: string) {
  try {
    await ks.sendKey(key);
    console.log(`Macro ejecutada: Se presionó la tecla [${key}]`);
  } catch (error) {
    console.error(`Error ejecutando macro [${key}]:`, error);
  }
}

// Ejecuta combinaciones (ej. ctrl + shift + m para mutear)
export async function sendCombination(keys: string[]) {
  try {
    await ks.sendCombination(keys);
    console.log(`Macro ejecutada: Combinación [${keys.join(' + ')}]`);
  } catch (error) {
    console.error(`Error ejecutando macro [${keys.join(' + ')}]:`, error);
  }
}

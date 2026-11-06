/** Registry so UI code can grab the simulated glasses POV frame rendered by the 3D scene. */
type CaptureFn = (maxSize: number) => Promise<Blob | null>;
let fn: CaptureFn | null = null;
export const registerSceneCapture = (f: CaptureFn | null) => {
  fn = f;
};
export const captureSceneFrame = (maxSize = 768) => (fn ? fn(maxSize) : Promise.resolve(null));

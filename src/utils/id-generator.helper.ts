/**
 * Generate a unique Id
 */
export function generateUniqueId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

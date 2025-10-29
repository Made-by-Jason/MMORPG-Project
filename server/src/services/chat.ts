export function sanitizeMessage(msg: string) {
  // very simple sanitizer
  return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

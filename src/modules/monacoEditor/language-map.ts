const extToLanguageMap: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  json: 'json',
  md: 'markdown',
  markdown: 'markdown',
  html: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'cpp',
  h: 'cpp',
  hpp: 'cpp',
  sh: 'shell',
  sql: 'sql',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml'
};

export function getMonacoLanguageByExt(ext: string): string {
  return extToLanguageMap[ext.toLowerCase()] || 'plaintext';
}

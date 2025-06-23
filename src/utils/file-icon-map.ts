import { SUPPORTED_FILE_TYPES } from '@/constants/file-type';

// 基础图标映射
const iconMap: Record<string, string> = {
  // 文件夹
  folder: 'vscode-icons:default-folder',
  'folder-open': 'vscode-icons:default-folder-opened',

  // 按类别映射
  IMAGE: 'vscode-icons:file-type-image',
  DOCUMENT: 'vscode-icons:file-type-document',
  ARCHIVE: 'vscode-icons:file-type-archive',
  AUDIO: 'vscode-icons:file-type-audio',
  VIDEO: 'vscode-icons:file-type-video',

  // 按具体扩展名映射 (优先级更高)
  vue: 'vscode-icons:file-type-vue',
  ts: 'vscode-icons:file-type-typescript-official',
  js: 'vscode-icons:file-type-js-official',
  json: 'vscode-icons:file-type-json',
  md: 'vscode-icons:file-type-markdown',
  pdf: 'vscode-icons:file-type-pdf2',
  html: 'vscode-icons:file-type-html',
  css: 'vscode-icons:file-type-css',
  scss: 'vscode-icons:file-type-scss',
  tailwind: 'vscode-icons:file-type-tailwind',
  vite: 'vscode-icons:file-type-vite',
  npm: 'vscode-icons:file-type-npm',
  yarn: 'vscode-icons:file-type-yarn',
  git: 'vscode-icons:file-type-git',
  github: 'vscode-icons:file-type-github',
  vscode: 'vscode-icons:file-type-vscode',
  docker: 'vscode-icons:file-type-docker',
  python: 'vscode-icons:file-type-python',
  java: 'vscode-icons:file-type-java',
  cpp: 'vscode-icons:file-type-cpp',
  c: 'vscode-icons:file-type-c',
  cs: 'vscode-icons:file-type-csharp',
  go: 'vscode-icons:file-type-go',
  rust: 'vscode-icons:file-type-rust',
  sql: 'vscode-icons:file-type-sql',
  xls: 'vscode-icons:file-type-excel',
  xlsx: 'vscode-icons:file-type-excel',
  doc: 'vscode-icons:file-type-word',
  docx: 'vscode-icons:file-type-word',
  ppt: 'vscode-icons:file-type-powerpoint',
  pptx: 'vscode-icons:file-type-powerpoint',
  zip: 'vscode-icons:file-type-zip',
  rar: 'vscode-icons:file-type-rar',
  '7z': 'vscode-icons:file-type-7z',
  txt: 'vscode-icons:file-type-text',

  // 默认文件图标
  default: 'vscode-icons:default-file'
};

// 反向映射，用于快速查找类别
const categoryMap: Record<string, string> = {};
Object.keys(SUPPORTED_FILE_TYPES).forEach(category => {
  const extensions = SUPPORTED_FILE_TYPES[category as keyof typeof SUPPORTED_FILE_TYPES];
  extensions.forEach(ext => {
    categoryMap[ext] = category;
  });
});

/**
 * 根据文件类型或扩展名获取Iconify图标名称
 * @param type - 'folder' | 'folderOpen' | 文件扩展名
 * @returns Iconify图标名称字符串
 */
export function getIconNameByFile(type: string): string {
  const lowerType = type.toLowerCase();

  // 1. 直接匹配 (如 folder, vue, pdf)
  if (iconMap[lowerType]) {
    return iconMap[lowerType];
  }

  // 2. 按类别匹配
  const category = categoryMap[lowerType];
  if (category && iconMap[category]) {
    return iconMap[category];
  }

  // 3. 返回默认图标
  return iconMap.default;
}

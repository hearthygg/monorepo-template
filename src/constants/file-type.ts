// 所有支持的文件类型
export const SUPPORTED_FILE_TYPES = {
  // 图片文件
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'],
  // 文档文件
  DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'],
  // 代码文件
  CODE: [
    'js',
    'ts',
    'jsx',
    'tsx',
    'vue',
    'py',
    'java',
    'cpp',
    'c',
    'cs',
    'php',
    'rb',
    'go',
    'rs',
    'swift',
    'kt',
    'scala',
    'html',
    'css',
    'scss',
    'less',
    'xml',
    'json',
    'yaml',
    'yml',
    'toml',
    'ini',
    'cfg',
    'conf',
    'sh',
    'bat',
    'ps1',
    'sql',
    'r',
    'm',
    'pl',
    'lua',
    'dart',
    'elm',
    'clj',
    'hs',
    'ml'
  ],
  // Markdown 文件
  MARKDOWN: ['md', 'markdown', 'mkd', 'mdx'],
  // 纯文本文件
  TEXT: ['txt', 'log', 'csv', 'tsv'],
  // 配置文件
  CONFIG: ['env', 'gitignore', 'dockerfile', 'makefile', 'cmake', 'gradle', 'pom.xml'],
  // 压缩文件
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
  // 音频文件
  AUDIO: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'],
  // 视频文件
  VIDEO: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']
};

// 可编辑的文件类型（支持在线编辑）
export const EDITABLE_FILE_TYPES = {
  // 代码文件
  CODE: [
    'js',
    'ts',
    'jsx',
    'tsx',
    'vue',
    'py',
    'java',
    'cpp',
    'c',
    'cs',
    'php',
    'rb',
    'go',
    'rs',
    'swift',
    'kt',
    'scala',
    'html',
    'css',
    'scss',
    'less',
    'xml',
    'json',
    'yaml',
    'yml',
    'toml',
    'ini',
    'cfg',
    'conf',
    'sh',
    'bat',
    'ps1',
    'sql',
    'r',
    'm',
    'pl',
    'lua',
    'dart',
    'elm',
    'clj',
    'hs',
    'ml'
  ],
  // Markdown 文件
  MARKDOWN: ['md', 'markdown', 'mkd', 'mdx'],
  // 纯文本文件
  TEXT: ['txt', 'log', 'csv', 'tsv'],
  // 配置文件
  CONFIG: ['env', 'gitignore', 'dockerfile', 'makefile', 'cmake', 'gradle', 'pom.xml'],
  // 文档文件
  DOCUMENT: ['rst', 'asciidoc', 'adoc']
};

// MIME 类型映射
export const MIME_TYPE_MAP = {
  // 图片
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',

  // 文档
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/plain': 'txt',
  'application/rtf': 'rtf',

  // 代码文件
  'application/javascript': 'js',
  'application/typescript': 'ts',
  'text/javascript': 'js',
  'text/typescript': 'ts',
  'text/xml': 'xml',
  'application/json': 'json',
  'text/yaml': 'yaml',
  'text/x-yaml': 'yaml',
  'application/x-yaml': 'yaml',
  'text/toml': 'toml',
  'application/x-toml': 'toml',
  'text/x-ini': 'ini',
  'text/x-config': 'cfg',
  'text/x-shellscript': 'sh',
  'application/x-sh': 'sh',
  'text/x-sql': 'sql',
  'application/sql': 'sql',

  // Markdown
  'text/markdown': 'md',
  'text/x-markdown': 'md',

  // 其他文本
  'text/csv': 'csv',
  'text/tab-separated-values': 'tsv',
  'text/html': 'html',
  'text/css': 'css',
  'text/x-scss': 'scss',
  'text/x-less': 'less',

  // 压缩文件
  'application/zip': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/x-7z-compressed': '7z',
  'application/x-tar': 'tar',
  'application/gzip': 'gz',
  'application/x-bzip2': 'bz2',

  // 音频
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/flac': 'flac',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/x-ms-wma': 'wma',

  // 视频
  'video/mp4': 'mp4',
  'video/x-msvideo': 'avi',
  'video/quicktime': 'mov',
  'video/x-ms-wmv': 'wmv',
  'video/x-flv': 'flv',
  'video/x-matroska': 'mkv',
  'video/webm': 'webm'
};

// 文件类型管理类
export class FileTypeManager {
  // 获取所有支持的文件扩展名
  static getAllSupportedExtensions(): string[] {
    return Object.values(SUPPORTED_FILE_TYPES).flat();
  }

  // 获取所有可编辑的文件扩展名
  static getEditableExtensions(): string[] {
    return Object.values(EDITABLE_FILE_TYPES).flat();
  }

  // 检查文件扩展名是否支持
  static isSupportedExtension(extension: string): boolean {
    const ext = extension.toLowerCase().replace('.', '');
    return this.getAllSupportedExtensions().includes(ext);
  }

  // 检查文件扩展名是否可编辑
  static isEditableExtension(extension: string): boolean {
    const ext = extension.toLowerCase().replace('.', '');
    return this.getEditableExtensions().includes(ext);
  }

  // 检查文件名是否可编辑（从文件名提取扩展名）
  static isEditableFile(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext ? this.isEditableExtension(ext) : false;
  }

  // 检查 MIME 类型是否支持
  static isSupportedMimeType(mimeType: string): boolean {
    return mimeType in MIME_TYPE_MAP;
  }

  // 检查 MIME 类型是否允许（别名方法，保持向后兼容）
  static isAllowedMimeType(mimeType: string): boolean {
    return this.isSupportedMimeType(mimeType);
  }

  // 从 MIME 类型获取文件扩展名
  static getExtensionFromMimeType(mimeType: string): string | null {
    return MIME_TYPE_MAP[mimeType as keyof typeof MIME_TYPE_MAP] || null;
  }

  // 从文件扩展名获取 MIME 类型（反向查找）
  static getMimeTypeFromExtension(extension: string): string | null {
    const ext = extension.toLowerCase().replace('.', '');
    for (const [mimeType, extName] of Object.entries(MIME_TYPE_MAP)) {
      if (extName === ext) {
        return mimeType;
      }
    }
    return null;
  }

  // 获取文件类型分类
  static getFileTypeCategory(extension: string): string | null {
    const ext = extension.toLowerCase().replace('.', '');
    for (const [category, extensions] of Object.entries(SUPPORTED_FILE_TYPES)) {
      if (extensions.includes(ext)) {
        return category;
      }
    }
    return null;
  }

  // 获取支持的文件类型信息
  static getSupportedFileTypesInfo() {
    return {
      total: this.getAllSupportedExtensions().length,
      editable: this.getEditableExtensions().length,
      categories: Object.keys(SUPPORTED_FILE_TYPES),
      extensions: this.getAllSupportedExtensions(),
      editableExtensions: this.getEditableExtensions()
    };
  }
}

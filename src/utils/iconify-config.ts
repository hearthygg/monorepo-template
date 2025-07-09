// 图标别名类型定义
type IconAlias = keyof typeof iconifyConfig.aliases;

// 图标集合配置
export const iconifyConfig = {
  // 本地图标集合
  localCollections: ['mdi', 'vscode-icons', 'lucide'],

  // 图标别名映射
  aliases: {
    search: 'mdi:magnify',
    folder: 'vscode-icons:default-folder',
    file: 'vscode-icons:default-file',
    close: 'lucide:x',
    download: 'lucide:download',
    share: 'lucide:share-2',
    edit: 'lucide:edit-3',
    delete: 'lucide:trash-2',
    star: 'lucide:star',
    home: 'mdi:home-outline',
    team: 'mdi:account-group-outline',
    files: 'mdi:folder-outline',
    favorites: 'mdi:star-outline',
    recycle: 'mdi:delete-outline'
  } as const
};

// 初始化图标配置
export function initIconify() {
  // 可以在这里添加全局图标配置
  // console.log('Iconify initialized with local collections:', iconifyConfig.localCollections);
}

// 获取图标名称（支持别名）
export function getIconName(iconName: string): string {
  return (iconifyConfig.aliases as Record<string, string>)[iconName] || iconName;
}

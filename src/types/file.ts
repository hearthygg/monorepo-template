type BreadcrumbType = 'home' | 'folder';
export interface BreadcrumbItem {
  id: number;
  name: string;
  type: BreadcrumbType;
}

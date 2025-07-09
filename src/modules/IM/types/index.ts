// IM模块类型定义

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

export interface ChatSession {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface IMConfig {
  currentUserId: string;
  enableNotifications: boolean;
  autoScroll: boolean;
  messageSound: boolean;
  theme: 'light' | 'dark';
}

export interface MessageEvent {
  type: 'message' | 'typing' | 'read' | 'online';
  data: any;
  timestamp: Date;
}

export interface Emoji {
  id: string;
  symbol: string;
  name: string;
  category: string;
}

export interface FileMessage {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
}

export interface VoiceMessage {
  id: string;
  duration: number;
  url: string;
  waveform?: number[];
}

// 事件类型
export type MessageSentEvent = (message: Message) => void;
export type UserSelectedEvent = (user: User) => void;
export type MessageReceivedEvent = (message: Message) => void;

// 组件Props类型
export interface IMChatProps {
  users?: User[];
  messages?: Message[];
  currentUserId?: string;
  config?: Partial<IMConfig>;
}

export interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isMine: boolean;
  showAvatar?: boolean;
  avatar?: string;
}

export interface UserListProps {
  users: User[];
  currentUserId: string;
  selectedUserId?: string;
  onUserSelect: (user: User) => void;
}

export interface MessageInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

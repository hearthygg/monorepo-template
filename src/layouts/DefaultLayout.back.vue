<template>
  <div class="min-h-screen flex bg-background">
    <!-- Sidebar -->
    <div :class="['fixed inset-y-0 z-20 flex flex-col bg-background transition-all duration-300 ease-in-out lg:static', isCollapsed ? 'w-[72px]' : 'w-72', isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <div class="border-b border-border">
        <div :class="['flex h-16 items-center gap-2 px-4', isCollapsed && 'justify-center px-2']">
          <router-link v-if="!isCollapsed" to="/" class="flex items-center font-semibold">
            <span class="text-lg">Flowers&Saints</span>
          </router-link>
          <button :class="['ml-auto h-8 w-8', isCollapsed && 'ml-0']" class="rounded-md p-2 hover:bg-secondary" @click="toggleSidebar">
            <ChevronLeft :class="['h-4 w-4 transition-transform', isCollapsed && 'rotate-180']" />
            <span class="sr-only">{{ isCollapsed ? 'Expand' : 'Collapse' }} Sidebar</span>
          </button>
        </div>
      </div>
      <div class="flex-1 overflow-auto">
        <nav class="flex-1 space-y-1 px-2 py-4">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
              $route.path === item.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
              isCollapsed && 'justify-center px-2'
            ]"
          >
            <component :is="item.icon" :class="['h-4 w-4', !isCollapsed && 'mr-3']" />
            <span v-if="!isCollapsed">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>
      <div class="border-t border-border p-2">
        <nav class="space-y-1">
          <router-link
            v-for="item in bottomNavigation"
            :key="item.name"
            :to="item.href"
            :class="[
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
              $route.path === item.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
              isCollapsed && 'justify-center px-2'
            ]"
          >
            <component :is="item.icon" :class="['h-4 w-4', !isCollapsed && 'mr-3']" />
            <span v-if="!isCollapsed">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Mobile menu button -->
    <button class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md shadow-md" aria-label="Toggle sidebar" @click="toggleMobileMenu">
      <Menu class="h-6 w-6" />
    </button>

    <!-- Main content -->
    <div class="flex-1">
      <!-- Top navigation -->
      <header class="sticky top-0 z-40 border-b bg-background">
        <div class="container flex h-16 items-center justify-between px-4 md:px-6">
          <div class="hidden md:block">
            <nav class="flex items-center space-x-2">
              <router-link to="/" class="text-sm font-medium">Home</router-link>
              <template v-for="(segment, index) in pathSegments" :key="segment">
                <span class="text-muted-foreground">/</span>
                <router-link :to="`/${pathSegments.slice(0, index + 1).join('/')}`" class="text-sm font-medium">
                  {{ segment.charAt(0).toUpperCase() + segment.slice(1) }}
                </router-link>
              </template>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <!-- Notifications button -->
            <button class="relative p-2 rounded-md hover:bg-secondary" aria-label="Notifications" @click="toggleNotifications">
              <Bell class="h-5 w-5" />
              <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Theme toggle -->
            <button class="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" @click="toggleTheme">
              <Sun v-if="isDark" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
            </button>

            <!-- User dropdown -->
            <div class="relative">
              <button class="relative h-8 w-8 rounded-full" @click="toggleUserMenu">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span v-if="!userAvatar" class="text-sm font-medium">
                    {{ userInitials }}
                  </span>
                  <img v-else :src="userAvatar" :alt="userName" class="h-8 w-8 rounded-full object-cover" />
                </div>
              </button>
              <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border border-border">
                <div class="py-1 px-4 border-b border-border">
                  <p class="text-sm font-medium leading-none">{{ userName }}</p>
                  <p class="text-xs leading-none text-muted-foreground">{{ userEmail }}</p>
                </div>
                <div class="py-1">
                  <router-link to="/profile" class="block px-4 py-2 text-sm hover:bg-secondary" @click="isUserMenuOpen = false"> Profile </router-link>
                  <router-link to="/settings" class="block px-4 py-2 text-sm hover:bg-secondary" @click="isUserMenuOpen = false"> Settings </router-link>
                  <button class="block w-full text-left px-4 py-2 text-sm hover:bg-secondary" @click="logout">Log out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <div class="container mx-auto p-6 max-w-7xl">
        <main class="w-full">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Home, BarChart2, Building2, Folder, Wallet, Receipt, CreditCard, Users2, Shield, MessagesSquare, Video, Settings, HelpCircle, Menu, ChevronLeft, Bell, Sun, Moon } from 'lucide-vue-next';

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Organization', href: '/organization', icon: Building2 },
  { name: 'Projects', href: '/projects', icon: Folder },
  { name: 'Transactions', href: '/transactions', icon: Wallet },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Members', href: '/members', icon: Users2 },
  { name: 'Permissions', href: '/permissions', icon: Shield },
  { name: 'Chat', href: '/chat', icon: MessagesSquare },
  { name: 'Meetings', href: '/meetings', icon: Video }
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle }
];

// State
const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const isUserMenuOpen = ref(false);
const isNotificationsOpen = ref(false);
const isDark = ref(false);

// User data (would typically come from a store or API)
const userName = ref('Dollar Singh');
const userEmail = ref('dollar.singh@example.com');
const userAvatar = ref('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/38184074.jpg-M4vCjTSSWVw5RwWvvmrxXBcNVU8MBU.jpeg');

// Computed properties
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(n => n[0])
    .join('');
});

// Get current route for active navigation highlighting
const route = useRoute();
const pathSegments = computed(() => {
  return route.path.split('/').filter(Boolean);
});

// Methods
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) {
    isNotificationsOpen.value = false;
  }
};

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
  if (isNotificationsOpen.value) {
    isUserMenuOpen.value = false;
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const logout = () => {
  // Implement logout functionality
  console.log('Logging out...');
  isUserMenuOpen.value = false;
};

// Handle click outside to close menus
const handleClickOutside = event => {
  const userMenuButton = document.querySelector('.user-menu-button');
  const userMenu = document.querySelector('.user-menu');

  if (isUserMenuOpen.value && userMenuButton && userMenu && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Check system preference for dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }

  // Add event listener for clicks outside menus
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
/* Base styles for dark mode */
.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;

  --muted: 223 47% 11%;
  --muted-foreground: 215.4 16.3% 56.9%;

  --popover: 224 71% 4%;
  --popover-foreground: 215 20.2% 65.1%;

  --card: 224 71% 4%;
  --card-foreground: 213 31% 91%;

  --border: 216 34% 17%;
  --input: 216 34% 17%;

  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 1.2%;

  --secondary: 222.2 47.4% 11.2%;
  --secondary-foreground: 210 40% 98%;

  --accent: 216 34% 17%;
  --accent-foreground: 210 40% 98%;

  --destructive: 0 63% 31%;
  --destructive-foreground: 210 40% 98%;

  --ring: 216 34% 17%;

  --radius: 0.5rem;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

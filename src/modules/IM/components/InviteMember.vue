<template>
  <el-dialog class="custom-dialog" :model-value="visible" title="添加成员" width="550px" append-to-body @close="handleClose">
    <div>
      <el-input v-model="search" placeholder="搜索成员" clearable class="mb-2" />
      <div v-if="selectedMembers.length" class="flex flex-wrap gap-x-3 gap-y-2 mb-2">
        <div v-for="member in selectedMembers" :key="member.id" class="flex items-center bg-[#f4f6fa] rounded-full px-3 py-1 text-[14px] text-gray-800 mb-1">
          <span class="w-6 h-6 flex items-center justify-center rounded-full bg-[#e0e7ef] text-blue-500 font-semibold mr-2 text-xs">
            {{ member.nickname?.[0] }}
          </span>
          <span class="mr-1">{{ member.nickname }}</span>
          <button class="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#e0e7ef] text-gray-400 hover:text-blue-500 transition" @click="removeMember(member.id)">×</button>
        </div>
      </div>
      <div class="member-list-title">团队成员</div>
      <el-scrollbar height="220px">
        <el-checkbox-group v-model="selectedIds" size="large">
          <el-checkbox v-for="member in filteredMembers" :key="member.id" :label="member.id" :disabled="isMax && !selectedIds.includes(member.id)" class="member-checkbox space-x-2">
            <Avatar :is-online="member.onlineStatus === OnlineStatusEnum.ONLINE" :name="member.nickname" size="sm" />
            <span class="ml-2">{{ member.nickname }}</span>
            <span v-if="member.onlineStatus === OnlineStatusEnum.ONLINE" class="online-dot"></span>
          </el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
      <!-- <div class="flex items-center mt-3">
        <el-switch v-model="withHistory" class="mr-2" />
        <span>附带聊天记录</span>
        <span class="ml-auto text-gray-400 text-xs">最近30条 →</span>
      </div> -->
    </div>
    <template #footer>
      <el-button @click="handleClose"><X class="mr-1 w-4 h-4" />取消</el-button>
      <el-button type="primary" :disabled="!selectedIds.length" @click="handleConfirm"><Check class="mr-1 w-4 h-4" />确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Avatar from '@/components/common/Avatar.vue';
import { X, Check } from 'lucide-vue-next';
import type { TeamMemberOnlineStatus } from '@/types/team';
import { OnlineStatusEnum } from '@/constants/enum';

const props = defineProps<{
  visible: boolean;
  members: TeamMemberOnlineStatus[];
  max?: number;
}>();

const emit = defineEmits(['update:visible', 'confirm']);

const search = ref('');
const selectedIds = ref<(number | string)[]>([]);
const withHistory = ref(false);

const filteredMembers = computed(() => props.members.filter(m => m.nickname.includes(search.value)));

const selectedMembers = computed(() => props.members.filter(m => selectedIds.value.includes(m.id)));

const isMax = computed(() => (props.max ? selectedIds.value.length >= props.max : false));

function removeMember(id: number | string) {
  selectedIds.value = selectedIds.value.filter(mid => mid !== id);
}

function handleClose() {
  emit('update:visible', false);
}

function handleConfirm() {
  emit(
    'confirm',
    selectedMembers.value.map(m => m.id)
  );
  emit('update:visible', false);
}

watch(
  () => props.visible,
  v => {
    if (!v) {
      selectedIds.value = [];
      withHistory.value = false;
      search.value = '';
    }
  }
);
</script>

<style scoped>
.selected-tags {
  margin-bottom: 8px;
}
.member-list-title {
  font-size: 16px;
  color: #333;
  margin: 8px 0 4px 0;
}
.member-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.online-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  margin-left: 6px;
}
</style>

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCompleteTask, useCurrentTasks } from '../hooks/useTaskQueries';
import { TaskDetail } from '../types/task';

interface TaskDetailModalProps {
  visible: boolean;
  onClose: () => void;
  task: TaskDetail;
  onAddGoal: () => void;
}

export default function TaskDetailModal({
  visible,
  onClose,
  task,
  onAddGoal,
}: TaskDetailModalProps) {
  const [expanded, setExpanded] = useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;

  // Fetch current tasks using the hook
  const { data: currentTaskList, isLoading } = useCurrentTasks(
    Number(task?.id),
    visible
  );
  const tasks = currentTaskList?.tasks || [];

  // Complete task mutation
  const completeTaskMutation = useCompleteTask();

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setExpanded(false);
    }
  }, [visible, opacity]);

  if (!visible) return null;

  const completedTasks = tasks.filter((t) => t.status === 1).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Animated.View
      className='absolute inset-0'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        opacity,
      }}
    >
      <View className='flex-1 items-center justify-center'>
        {/* Loading Overlay */}
        {completeTaskMutation.isPending && (
          <View className='absolute inset-0 bg-black/50 items-center justify-center z-50'>
            <View className='bg-white/10 rounded-2xl p-6'>
              <ActivityIndicator size='large' color='#fff' />
              <Text className='text-white mt-3 text-sm'>正在完成任务...</Text>
            </View>
          </View>
        )}

        <Pressable
          className='w-80 bg-[#333333] rounded-2xl'
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <View className='items-center'>
            {/* Image Container - positioned to overlap */}
            <View className='w-32 h-32 absolute -top-16 z-10'>
              <View className='w-full h-full bg-gray-800 rounded-2xl'>
                <Image
                  source={task.icon}
                  className='w-full h-full rounded-2xl'
                  resizeMode='cover'
                />
              </View>
            </View>

            {/* Content below image */}
            <View className='w-full pt-20 pb-4 items-center'>
              <View className='flex-row items-center px-4'>
                <Text className='text-xl font-bold text-white mr-2 text-center'>
                  {task.title}
                </Text>
              </View>
              <Text className='text-sm text-gray-400 mt-1'>我乃天命人也</Text>
            </View>
          </View>

          {!task.completed ? (
            <View className='px-6 pb-8'>
              {/* Progress Bar */}
              <View className='h-1.5 bg-[#444444] rounded-full overflow-hidden'>
                <View
                  className='h-full bg-white rounded-full'
                  style={{ width: `${progress}%` }}
                />
              </View>
              <View className='flex-row justify-end mt-1'>
                <Text className='text-xs text-gray-400'>{`${completedTasks}/${totalTasks}`}</Text>
              </View>

              {/* Task List */}
              <View style={{ height: 120 }} className='mt-3'>
                {isLoading ? (
                  <View className='flex-1 items-center justify-center'>
                    <Text className='text-gray-400'>加载中...</Text>
                  </View>
                ) : (
                  <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.task_id.toString()}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    renderItem={({ item: subtask }) => (
                      <Pressable
                        className='flex-row items-center py-2.5'
                        onPress={async () => {
                          // 只有未完成的任务可以被标记为完成
                          if (subtask.status !== 1) {
                            try {
                              await completeTaskMutation.mutateAsync(
                                subtask.task_id
                              );
                            } catch (error) {
                              console.error('Error completing task:', error);
                            }
                          }
                        }}
                        disabled={subtask.status === 1} // 已完成的任务不能点击
                      >
                        <View className='w-6 h-6 items-center justify-center'>
                          <MaterialCommunityIcons
                            name={
                              subtask.status === 1
                                ? 'check-circle'
                                : 'checkbox-blank-circle-outline'
                            }
                            size={20}
                            color={subtask.status === 1 ? '#4CAF50' : '#666'}
                          />
                        </View>
                        <Text
                          className={`ml-3 text-sm ${
                            subtask.status === 1
                              ? 'text-gray-400'
                              : 'text-white'
                          }`}
                        >
                          {subtask.content}
                        </Text>
                      </Pressable>
                    )}
                  />
                )}
              </View>

              {/* Add Goal Button */}
              <TouchableOpacity
                className='mt-4 h-11 bg-white/10 rounded-lg items-center justify-center flex-row'
                onPress={onAddGoal}
              >
                <MaterialCommunityIcons name='plus' size={20} color='white' />
                <Text className='text-white text-sm ml-1'>添加目标</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className='px-6 pb-8'>
              <TouchableOpacity
                className='w-full px-4 py-3 flex-row items-center justify-between bg-[#222222] border-t border-b border-[#444444] relative'
                onPress={() => setExpanded(!expanded)}
              >
                <View className='absolute inset-0 items-center justify-center'>
                  <Text className='text-white text-sm'>
                    完成 {completedTasks} 个目标
                  </Text>
                </View>
                <View className='w-6' />
                <MaterialCommunityIcons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color='#666'
                />
              </TouchableOpacity>

              {expanded && (
                <View style={{ height: 120 }} className='mt-3'>
                  <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.task_id.toString()}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    renderItem={({ item: subtask }) => (
                      <Pressable className='flex-row items-center py-2.5'>
                        <View className='w-6 h-6 items-center justify-center'>
                          <MaterialCommunityIcons
                            name='check-circle'
                            size={20}
                            color='#4CAF50'
                          />
                        </View>
                        <Text className='ml-3 text-sm text-white'>
                          {subtask.content}
                        </Text>
                      </Pressable>
                    )}
                  />
                </View>
              )}
            </View>
          )}

          {/* Close Button */}
          <View className='items-center absolute -bottom-5 left-1/2 -ml-5'>
            <TouchableOpacity
              className='w-10 h-10 rounded-full bg-[#444444] items-center justify-center'
              onPress={onClose}
            >
              <MaterialCommunityIcons name='close' size={20} color='#999' />
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

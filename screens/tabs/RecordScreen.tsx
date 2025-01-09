import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

export default function RecordScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 刷新所有查询
      await queryClient.refetchQueries({
        queryKey: ['todos'],
      });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <ScrollView
      className='flex-1 flex-col' // 移除 bg-white，我们会在 style 中设置
      style={{
        backgroundColor: '#ccc', // ScrollView 的背景色
        flex: 1,
      }}
      contentContainerStyle={{
        backgroundColor: '#ccc', // 内容区域的背景色
        minHeight: '100%',
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          // iOS 专用属性
          tintColor='#9370DB'
          title='正在刷新...'
          titleColor='#9370DB'
          // Android 专用属性
          colors={['#9370DB', '#8A2BE2']}
          progressBackgroundColor='#ffffff'
          style={{
            backgroundColor: '#f5f5f5', // 下拉区域的背景色 (iOS)
          }}
        />
      }
    >
      <View className='flex-1 bg-white min-h-full' style={{ flex: 1 }}>
        <View className='items-center p-5'>
          <Text className='text-xl font-bold text-[#9370DB]'>记录页面</Text>
        </View>
      </View>
    </ScrollView>
  );
}

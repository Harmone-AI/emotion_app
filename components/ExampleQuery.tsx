import React from 'react';
import { View, Text, Button } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  useFocusNotifyOnChangeProps,
  useRefreshOnFocus,
} from '../libs/query-helpers';
import { fetchTodos, addTodo } from '@/services/todo';

export const ExampleQuery = () => {
  // 查询 todos
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    notifyOnChangeProps: useFocusNotifyOnChangeProps(['data']),
  });

  // 在屏幕重新获得焦点时刷新数据
  useRefreshOnFocus(refetch);

  // 添加 todo 的 mutation
  const mutation = useMutation({
    mutationKey: ['addTodo'],
    mutationFn: addTodo,
    onSuccess: () => {
      refetch();
    },
  });

  if (isFetching) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View className='p-4'>
      <Text className='text-lg mb-4'>Todos ({data?.length || 0})</Text>

      <Button
        title='Add Todo'
        onPress={() => {
          mutation.mutate({
            title: 'New Todo ' + new Date().toISOString(),
            completed: false,
          });
        }}
      />

      {mutation.isPending && <Text>Adding todo...</Text>}
      {mutation.isError && (
        <Text>Error adding todo: {mutation.error.message}</Text>
      )}

      {data?.slice(0, 200).map((todo: any) => (
        <View key={todo.id} className='py-2'>
          <Text>
            {todo.id}. {todo.title} ({todo.completed ? 'Done' : 'Pending'})
          </Text>
        </View>
      ))}
    </View>
  );
};

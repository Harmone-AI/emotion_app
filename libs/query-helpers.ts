import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NotifyOnChangeProps } from '@tanstack/react-query';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import * as Network from 'expo-network';

// 处理应用状态变化
function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

/**
 * 应用激活的时候重新获取数据，应用切换到后台的时候不重新获取数据 https://tanstack.com/query/latest/docs/framework/react/react-native#refetch-on-app-focus
 */
export function useAppState() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);
}

/**
 * 监听网络状态变化，自动处理在线/离线状态
 * DOC: https://tanstack.com/query/latest/docs/framework/react/react-native#online-status-management
 */
export function useNetworkState() {
  useEffect(() => {
    // 初始化时检查网络状态
    Network.getNetworkStateAsync().then((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });

    // 监听网络状态变化
    Network.addNetworkStateListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });
  }, []);
}

/**
 * 在屏幕重新获得焦点时刷新数据
 * DOC: https://tanstack.com/query/latest/docs/framework/react/react-native#refresh-on-screen-focus
 * @param refetch 指定 Query 的 refetch 函数
 */
export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const enabledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      console.log(12312312313, enabledRef.current);
      if (enabledRef.current) {
        refetch();
      } else {
        enabledRef.current = true;
      }
    }, [refetch])
  );
}

/**
 * 获取当前是否处于焦点，通过这个判断是否 query 应该触发
 * DOC: https://tanstack.com/query/latest/docs/framework/react/react-native#disable-queries-on-out-of-focus-screens
 */
export function useQueryFocusAware() {
  const focusedRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;

      return () => {
        focusedRef.current = false;
      };
    }, [])
  );

  return () => focusedRef.current;
}

/**
 * 在屏幕聚焦的时候，控制query当中哪些字段发生变化，组件才重新渲染。https://tanstack.com/query/latest/docs/framework/react/react-native#disable-re-renders-on-out-of-focus-screens
 * @param notifyOnChangeProps 属性名 ['data', 'error', 'isPending']
 * @returns
 */
export function useFocusNotifyOnChangeProps(
  notifyOnChangeProps?: NotifyOnChangeProps
) {
  const focusedRef = useRef(true);

  // 监听屏幕焦点变化
  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true; // 屏幕获得焦点

      return () => {
        focusedRef.current = false; // 屏幕失去焦点
      };
    }, [])
  );

  return () => {
    // 如果屏幕没有焦点，返回空数组，表示不需要监听任何属性变化
    if (!focusedRef.current) {
      return [];
    }

    // 如果屏幕有焦点，则返回原来的配置
    if (typeof notifyOnChangeProps === 'function') {
      return notifyOnChangeProps();
    }
    return notifyOnChangeProps;
  };
}

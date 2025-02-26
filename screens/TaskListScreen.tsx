import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddGoalSheet from "../components/AddGoalSheet";
import TaskDetailModal from "../components/TaskDetailModal";
import { useAddTask, useCurrentTaskList } from "../hooks/useTaskQueries";
import { TASK_STATUS, TaskListItem, TaskDetail } from "../types/task";

const TaskListScreen = () => {
  const navigation = useNavigation();
  const userId = 1; // TODO: 从用户状态获取

  const {
    data: taskList,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCurrentTaskList(userId);

  const addTaskMutation = useAddTask();

  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const handleTaskPress = (task: TaskListItem) => {
    // Transform the task to match TaskDetailModal's expected type
    const transformedTask: TaskDetail = {
      id: task.id.toString(),
      title: task.title || "未命名任务列表",
      completed: task.status === TASK_STATUS.COMPLETED,
      time: task.created_at,
      icon: "checkbox-marked-circle-outline", // Default icon
    };
    setSelectedTask(transformedTask);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleAddGoal = () => {
    setShowAddGoal(true);
  };

  const handleAddTask = async (content: string) => {
    try {
      await addTaskMutation.mutateAsync({
        content,
        listId: taskList?.[0]?.id || 1, // Use the first task list's ID or default to 1
        userId,
      });
      setShowAddGoal(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const getTaskStatusInfo = (
    status: number
  ): {
    text: string;
    iconName: keyof typeof MaterialCommunityIcons.glyphMap;
    textColor: string;
    bgColor: string;
    iconColor: string;
  } => {
    switch (status) {
      case TASK_STATUS.COMPLETED:
        return {
          text: "已完成",
          iconName: "check-circle",
          textColor: "text-green-700",
          bgColor: "bg-green-100",
          iconColor: "#4CAF50",
        };
      case TASK_STATUS.IN_PROGRESS:
      default:
        return {
          text: "进行中",
          iconName: "checkbox-blank-circle-outline",
          textColor: "text-gray-700",
          bgColor: "bg-gray-100",
          iconColor: "#666",
        };
    }
  };
  // const = useQuestStore(state => );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-600 text-center mb-4">
          获取任务列表失败，请检查网络后重试
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-purple-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center justify-center relative px-4 py-2">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-4"
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={32}
                color="#666"
              />
            </TouchableOpacity>
            <Text className="text-lg font-medium">任务列表</Text>
          </View>

          {/* Task List */}
          <View className="px-4 py-4">
            {/* Test Button for Completion Screen */}
            <TouchableOpacity
              className="bg-blue-500 rounded-full px-4 py-2 mb-4 self-center"
              onPress={() => navigation.navigate("TaskCompletion")}
            >
              <Text className="text-white font-medium">测试完成页面</Text>
            </TouchableOpacity>

            <View className="flex-row flex-wrap -mx-2">
              {taskList?.map((task) => {
                const statusInfo = getTaskStatusInfo(task.status);
                return (
                  <Pressable
                    key={task.id}
                    className="w-1/3 px-2 mb-4"
                    onPress={() => handleTaskPress(task)}
                  >
                    <View
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 2.5,
                        elevation: 2,
                      }}
                    >
                      <View style={{ aspectRatio: 1 }} className="p-2">
                        <Image
                          source={require("../assets/images/image.png")}
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <View
                        className="px-3 py-2.5 bg-white border-t border-gray-50"
                        style={{
                          borderTopWidth: 1,
                          borderTopColor: "rgba(0,0,0,0.03)",
                          minHeight: 52,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          className="text-gray-700 text-[13px] text-center font-medium"
                          numberOfLines={2}
                          style={{
                            lineHeight: 18,
                          }}
                        >
                          {task.title || "未命名任务列表"}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Task Detail Modal */}
        <TaskDetailModal
          visible={selectedTask !== null}
          onClose={handleCloseModal}
          task={selectedTask as TaskDetail}
          onAddGoal={handleAddGoal}
        />

        {/* Add Goal Sheet */}
        <AddGoalSheet
          isOpen={showAddGoal}
          onClose={() => setShowAddGoal(false)}
          onAdd={handleAddTask}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TaskListScreen;

import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Story } from "../types/story";

export type DrawerParamList = {
  Home: undefined;
  AddGoal: undefined;
  TaskList: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  DrawerRoot: undefined;
  Home: undefined;
  AddGoal: undefined;
  TaskList: undefined;
  stories: undefined;
  TaskCompletion: undefined;
  StoryDetail: Story;
  tasks: undefined;
  task: undefined;
  story: undefined;
  "keyboard-input-target": undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
export type CustomDrawerNavigationProp = DrawerNavigationProp<DrawerParamList>;

import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Story } from "../types/story";

export type DrawerParamList = {
  Home: undefined;
  AddGoal: undefined;
  TaskList: undefined;
  Settings: undefined;
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
  quest: undefined;
  story: {
    id: number;
  };
  "keyboard-input-target": undefined;
  test: undefined;
  "reddit-share-example": undefined;
  "session-reply-permission": undefined;
  Settings: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
export type CustomDrawerNavigationProp = DrawerNavigationProp<DrawerParamList>;

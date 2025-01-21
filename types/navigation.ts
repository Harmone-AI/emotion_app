import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Story } from './story';

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
  StoryList: undefined;
  TaskCompletion: undefined;
  StoryDetail: Story;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type CustomDrawerNavigationProp = DrawerNavigationProp<DrawerParamList>;

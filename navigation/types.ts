import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type TabParamList = {
  Home: undefined;
  Record: undefined;
};

export type DrawerParamList = {
  Main: NavigatorScreenParams<TabParamList>;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Root: NavigatorScreenParams<DrawerParamList>;
  AddGoal: undefined;
};

export type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList>,
    BottomTabNavigationProp<TabParamList>
  >
>;

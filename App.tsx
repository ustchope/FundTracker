import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { FundProvider } from './src/context/FundContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddScreen } from './src/screens/AddScreen';
import { ActionScreen } from './src/screens/ActionScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { colors, fontSize } from './src/constants/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
    </View>
  );
}

export default function App() {
  return (
    <FundProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarLabelStyle: {
              fontSize: fontSize.xs,
              fontWeight: '500',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: '持仓',
              tabBarIcon: ({ focused }) => <TabIcon icon="💼" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Add"
            component={AddScreen}
            options={{
              tabBarLabel: '添加',
              tabBarIcon: ({ focused }) => <TabIcon icon="➕" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Action"
            component={ActionScreen}
            options={{
              tabBarLabel: '待办',
              tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: '设置',
              tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FundProvider>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
});

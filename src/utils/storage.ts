import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fund, AppSettings } from '../types';

const FUNDS_KEY = '@FundTracker:funds';
const SETTINGS_KEY = '@FundTracker:settings';

const DEFAULT_SETTINGS: AppSettings = {
  reminderEnabled: false,
  reminderTime: '09:00',
  soldCoolingDays: 90,
};

export async function loadFunds(): Promise<Fund[]> {
  try {
    const data = await AsyncStorage.getItem(FUNDS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Failed to load funds:', error);
    return [];
  }
}

export async function saveFunds(funds: Fund[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FUNDS_KEY, JSON.stringify(funds));
  } catch (error) {
    console.error('Failed to save funds:', error);
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export async function exportData(): Promise<string> {
  try {
    const funds = await loadFunds();
    const settings = await loadSettings();
    return JSON.stringify({ funds, settings, exportDate: new Date().toISOString() }, null, 2);
  } catch (error) {
    console.error('Failed to export data:', error);
    return '';
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FUNDS_KEY);
    await AsyncStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

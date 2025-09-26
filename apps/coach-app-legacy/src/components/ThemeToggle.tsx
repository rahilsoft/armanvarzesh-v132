import React, { useContext } from 'react';
import { Pressable, Text } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle(){
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <Pressable accessibilityLabel="toggle theme" onPress={toggleTheme} style={{ padding: 8, alignSelf: 'flex-start' }}>
    <Text style={{ fontFamily:'Yekan' }}>{theme === 'light' ? '🌙' : '☀️'}</Text>
  </Pressable>;
}

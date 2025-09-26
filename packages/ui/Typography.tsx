import React from 'react';
import { Text, TextProps } from 'react-native';
export const Title: React.FC<TextProps> = (p) => <Text accessibilityRole="header" {...p} />;
export const Caption: React.FC<TextProps> = (p) => <Text {...p} />;

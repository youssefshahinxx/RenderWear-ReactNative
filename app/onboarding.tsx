import React from 'react';
import { View, StatusBar } from 'react-native';
import Onboarding from '@/components/Onboarding';

export default function OnboardingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Onboarding />
    </View>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { can, type Role, type Feature, type Action } from '../../security/rbac';

export function GuardRN({ role, feature, action='view', children }:{ role:Role; feature:Feature; action?:Action; children:React.ReactNode }){
  if(!can(role, action, feature)) return <View style={{padding:16}}><Text>دسترسی غیرمجاز</Text></View>;
  return <>{children}</>;
}

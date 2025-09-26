
import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';

const CustomModal = ({ visible, children, ...rest }) => (
  <Modal visible={visible} transparent animationType="slide" {...rest}>
    <View style={styles.overlay}>{children}</View>
  </Modal>
);
const styles = StyleSheet.create({ overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center' } });
export default CustomModal;

import { useState } from 'react';
import { StyleSheet, Button, View, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';


export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);


  const handleOpenCamera = async () => {
    try{
      setModalIsVisible(true)
    }catch (erro) {
      console.log(erro)
    }
  }
  return (
    <View style={styles.container}>
        <Button title='Read QRCode' onPress={handleOpenCamera}></Button>
        <Modal visible={modalIsVisible} style={{flex: 1}}>
          <CameraView style={{flex: 1}} facing='back' />
          <View style={styles.footer}>
            <Button title='Cancel' onPress={() => setModalIsVisible(false)} />
          </View>
        </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32
  }
});

import { useState, useRef } from 'react';
import { StyleSheet, Button, View, Modal, Alert, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';


export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();

  const qrCodeLock = useRef(false);

  const handleOpenCamera = async () => {
    try{
      const {granted} = await requestPermission()
    
      if(!granted){
        return Alert.alert("Camera:", "you need to allow access to the camera.")
      }

      setModalIsVisible(true);
      qrCodeLock.current = false;
    }catch (erro) {
      console.log(erro)
    }
  }


  const handleQRCodeRead = async (data: string) => {
    setModalIsVisible(false);
    // checks for a link
    if(data.startsWith('https://') || data.startsWith('http://')) {
      try {
        await Linking.openURL(data);
      } catch (error) {
        Alert.alert("Error", "Unable to open link");
        console.log(error);
      }
      return
    }
    // checks for a Wifi
    
    if(data.startsWith('WIFI:')) {
      const regex = "/WIFI:T:(.*?);S:(.*?);P:(.*?);/";
      const match = data.match(regex);

      if(match){
        const type = match[1]
        const ssid = match[2]
        const password = match[3]

        Alert.alert("Wifi detected: ", `SSID: ${ssid} \n Senha: ${password} \n type: ${type}`)

      }
    }

      Alert.alert("QrCode data:", data);
  }

  return (
    <View style={styles.container}>
        <Button title='Read QRCode' onPress={handleOpenCamera}></Button>
        <Modal visible={modalIsVisible} style={{flex: 1}}>
          <CameraView 
          style={{flex: 1}} 
          facing='back' 
          onBarcodeScanned={({data}) => {
            if(data && !qrCodeLock.current){
              qrCodeLock.current = true;
              setTimeout(() => handleQRCodeRead(data), 500);
            }
          }}
          />
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

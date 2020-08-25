import {useEffect, useState} from 'react'
import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Layout from '../components/layout';
import ControlContainer from '../components/controlContainer'
import Control from '../components/control'

const connectionStatusEnums = {
  CONNECTING: 'connecting...',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting...'
};
const ACTION_FOR_DEVICE = 'SEND_ACTION_TO_CLIENT';
const DeviceActions = {
  CameraType: 'SET_CAMERA_TYPE',
  WhiteBalance: 'SET_WHITE_BALANCE',
  Autofocus: 'SET_AUTOFOCUS',
  Flash: 'SET_FLASH_MODE'
};
const CameraConstants = {
  Type: {
    front: 1,
    back: 0
  },
  FlashMode: {
    off: 0,
    on: 1,
    torch: 2,
    auto: 3
  },
  AutoFocus: {
    on: true,
    off: false
  },
  WhiteBalance: {
    auto: 0,
    cloudy: 1,
    sunny: 2,
    shadow: 3,
    fluorescent: 4
  },
  VideoQuality: {
    '720p': 2,
    '480p': 3,
    '2160p': 0,
    '1080p': 1,
    '4:3': 4
  }
};
let websocket = null;

export default function Home(props) {
  const [connectionStatus, setConnectionStatus] = useState(connectionStatusEnums.CONNECTING);
  const [selectedDeviceId, setDeviceId] = useState('');
  const [allDevicesList, setAllDevicesList] = useState([]);
  const [flashState, setFlashState] = useState(0);
  const [focusState, setFocusState] = useState(0);
  const [cameraType, setCameraType] = useState(0);

  useEffect(() => {
    websocket = new WebSocket('ws://127.0.0.1:3001');
    if(websocket){
      websocket.onopen = () =>{
        setConnectionStatus(connectionStatusEnums.CONNECTED)
      };

      websocket.onmessage = ({data}) => {
        let dataObj;
        try{
          dataObj = JSON.parse(data);
        } catch (e) {
        }

        if(dataObj){
          console.log(dataObj)
          switch(dataObj.type){
            case 'RESPOND_CONNECTED_DEVICES':
              setAllDevicesList(dataObj.payload.devices)
              break;
            default:
          }
        } else {
          console.log(data)
        }
      };

      websocket.onclose = ()=>{
        setConnectionStatus(connectionStatusEnums.DISCONNECTED)
      }
    }
  },[]);

  const sendMessage = (message={}) => {
    websocket.send(JSON.stringify(message))
  };

  const sendAction = (payload)=>{
    if(selectedDeviceId === '')
      return;
    sendMessage({
      type: ACTION_FOR_DEVICE,
      deviceId: selectedDeviceId,
      payload
    })
  };

  const focusToggle = (focus) => {
    if(selectedDeviceId === '') return

    sendAction(
      {
        type: DeviceActions.Autofocus,
        payload: focus
      }
    );
    setFocusState(focus);
  };

  const getDevicesList = () => {
    sendMessage({
      type: 'ASK_CONNECTED_DEVICES'
    })
  };

  const setFlashOnDevice = (flashMode)=>{
    if(selectedDeviceId === '') return
    sendAction({
      type: DeviceActions.Flash,
      payload: flashMode
    })
  };

  const setWhiteBalanceOnDevice = (whiteMode)=>{
    if(selectedDeviceId === '') return
    sendAction({
      type: DeviceActions.WhiteBalance,
      payload: whiteMode
    })
  };

  const toggleCamera = (type) => {
    if(selectedDeviceId === '')
      return;
    setCameraType(type);
    sendAction({
      type: DeviceActions.CameraType,
      payload: type
    });
  };

  return (
    <Layout>
      <Head>
        <title>Camera controller</title>
      </Head>
      <section className={utilStyles.headingXl} >
        <p>React native camera controller</p>
      </section>
      <section>
        <button onClick={()=>{
          getDevicesList()
        }}>Refrescar</button>
        <p>
          Dispositivo a conectar:{' '}
          <select value={selectedDeviceId} onChange={(evt)=>{
            const val = evt.target.value;
            setDeviceId(val)
          }}>
            <option value={''}>Seleccionar</option>
            {
              allDevicesList.map(device => {
                return (
                  <option value={device.id} key={device.id}>{device.name}</option>
                )
              })
            }
          </select>
        </p>
      </section>
      <section className={utilStyles.headingMd} >
        <p>Status: {connectionStatus}</p>
      </section>
      <ControlContainer>
        <Control>
          Flash:{' '}
          <select onChange={event => setFlashOnDevice(event.target.value)}>
            {
              Object.entries(CameraConstants.FlashMode).map( ([key, val]) => {
                return (
                  <option value={val} key={key}>{key}</option>
                )
              })
            }
          </select>
        </Control>
        <Control>
          Autofocus:{' '}
          <select onChange={event => focusToggle(event.target.value)}>
            {
              Object.entries(CameraConstants.AutoFocus).map( ([key, val]) => {
                return (
                  <option value={val} key={key}>{key}</option>
                )
              })
            }
          </select>
        </Control>
        <Control>
          White Balance:{' '}
          <select onChange={event => setWhiteBalanceOnDevice(event.target.value)}>
            {
              Object.entries(CameraConstants.WhiteBalance).map( ([key, val]) => {
                return (
                  <option value={val} key={key}>{key}</option>
                )
              })
            }
          </select>
        </Control>
        <Control>
          Current Camera:{' '}
          <select onChange={event => toggleCamera(event.target.value)}>
            {
              Object.entries(CameraConstants.Type).map( ([key, val]) => {
                return (
                  <option value={val} key={key}>{key}</option>
                )
              })
            }
          </select>
        </Control>
      </ControlContainer>
    </Layout>
  )
}
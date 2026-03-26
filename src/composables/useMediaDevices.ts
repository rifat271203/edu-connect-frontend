// src/composables/useMediaDevices.ts
interface MediaDeviceInfo {
  deviceId: string
  label: string
  kind: MediaDeviceKind
}

interface UseMediaDevicesReturn {
  cameras: Ref<MediaDeviceInfo[]>
  microphones: Ref<MediaDeviceInfo[]>
  speakers: Ref<MediaDeviceInfo[]>
  getLocalStream: (videoDeviceId?: string, audioDeviceId?: string) => Promise<MediaStream | null>
  getScreenShare: () => Promise<MediaStream | null>
  enumerateDevices: () => Promise<void>
  switchCamera: (deviceId: string, peerConnections: Map<string, RTCPeerConnection>) => Promise<void>
  switchMicrophone: (deviceId: string, peerConnections: Map<string, RTCPeerConnection>) => Promise<void>
}

const cameras = ref<MediaDeviceInfo[]>([])
const microphones = ref<MediaDeviceInfo[]>([])
const speakers = ref<MediaDeviceInfo[]>([])

const getReadableMediaError = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'Unable to access media devices due to an unknown error.'
  }

  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    return 'Camera or microphone permission was denied.'
  }

  if (error.name === 'NotFoundError') {
    return 'No camera or microphone device was found.'
  }

  if (error.name === 'NotReadableError') {
    return 'Camera or microphone is being used by another application.'
  }

  return error.message || 'Failed to access media devices.'
}

const enumerateDevices = async (): Promise<void> => {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices()

    cameras.value = devices
      .filter((device) => device.kind === 'videoinput')
      .map((device) => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 6)}`,
        kind: device.kind,
      }))

    microphones.value = devices
      .filter((device) => device.kind === 'audioinput')
      .map((device) => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${device.deviceId.slice(0, 6)}`,
        kind: device.kind,
      }))

    speakers.value = devices
      .filter((device) => device.kind === 'audiooutput')
      .map((device) => ({
        deviceId: device.deviceId,
        label: device.label || `Speaker ${device.deviceId.slice(0, 6)}`,
        kind: device.kind,
      }))
  } catch {
    // Silently fail if device enumeration is not supported
  }
}

const getLocalStream = async (videoDeviceId?: string, audioDeviceId?: string): Promise<MediaStream | null> => {
  try {
    const constraints: MediaStreamConstraints = {
      video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
      audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return stream
  } catch (error) {
    throw new Error(getReadableMediaError(error))
  }
}

const getScreenShare = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    })
    return stream
  } catch (error) {
    throw new Error(getReadableMediaError(error))
  }
}

const switchCamera = async (deviceId: string, peerConnections: Map<string, RTCPeerConnection>): Promise<void> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
      audio: false,
    })

    const newTrack = stream.getVideoTracks()[0]
    if (!newTrack) {
      throw new Error('No video track found')
    }

    // Replace video track in all peer connections
    peerConnections.forEach((pc) => {
      const videoSender = pc.getSenders().find((sender) => sender.track?.kind === 'video')
      if (videoSender) {
        void videoSender.replaceTrack(newTrack)
      }
    })

    // Return the new track for the caller to update local stream
    return
  } catch (error) {
    throw new Error(getReadableMediaError(error))
  }
}

const switchMicrophone = async (deviceId: string, peerConnections: Map<string, RTCPeerConnection>): Promise<void> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: { exact: deviceId } },
    })

    const newTrack = stream.getAudioTracks()[0]
    if (!newTrack) {
      throw new Error('No audio track found')
    }

    // Replace audio track in all peer connections
    peerConnections.forEach((pc) => {
      const audioSender = pc.getSenders().find((sender) => sender.track?.kind === 'audio')
      if (audioSender) {
        void audioSender.replaceTrack(newTrack)
      }
    })

    // Return the new track for the caller to update local stream
    return
  } catch (error) {
    throw new Error(getReadableMediaError(error))
  }
}

export const useMediaDevices = (): UseMediaDevicesReturn => {
  onMounted(() => {
    void enumerateDevices()
    navigator.mediaDevices?.addEventListener('devicechange', enumerateDevices)
  })

  onUnmounted(() => {
    navigator.mediaDevices?.removeEventListener('devicechange', enumerateDevices)
  })

  return {
    cameras,
    microphones,
    speakers,
    getLocalStream,
    getScreenShare,
    enumerateDevices,
    switchCamera,
    switchMicrophone,
  }
}

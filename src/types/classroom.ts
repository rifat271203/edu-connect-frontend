// src/types/classroom.ts
export type ClassroomRole = 'teacher' | 'student'

export type SessionStatus = 'idle' | 'lobby' | 'live' | 'ended'

export interface Participant {
  socketId: string
  userId: string
  name: string
  role: ClassroomRole
  isMuted: boolean
  isCameraOff: boolean
  hasHandRaised: boolean
  isAdmitted: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
}

export interface IceConfig {
  iceServers: RTCIceServer[]
}

export interface SessionMeta {
  roomId: string
  title: string
  status: 'waiting' | 'live' | 'ended'
  participantCount: number
  isRecording: boolean
}

export interface JoinRoomPayload {
  roomId: string
  role: ClassroomRole
  userId: string
  name: string
}

export interface LeaveRoomPayload {
  roomId: string
}

export interface OfferPayload {
  roomId: string
  toSocketId: string
  fromSocketId?: string
  offer: RTCSessionDescriptionInit
}

export interface AnswerPayload {
  roomId: string
  toSocketId: string
  fromSocketId?: string
  answer: RTCSessionDescriptionInit
}

export interface IceCandidatePayload {
  roomId: string
  toSocketId: string
  fromSocketId?: string
  candidate: RTCIceCandidateInit
}

export interface HandRaisePayload {
  roomId: string
  socketId: string
  hasHandRaised: boolean
}

export interface SendChatPayload {
  roomId: string
  message: string
}

export interface ChatMessageEventPayload {
  roomId: string
  message: ChatMessage
}

export interface ParticipantListPayload {
  roomId: string
  participants: Participant[]
  waitingRoom?: Participant[]
}

export interface PeerJoinedPayload {
  roomId: string
  socketId: string
  participant?: Participant
}

export interface ForceMutePayload {
  roomId: string
  socketId?: string
  muteAll?: boolean
}

export interface AdmitParticipantPayload {
  roomId: string
  socketId: string
}

export interface AdmittedPayload {
  roomId: string
  socketId: string
}

export interface SessionEndedPayload {
  roomId: string
  endedBy?: string
}

export interface ClassroomClientToServerEvents {
  'join-room': (payload: JoinRoomPayload) => void
  offer: (payload: OfferPayload) => void
  answer: (payload: AnswerPayload) => void
  'ice-candidate': (payload: IceCandidatePayload) => void
  'hand-raise': (payload: HandRaisePayload) => void
  'send-chat': (payload: SendChatPayload) => void
  'leave-room': (payload: LeaveRoomPayload) => void
  admit: (payload: AdmitParticipantPayload) => void
}

export interface ClassroomServerToClientEvents {
  'peer-joined': (payload: PeerJoinedPayload) => void
  offer: (payload: OfferPayload) => void
  answer: (payload: AnswerPayload) => void
  'ice-candidate': (payload: IceCandidatePayload) => void
  'participant-list': (payload: ParticipantListPayload) => void
  'hand-raised': (payload: HandRaisePayload) => void
  'chat-message': (payload: ChatMessageEventPayload) => void
  'force-mute': (payload: ForceMutePayload) => void
  admitted: (payload: AdmittedPayload) => void
  'session-ended': (payload: SessionEndedPayload) => void
}

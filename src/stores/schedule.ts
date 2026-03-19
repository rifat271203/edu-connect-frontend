import { defineStore } from 'pinia'
import type { ClassroomSession } from '~/types/classroom-room'

interface ScheduleState {
  sessions: ClassroomSession[]
  calendarMonth: string
}

const now = Date.now()
const hours = (value: number) => new Date(now + value * 60 * 60 * 1000).toISOString()

const seedSchedule = (courseId: string): ClassroomSession[] => [
  {
    id: `${courseId}-session-1`,
    courseId,
    title: 'Lecture: Periodicity and trends',
    description: 'Main theory class',
    type: 'lecture',
    startAt: hours(6),
    endAt: hours(8),
    location: 'Room A-302',
    status: 'scheduled',
  },
  {
    id: `${courseId}-session-2`,
    courseId,
    title: 'Lab: Titration practice',
    description: 'Bring your lab notebook',
    type: 'lab',
    startAt: hours(26),
    endAt: hours(28),
    location: 'Chem Lab 2',
    status: 'scheduled',
  },
  {
    id: `${courseId}-session-3`,
    courseId,
    title: 'Exam window: Quiz 1',
    type: 'exam',
    startAt: hours(52),
    endAt: hours(53),
    meetingLink: 'https://meet.example.com/quiz-room',
    status: 'scheduled',
  },
  {
    id: `${courseId}-session-4`,
    courseId,
    title: 'Public Holiday',
    type: 'holiday',
    startAt: hours(96),
    endAt: hours(104),
    status: 'scheduled',
  },
]

export const useScheduleStore = defineStore('classroom-schedule', {
  state: (): ScheduleState => ({
    sessions: [],
    calendarMonth: new Date().toISOString().slice(0, 7),
  }),

  getters: {
    sessionsByCourse: (state) => (courseId: string) =>
      state.sessions
        .filter((session) => session.courseId === courseId)
        .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
  },

  actions: {
    ensureCourseSeed(courseId: string) {
      if (this.sessions.some((session) => session.courseId === courseId)) return
      this.sessions = [...seedSchedule(courseId), ...this.sessions]
    },

    saveSession(session: ClassroomSession) {
      const exists = this.sessions.some((item) => item.id === session.id)
      if (!exists) {
        this.sessions = [session, ...this.sessions]
        return
      }
      this.sessions = this.sessions.map((item) => (item.id === session.id ? session : item))
    },

    cancelSession(sessionId: string) {
      this.sessions = this.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              status: 'cancelled',
            }
          : session,
      )
    },
  },
})


export type ClassroomUserRole = 'teacher' | 'student'

export interface ClassroomCourseInfo {
  id: string
  title: string
  code?: string
  description?: string
  coverImage?: string
  teacherId: string
  teacherName: string
  memberCount: number
}

export interface ChatAttachment {
  name: string
  url: string
  type: string
}

export interface ClassroomChatMessage {
  id: string
  courseId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  isTeacher: boolean
  content: string
  createdAt: string
  read?: boolean
  attachment?: ChatAttachment
}

export type NoticePriority = 'urgent' | 'high' | 'medium' | 'low'

export interface ClassroomNotice {
  id: string
  courseId: string
  title: string
  body: string
  priority: NoticePriority
  pinned: boolean
  authorId: string
  authorName: string
  createdAt: string
  acknowledgementCount: number
  acknowledgedBy: string[]
  attachmentUrl?: string
}

export type ResourceCategory = 'pdf' | 'video' | 'link' | 'document'

export interface ClassroomResource {
  id: string
  courseId: string
  title: string
  description: string
  category: ResourceCategory
  url: string
  downloadCount: number
  uploadedAt: string
}

export interface PersonalNote {
  id: string
  title: string
  content: string
  updatedAt: string
  userId: string
}

export type ExamQuestionType = 'mcq' | 'short' | 'long'

export interface ExamQuestion {
  id: string
  type: ExamQuestionType
  question: string
  marks: number
  options?: string[]
  correctOptionIndex?: number
}

export type ExamStatus = 'upcoming' | 'ongoing' | 'past'

export interface ClassroomExam {
  id: string
  courseId: string
  title: string
  instructions: string
  durationMinutes: number
  startAt: string
  endAt: string
  totalMarks: number
  questions: ExamQuestion[]
}

export interface ExamSubmission {
  examId: string
  userId: string
  answers: Record<string, string | number>
  startedAt: string
  submittedAt?: string
  autoSubmitted?: boolean
}

export type SessionType = 'lecture' | 'lab' | 'exam' | 'holiday'

export interface ClassroomSession {
  id: string
  courseId: string
  title: string
  description?: string
  type: SessionType
  startAt: string
  endAt: string
  location?: string
  meetingLink?: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
}

export interface StudentProgress {
  overallGrade: number
  attendancePercentage: number
  examScores: Array<{ examName: string; score: number; total: number; grade: string; date: string }>
  assignmentScores: Array<{ name: string; score: number; total: number; feedback: string; date: string }>
}

export interface TeacherClassStats {
  averageScore: number
  attendanceRate: number
  submissionRate: number
}

export interface TeacherStudentProgressRow {
  id: string
  name: string
  avgScore: number
  attendancePercent: number
  assignmentsCompleted: number
  overallGrade: string
}

export interface AssignmentSubmission {
  studentId: string
  studentName: string
  fileUrl: string
  fileName: string
  comment?: string
  submittedAt: string
  late: boolean
  score?: number
  feedback?: string
}

export interface ClassroomAssignment {
  id: string
  courseId: string
  title: string
  description: string
  dueAt: string
  totalMarks: number
  attachmentUrl?: string
  attachmentName?: string
  submissions: AssignmentSubmission[]
}

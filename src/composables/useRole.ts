import { storeToRefs } from 'pinia'
import { useClassroomStore } from '~/stores/classroom'

export const useRole = () => {
  const classroomStore = useClassroomStore()
  const { userRole } = storeToRefs(classroomStore)

  const isTeacher = computed(() => userRole.value === 'teacher')
  const isStudent = computed(() => userRole.value === 'student')

  return {
    isTeacher,
    isStudent,
  }
}


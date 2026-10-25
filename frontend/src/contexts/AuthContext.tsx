import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UserAccount, CheckInEntry, CognitiveScores, AssessmentResponse } from '../types'

const USERS_STORAGE_KEY = 'mindease_users'
const CURRENT_USER_KEY = 'mindease_current_user_id'

interface AuthContextType {
  currentUser: UserAccount | null
  isAuthenticated: boolean
  login: (email: string, name?: string) => UserAccount
  register: (name: string, email: string) => UserAccount
  logout: () => void
  saveAssessment: (responses: Record<string, string | number>, report: AssessmentResponse) => void
  saveCheckIn: (entry: Omit<CheckInEntry, 'id' | 'timestamp'>) => void
  saveCognitiveScores: (scores: Partial<CognitiveScores>) => void
  retakeAssessment: () => void
  updateProfileName: (name: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getInitialUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to load users from storage', err)
  }

  // Seed with an initial demo user so visitors can explore immediately or create their own
  const demoUser: UserAccount = {
    id: 'user-demo-1',
    name: 'Maya Lin',
    email: 'maya@mindease.wellness',
    joinedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    assessmentCompleted: true,
    assessmentResponses: {
      age_group: '18-25',
      sleep_quality: 'Average',
      wake_refreshed: 'Sometimes',
      daily_screen_time: '4-6 hours',
      social_media_usage: '30 minutes-2 hours',
      app_switching_frequency: 'Frequently switch',
      notifications_interrupt_work: 'Sometimes',
      phone_usage_during_work: 'Sometimes',
      short_form_video_usage: '30 minutes-1 hour/day',
      study_location: 'Quiet corner at home',
      noise_level: 'Low background noise',
      lighting_condition: 'Good',
      desk_organization: 'Mostly organized',
      study_environment_comfort: 'Comfortable',
      focus_duration: '30-60 minutes',
      losing_focus_frequency: 'Sometimes',
      procrastination: 'Sometimes',
      mind_wandering_frequency: 'Sometimes',
      nature_of_thoughts: 'Mixed',
      thought_branching: 'Thoughts connect into multiple ideas',
      difficulty_controlling_thoughts: 'Moderate',
      future_overthinking: 'Sometimes',
      random_ideas_interrupt: 'Sometimes',
      stress_level: 'Moderate',
      anxiety_level: 'Low',
      mental_overload: 'Slight overload',
      motivation_level: 'Moderate',
      main_distraction_source: 'Phone',
      reaction_time_ms: 380,
      attention_accuracy_percentage: 78,
      memory_score: 72,
      stroop_accuracy_percentage: 82,
      task_switch_accuracy: 75,
    },
    latestReport: {
      attention_interference_level: 'Moderate',
      confidence_percentage: 74.3,
      explanation: 'Your attention profile indicates moderate everyday interference, influenced by multitasking and digital check-ins.',
      contributing_factors: [
        {
          feature: 'phone_checking_without_notification',
          label: 'Checking the phone',
          answer: 'Frequent',
          confidence_change_percentage_points: 6.4,
          explanation: 'Frequent spontaneous phone pickups interrupt deep task continuity.',
        },
        {
          feature: 'sleep_quality',
          label: 'Sleep quality',
          answer: 'Average',
          confidence_change_percentage_points: 5.8,
          explanation: 'Consistent rest supports cognitive stamina across longer work blocks.',
        },
        {
          feature: 'stress_level',
          label: 'Self-reported stress',
          answer: 'Moderate',
          confidence_change_percentage_points: 4.9,
          explanation: 'Mild cognitive load can heighten thought wandering during demanding tasks.',
        },
      ],
      personalized_suggestions: [
        'A consistent wind-down and sleep schedule may support everyday concentration.',
        'Place the phone out of reach or use a planned check-in break while working.',
        'Try a brief calming pause or divide a demanding task into manageable steps.',
        'Practice keeping only the essential application open during single-task sessions.',
      ],
      global_model_factors: [],
      disclaimer: 'MindEase is a research and digital-wellness tool, not a medical diagnosis. These patterns are not proof of cause and should not replace professional medical advice.',
    },
    cognitiveScores: {
      reaction_time_ms: 380,
      attention_accuracy_percentage: 78,
      missed_targets: 3,
      visual_attention_score: 75,
      focus_flow_distraction_count: 5,
      focus_recovery_time_seconds: 18,
      memory_score: 72,
      stroop_accuracy_percentage: 82,
      task_switch_accuracy: 75,
    },
    dailyCheckIns: [
      {
        id: 'chk-1',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        timestamp: Date.now() - 3 * 86400000,
        mood: 4,
        energy: 4,
        focus: 4,
        sleepQuality: 'Good',
        wakeRefreshed: 'Often',
        approximateScreenTimeHours: '4h',
        notificationInterruptions: 'Low',
        biggestDistraction: 'Phone',
        note: 'Felt very clear-headed after morning forest walk.',
      },
      {
        id: 'chk-2',
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        timestamp: Date.now() - 2 * 86400000,
        mood: 3,
        energy: 3,
        focus: 3,
        sleepQuality: 'Average',
        wakeRefreshed: 'Sometimes',
        approximateScreenTimeHours: '6h',
        notificationInterruptions: 'Medium',
        biggestDistraction: 'Thoughts',
        note: 'Slight afternoon fatigue, but Pomodoro breaks helped.',
      },
      {
        id: 'chk-3',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        timestamp: Date.now() - 86400000,
        mood: 4,
        energy: 5,
        focus: 4,
        sleepQuality: 'Good',
        wakeRefreshed: 'Often',
        approximateScreenTimeHours: '5h',
        notificationInterruptions: 'Low',
        biggestDistraction: 'Phone',
        note: 'Listened to ambient nature sounds while reading.',
      },
    ],
    streak: 3,
    lastCheckInDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  }

  return [demoUser]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserAccount[]>(getInitialUsers)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_USER_KEY) || (getInitialUsers()[0]?.id ?? null)
  })

  // Synchronize users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch (e) {
      console.error(e)
    }
  }, [users])

  // Synchronize active user ID
  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(CURRENT_USER_KEY, currentUserId)
      } else {
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    } catch (e) {
      console.error(e)
    }
  }, [currentUserId])

  const currentUser = users.find(u => u.id === currentUserId) || null

  const login = (email: string, name?: string): UserAccount => {
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    if (existing) {
      setCurrentUserId(existing.id)
      return existing
    }
    // Automatically register if account doesn't exist
    return register(name || email.split('@')[0], email)
  }

  const register = (name: string, email: string): UserAccount => {
    const newUser: UserAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim() || 'MindEase Explorer',
      email: email.trim().toLowerCase(),
      joinedAt: new Date().toISOString(),
      assessmentCompleted: false,
      dailyCheckIns: [],
      streak: 0,
    }

    setUsers(prev => {
      const filtered = prev.filter(u => u.email !== newUser.email)
      return [...filtered, newUser]
    })
    setCurrentUserId(newUser.id)
    return newUser
  }

  const logout = () => {
    setCurrentUserId(null)
  }

  const saveAssessment = (responses: Record<string, string | number>, report: AssessmentResponse) => {
    if (!currentUserId) return
    const today = new Date().toISOString().split('T')[0]

    setUsers(prev =>
      prev.map(u => {
        if (u.id !== currentUserId) return u
        const reportHistory = u.reportHistory || []
        return {
          ...u,
          assessmentCompleted: true,
          assessmentResponses: { ...(u.assessmentResponses || {}), ...responses },
          latestReport: report,
          reportHistory: [{ date: today, report }, ...reportHistory],
        }
      }),
    )
  }

  const saveCheckIn = (entry: Omit<CheckInEntry, 'id' | 'timestamp'>) => {
    if (!currentUserId) return
    const newEntry: CheckInEntry = {
      ...entry,
      id: `chk-${Date.now()}`,
      timestamp: Date.now(),
    }

    setUsers(prev =>
      prev.map(u => {
        if (u.id !== currentUserId) return u

        // Compute streak
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        let newStreak = u.streak || 0

        if (u.lastCheckInDate === yesterday) {
          newStreak += 1
        } else if (u.lastCheckInDate !== today) {
          newStreak = 1
        }

        const existingCheckIns = u.dailyCheckIns || []
        return {
          ...u,
          dailyCheckIns: [...existingCheckIns, newEntry],
          streak: newStreak,
          lastCheckInDate: today,
        }
      }),
    )
  }

  const saveCognitiveScores = (scores: Partial<CognitiveScores>) => {
    if (!currentUserId) return
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== currentUserId) return u
        const updatedCognitive = { ...(u.cognitiveScores || {}), ...scores }
        return {
          ...u,
          cognitiveScores: updatedCognitive,
          assessmentResponses: { ...(u.assessmentResponses || {}), ...(scores as any) },
        }
      }),
    )
  }

  const retakeAssessment = () => {
    if (!currentUserId) return
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== currentUserId) return u
        return {
          ...u,
          assessmentCompleted: false,
        }
      }),
    )
  }

  const updateProfileName = (name: string) => {
    if (!currentUserId) return
    setUsers(prev =>
      prev.map(u => (u.id === currentUserId ? { ...u, name: name.trim() } : u)),
    )
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        saveAssessment,
        saveCheckIn,
        saveCognitiveScores,
        retakeAssessment,
        updateProfileName,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

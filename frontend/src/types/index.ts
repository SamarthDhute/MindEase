export type Theme = 'forest' | 'ocean' | 'sakura' | 'rainy' | 'mountain' | 'starry'
export type Mode = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
  id: Theme
  label: string
  emoji: string
  description: string
  particles: 'leaves' | 'waves' | 'petals' | 'rain' | 'clouds' | 'stars'
}

export const THEMES: ThemeConfig[] = [
  { id: 'forest',   label: 'Forest',          emoji: '🌿', description: 'Lush green tranquility', particles: 'leaves' },
  { id: 'ocean',    label: 'Ocean',            emoji: '🌊', description: 'Deep, calming waves',   particles: 'waves'  },
  { id: 'sakura',   label: 'Sakura',           emoji: '🌸', description: 'Gentle blossom drift',  particles: 'petals' },
  { id: 'rainy',    label: 'Rainy Library',    emoji: '🌧', description: 'Cozy rain & soft light', particles: 'rain'  },
  { id: 'mountain', label: 'Mountain Morning', emoji: '☁',  description: 'Misty peaks at dawn',   particles: 'clouds' },
  { id: 'starry',   label: 'Starry Night',     emoji: '🌌', description: 'Peaceful cosmos above',  particles: 'stars' },
]

export interface AssessmentQuestion {
  id: string
  section: string
  sectionIndex: number
  question: string
  type: 'select' | 'multi-select' | 'scale' | 'binary' | 'number'
  options?: string[]
  multiSelect?: boolean
  binaryFeatureMap?: Record<string, string> // option label -> dataset binary column
  min?: number
  max?: number
  step?: number
  unit?: string
  icon?: string
  hint?: string
  featureKey: string
}

export interface CognitiveScores {
  reaction_time_ms?: number
  attention_accuracy_percentage?: number
  missed_targets?: number
  visual_attention_score?: number
  focus_flow_distraction_count?: number
  focus_recovery_time_seconds?: number
  memory_score?: number
  stroop_accuracy_percentage?: number
  task_switch_accuracy?: number
}

export interface ContributingFactor {
  feature: string
  label: string
  answer: string | number
  confidence_change_percentage_points: number
  explanation: string
}

export interface GlobalFactor {
  feature: string
  label: string
  importance: number
  note: string
}

export interface AssessmentResponse {
  attention_interference_level: 'Minimal' | 'Low' | 'Moderate' | 'High'
  confidence_percentage: number
  explanation: string
  contributing_factors: ContributingFactor[]
  personalized_suggestions: string[]
  global_model_factors: GlobalFactor[]
  disclaimer: string
}

export interface CheckInEntry {
  id: string
  date: string // e.g. "2026-10-07"
  timestamp: number
  mood: number // 1 to 5
  energy: number // 1 to 5
  focus: number // 1 to 5
  sleepQuality?: string
  wakeRefreshed?: boolean | string
  approximateScreenTimeHours?: string | number
  notificationInterruptions?: string
  biggestDistraction?: string
  note?: string
}

export interface UserAccount {
  id: string
  name: string
  email: string
  password?: string
  avatar?: string
  joinedAt: string
  assessmentCompleted: boolean
  assessmentResponses?: Record<string, string | number>
  latestReport?: AssessmentResponse
  reportHistory?: Array<{ date: string; report: AssessmentResponse }>
  cognitiveScores?: CognitiveScores
  dailyCheckIns: CheckInEntry[]
  streak: number
  lastCheckInDate?: string
}

export interface UserProfile {
  name: string
  avatar?: string
  joinedAt: string
  assessmentCount: number
  streak: number
}

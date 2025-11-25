// Daily.co Video Session Configuration
// This handles all video/audio functionality

export const DAILY_CONFIG = {
  // Get your API key from: https://dashboard.daily.co/
  // NOTE: This is a server-side only key - never expose to client
  apiKey: process.env.DAILY_API_KEY || '',
  domain: process.env.DAILY_DOMAIN || '',
  
  // Room settings
  roomDefaults: {
    privacy: 'private',
    properties: {
      enable_screenshare: true,
      enable_chat: true,
      enable_knocking: true,
      enable_prejoin_ui: false,
      start_video_off: false,
      start_audio_off: false,
      max_participants: 2, // 1 expert + 1 candidate
      exp: Math.floor(Date.now() / 1000) + (60 * 90), // 90 min expiry
      enable_recording: 'cloud', // Auto-record to cloud
      enable_recording_ui: true,
    }
  },
  
  // Meeting token settings
  tokenConfig: {
    is_owner: false,
    enable_screenshare: true,
    enable_recording: true,
  }
}

export interface DailyRoom {
  id: string
  name: string
  url: string
  created_at: string
  config: {
    exp?: number
    max_participants?: number
    enable_recording?: string
  }
}

export interface DailyMeetingToken {
  token: string
  room_name: string
}

// API client for Daily.co
export class DailyAPI {
  private apiKey: string
  private baseUrl = 'https://api.daily.co/v1'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || DAILY_CONFIG.apiKey
    if (!this.apiKey) {
      throw new Error('Daily.co API key not configured')
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Daily API error: ${response.status} - ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  // Create a new room
  async createRoom(name: string, properties = {}): Promise<DailyRoom> {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify({
        name,
        privacy: 'private',
        properties: {
          ...DAILY_CONFIG.roomDefaults.properties,
          ...properties,
        },
      }),
    })
  }

  // Get room details
  async getRoom(roomName: string): Promise<DailyRoom> {
    return this.request(`/rooms/${roomName}`)
  }

  // Delete room
  async deleteRoom(roomName: string): Promise<{ deleted: boolean }> {
    return this.request(`/rooms/${roomName}`, {
      method: 'DELETE',
    })
  }

  // Create meeting token for user
  async createMeetingToken(
    roomName: string,
    options: {
      user_name?: string
      is_owner?: boolean
      enable_recording?: boolean
    } = {}
  ): Promise<DailyMeetingToken> {
    return this.request('/meeting-tokens', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: options.user_name,
          is_owner: options.is_owner || false,
          enable_screenshare: true,
          enable_recording: options.enable_recording || false,
        },
      }),
    })
  }

  // List recordings for a room
  async getRecordings(roomName: string) {
    return this.request(`/recordings?room_name=${roomName}`)
  }
}

// Singleton instance
let dailyAPI: DailyAPI | null = null

export function getDailyAPI(): DailyAPI {
  if (!dailyAPI) {
    dailyAPI = new DailyAPI()
  }
  return dailyAPI
}

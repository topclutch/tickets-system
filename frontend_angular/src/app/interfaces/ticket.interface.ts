export interface Ticket {
  id?: number
  title: string
  description: string
  status: "open" | "in_progress" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  user_id: number
  assigned_to?: number
  created_at?: string
  updated_at?: string
  user?: {
    name: string
    email: string
  }
  assigned_user?: {
    name: string
    email: string
  }
}

export interface CreateTicketRequest {
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  user_id: number
  assigned_to?: number
}

export interface UpdateTicketRequest extends CreateTicketRequest {
  id: number
  status: "open" | "in_progress" | "closed"
}

export interface ProductResponse {
  id: string
  name: string
  description: string
  reviewSummary: string|null
  reviews: ReviewResponse[]
}

export interface ReviewResponse {
  productId: string
  rating: number
  description: string
}

export interface ChatMessage{
  role: number, // 0: AI, 1: user
  text: string
}
export interface ApiResponse<T = any> {
    success: boolean
    message?: string
    data?: T
  }
  
  export interface MemberData {
    id: string
    name: string
    email: string
    phone: string
    country: string
    expirationDate: string
    personalDetails: {
      father: string
      address: string
      bloodGroup: string
    }
    payments: Array<{
      year: number
      amount: number
    }>
  }
  
  export interface LoginCredentials {
    username: string
    password: string
  }
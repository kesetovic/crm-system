export interface AuthResponse {
    token: string,
    expiration: Date,
    username: string,
    roles: string[],
    userId: string,
    twilioNumber: string
}
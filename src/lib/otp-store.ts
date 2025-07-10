// In-memory store for OTPs (in production, use Redis or database)
export const otpStore = new Map<string, { 
  otp: string
  expires: number
  requestData: { 
    email: string
    password: string
    fullName: string 
  } 
}>()

// Store OTP
export function storeOTP(email: string, otp: string, requestData: { full_name: string, password: string }) {
  const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
  otpStore.set(email, {
    otp,
    expires,
    requestData: {
      email,
      password: requestData.password,
      fullName: requestData.full_name
    }
  })
}

// Verify OTP
export function verifyOTP(email: string, otp: string) {
  const stored = otpStore.get(email)
  if (!stored) return null
  
  if (stored.otp !== otp) return null
  if (Date.now() > stored.expires) {
    otpStore.delete(email)
    return null
  }
  
  const requestData = stored.requestData
  otpStore.delete(email) // Remove used OTP
  return requestData
}

// Clean up expired OTPs
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of otpStore.entries()) {
    if (now > value.expires) {
      otpStore.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes

import crypto from 'crypto'
import { PhonePePaymentRequest, PhonePePaymentResponse } from '@/types'

const PHONEPE_BASE_URL = process.env.PHONEPE_ENVIRONMENT === 'production' 
  ? 'https://api.phonepe.com/apis/hermes'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox'

export class PhonePeService {
  private merchantId: string
  private merchantKey: string
  private merchantUserId: string

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID!
    this.merchantKey = process.env.PHONEPE_MERCHANT_KEY!
    this.merchantUserId = process.env.PHONEPE_MERCHANT_USER_ID!
  }

  private generateChecksum(payload: string): string {
    const string = payload + '/pg/v1/pay' + this.merchantKey
    return crypto.createHash('sha256').update(string).digest('hex') + '###1'
  }

  private generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  }

  async initiatePayment(
    amount: number,
    callbackUrl: string
  ): Promise<{ success: boolean; redirectUrl?: string; error?: string }> {
    try {
      const transactionId = this.generateTransactionId()
      
      const paymentRequest: PhonePePaymentRequest = {
        merchantId: this.merchantId,
        merchantTransactionId: transactionId,
        amount: amount * 100, // Convert to paise
        callbackUrl,
        merchantUserId: this.merchantUserId,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      }

      const payload = Buffer.from(JSON.stringify(paymentRequest)).toString('base64')
      const checksum = this.generateChecksum(payload)

      const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
        body: JSON.stringify({
          request: payload
        })
      })

      const data = await response.json()

      if (data.success) {
        return {
          success: true,
          redirectUrl: data.data.instrumentResponse.redirectInfo.url
        }
      } else {
        return {
          success: false,
          error: data.message || 'Payment initiation failed'
        }
      }
    } catch (error) {
      console.error('PhonePe payment error:', error)
      return {
        success: false,
        error: 'Payment service error'
      }
    }
  }

  async verifyPayment(
    transactionId: string
  ): Promise<PhonePePaymentResponse> {
    try {
      const checksum = crypto
        .createHash('sha256')
        .update(`/pg/v1/status/${this.merchantId}/${transactionId}${this.merchantKey}`)
        .digest('hex') + '###1'

      const response = await fetch(
        `${PHONEPE_BASE_URL}/pg/v1/status/${this.merchantId}/${transactionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': this.merchantId,
          }
        }
      )

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Payment verification error:', error)
      return {
        success: false,
        code: 'PAYMENT_ERROR',
        message: 'Payment verification failed'
      }
    }
  }

  async processRefund(
    transactionId: string,
    amount: number
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    try {
      const refundId = `REF_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      
      const refundRequest = {
        merchantId: this.merchantId,
        merchantTransactionId: refundId,
        originalTransactionId: transactionId,
        amount: amount * 100, // Convert to paise
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepe/refund-callback`
      }

      const payload = Buffer.from(JSON.stringify(refundRequest)).toString('base64')
      const checksum = this.generateChecksum(payload)

      const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
        body: JSON.stringify({
          request: payload
        })
      })

      const data = await response.json()

      if (data.success) {
        return {
          success: true,
          refundId: refundId
        }
      } else {
        return {
          success: false,
          error: data.message || 'Refund initiation failed'
        }
      }
    } catch (error) {
      console.error('PhonePe refund error:', error)
      return {
        success: false,
        error: 'Refund service error'
      }
    }
  }
}

export const phonePeService = new PhonePeService()

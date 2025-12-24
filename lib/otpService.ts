export class OTPService {
  // Generate a 6-digit OTP
  static async generateOtp(): Promise<number> {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // Set OTP validity (5 minutes)
  static async generateOtpValidTill(): Promise<Date> {
    return new Date(Date.now() + 5 * 60 * 1000);
  }
}

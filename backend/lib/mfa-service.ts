/**
 * MFA Service - simplified for production deployment
 * Full MFA implementation temporarily disabled
 */

export function generateMFASecret(_email: string) {
  return {
    secret: 'PLACEHOLDER',
    qrCode: '',
    backupCodes: [],
  }
}

export function verifyTOTP(_secret: string, _token: string): boolean {
  return false
}

export function generateBackupCodes(): string[] {
  return []
}

export function hashBackupCodes(codes: string[]): string[] {
  return codes
}

export function verifyHashedBackupCode(
  _inputCode: string,
  hashedCodes: string[]
): { valid: boolean; remainingCodes: string[] } {
  return { valid: false, remainingCodes: hashedCodes }
}

export function isMFASetupComplete(
  mfaSecret: string | null,
  mfaBackupCodes: string[]
): boolean {
  return Boolean(mfaSecret) && mfaBackupCodes.length > 0
}

export function getCurrentTOTPToken(_secret: string): string | null {
  return null
}

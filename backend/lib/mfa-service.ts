import speakeasy from 'speakeasy'
import * as crypto from 'crypto'

/**
 * MFA (Multi-Factor Authentication) Service
 * Handles TOTP generation, verification, and backup codes
 */

const BACKUP_CODES_COUNT = 10
const BACKUP_CODE_LENGTH = 8
const ALGORITHM = 'sha1'
const DIGITS = 6
const STEP = 30

/**
 * Generate MFA secret and backup codes for a user
 */
export function generateMFASecret(email: string) {
  const secret = speakeasy.generateSecret({
    name: `Portfolio Admin (${email})`,
    issuer: 'Portfolio Admin',
    length: 32,
  })

  const backupCodes = generateBackupCodes()

  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url,
    backupCodes,
  }
}

/**
 * Verify TOTP token
 */
export function verifyTOTP(secret: string, token: string): boolean {
  try {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      algorithm: ALGORITHM,
      digits: DIGITS,
      step: STEP,
      window: 2, // Allow 2 time steps (±1 step for clock skew)
    })

    return verified ?? false
  } catch (error) {
    console.error('TOTP verification error:', error)
    return false
  }
}

/**
 * Generate backup codes
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = []

  for (let i = 0; i < BACKUP_CODES_COUNT; i++) {
    const code = crypto
      .randomBytes(BACKUP_CODE_LENGTH / 2)
      .toString('hex')
      .toUpperCase()
      .slice(0, BACKUP_CODE_LENGTH)

    codes.push(code)
  }

  return codes
}

/**
 * Verify and consume backup code
 */
export function verifyBackupCode(
  inputCode: string,
  backupCodes: string[]
): { valid: boolean; remainingCodes: string[] } {
  const normalizedInput = inputCode.toUpperCase().replace(/\s/g, '')

  // Find matching code
  const index = backupCodes.findIndex(
    (code) => code.toUpperCase() === normalizedInput
  )

  if (index === -1) {
    return { valid: false, remainingCodes: backupCodes }
  }

  // Remove used code
  const updatedCodes = backupCodes.filter((_, i) => i !== index)

  return { valid: true, remainingCodes: updatedCodes }
}

/**
 * Hash backup codes for storage (never store in plain text)
 */
export function hashBackupCodes(codes: string[]): string[] {
  return codes.map((code) =>
    crypto
      .createHash('sha256')
      .update(code)
      .digest('hex')
  )
}

/**
 * Verify backup code against hashed codes
 */
export function verifyHashedBackupCode(
  inputCode: string,
  hashedCodes: string[]
): { valid: boolean; remainingCodes: string[] } {
  const normalizedInput = inputCode.toUpperCase().replace(/\s/g, '')
  const inputHash = crypto
    .createHash('sha256')
    .update(normalizedInput)
    .digest('hex')

  // Find matching code
  const index = hashedCodes.findIndex((code) => code === inputHash)

  if (index === -1) {
    return { valid: false, remainingCodes: hashedCodes }
  }

  // Remove used code
  const updatedCodes = hashedCodes.filter((_, i) => i !== index)

  return { valid: true, remainingCodes: updatedCodes }
}

/**
 * Check if MFA setup is complete
 */
export function isMFASetupComplete(
  mfaSecret: string | null,
  mfaBackupCodes: string[]
): boolean {
  return Boolean(mfaSecret) && mfaBackupCodes.length > 0
}

/**
 * Generate current TOTP token (for testing/debugging - never use in frontend)
 */
export function getCurrentTOTPToken(secret: string): string | null {
  try {
    const token = speakeasy.totp({
      secret,
      encoding: 'base32',
      algorithm: ALGORITHM,
      digits: DIGITS,
      step: STEP,
    })
    return token
  } catch (error) {
    console.error('Error generating TOTP token:', error)
    return null
  }
}

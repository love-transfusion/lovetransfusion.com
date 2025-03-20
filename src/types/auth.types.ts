export interface I_Auth_LoginRequiredData {
  email: string
  password: string
}

/**
 * Defines the possible roles for authenticated users.
 *
 * - `'admin'` → Has full access to the system.
 * - `'editor'` → Can edit content but has limited permissions.
 */
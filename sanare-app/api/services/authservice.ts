import { Provider } from '../models';

/**
 * Authenticates a provider using providerid and password.
 * For now, compares plain text passwords. Later, swap for Keycloak or hashed passwords.
 * @param providerid - The provider's unique ID
 * @param password - The provider's password
 * @returns The provider object (without password) if successful, or null if failed
 */
export async function authenticateProvider(providerid: string, password: string) {
  const provider = await Provider.findOne({ where: { providerid } });
  if (!provider) return null;
  // For now, compare plain text passwords. Replace with hash or Keycloak later.
  if (provider.password !== password) return null;
  // Exclude password from returned object
  const { password: _pw, ...providerData } = provider.get({ plain: true });
  return providerData;
}

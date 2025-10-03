import {
  _generateLinkResponse,
  _noResolveJsonResponse,
  _request,
  _userResponse,
} from './lib/fetch'
import { resolveFetch } from './lib/helpers'
import { isAuthError } from './lib/errors'

export default class GoTrueAdminApi {
  /** Contains all MFA administration methods. */
  mfa

  constructor({ url = '', headers = {}, fetch } = {}) {
    this.url = url
    this.headers = headers
    this.fetch = resolveFetch(fetch)
    this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this),
    }
  }

  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout scope: 'global' | 'local' | 'others'
   */
  async signOut(jwt, scope = 'global') {
    try {
      await _request(this.fetch, 'POST', `${this.url}/logout?scope=${scope}`, {
        headers: this.headers,
        jwt,
        noResolveJson: true,
      })
      return { data: null, error: null }
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error }
      }
      throw error
    }
  }

  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   */
  async inviteUserByEmail(email, options = {}) {
    try {
      return await _request(this.fetch, 'POST', `${this.url}/invite`, {
        body: { email, data: options.data },
        headers: this.headers,
        redirectTo: options.redirectTo,
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }
      throw error
    }
  }

  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   */
  async generateLink(params) {
    try {
      const { options, ...rest } = params
      const body = { ...rest, ...options }
      if ('newEmail' in rest) {
        // replace newEmail with new_email in request body
        body.new_email = rest?.newEmail
        delete body['newEmail']
      }
      return await _request(this.fetch, 'POST', `${this.url}/admin/generate_link`, {
        body,
        headers: this.headers,
        xform: _generateLinkResponse,
        redirectTo: options?.redirectTo,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return {
          data: {
            properties: null,
            user: null,
          },
          error,
        }
      }
      throw error
    }
  }

  // User Admin API

  /** Creates a new user. (Server-side use only.) */
  async createUser(attributes) {
    try {
      return await _request(this.fetch, 'POST', `${this.url}/admin/users`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }
      throw error
    }
  }

  /**
   * Get a list of users (paginated).
   * @param params { page?: number, perPage?: number }
   */
  async listUsers(params) {
    try {
      const pagination = { nextPage: null, lastPage: 0, total: 0 }
      const response = await _request(this.fetch, 'GET', `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: params?.page?.toString() ?? '',
          per_page: params?.perPage?.toString() ?? '',
        },
        xform: _noResolveJsonResponse,
      })
      if (response.error) throw response.error

      const users = await response.json()
      const total = response.headers.get('x-total-count') ?? 0
      const links = response.headers.get('link')?.split(',') ?? []
      if (links.length > 0) {
        links.forEach((link) => {
          const page = parseInt(link.split(';')[0].split('=')[1].substring(0, 1), 10)
          const rel = JSON.parse(link.split(';')[1].split('=')[1])
          pagination[`${rel}Page`] = page
        })
        pagination.total = parseInt(total, 10)
      }
      return { data: { ...users, ...pagination }, error: null }
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { users: [] }, error }
      }
      throw error
    }
  }

  /** Get user by id. (Server-side use only.) */
  async getUserById(uid) {
    try {
      return await _request(this.fetch, 'GET', `${this.url}/admin/users/${uid}`, {
        headers: this.headers,
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }
      throw error
    }
  }

  /** Update user by id. (Server-side use only.) */
  async updateUserById(uid, attributes) {
    try {
      return await _request(this.fetch, 'PUT', `${this.url}/admin/users/${uid}`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }
      throw error
    }
  }

  /**
   * Delete a user. Requires a `service_role` key.
   * @param id
   * @param shouldSoftDelete Soft-delete, not reversible.
   */
  async deleteUser(id, shouldSoftDelete = false) {
    try {
      return await _request(this.fetch, 'DELETE', `${this.url}/admin/users/${id}`, {
        headers: this.headers,
        body: {
          should_soft_delete: shouldSoftDelete,
        },
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }
      throw error
    }
  }

  async _listFactors(params) {
    try {
      const { data, error } = await _request(
        this.fetch,
        'GET',
        `${this.url}/admin/users/${params.userId}/factors`,
        {
          headers: this.headers,
          xform: (factors) => {
            return { data: { factors }, error: null }
          },
        }
      )
      return { data, error }
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error }
      }
      throw error
    }
  }

  async _deleteFactor(params) {
    try {
      const data = await _request(
        this.fetch,
        'DELETE',
        `${this.url}/admin/users/${params.userId}/factors/${params.id}`,
        {
          headers: this.headers,
        }
      )
      return { data, error: null }
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error }
      }
      throw error
    }
  }
}


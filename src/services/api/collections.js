/**
 * @typedef {Object} PagedCollectionArgs
 * @property {number=} page
 * @property {number=} size
 * @property {number=} limit
 * @property {number=} offset
 */

const asRecord = (value) =>
  value && typeof value === 'object' ? value : undefined

const asArray = (value) => (Array.isArray(value) ? value : [])

/**
 * @template T
 * @param {unknown} payload
 * @returns {{ list: T[], total: number }}
 */
export const readPagedResponse = (payload) => {
  const root = asRecord(payload) || {}
  const source = asRecord(root.data) || root

  const list =
    asArray(source.list).length > 0
      ? asArray(source.list)
      : asArray(source.items).length > 0
        ? asArray(source.items)
        : asArray(source.rows).length > 0
          ? asArray(source.rows)
          : asArray(source.posts).length > 0
            ? asArray(source.posts)
            : asArray(source.courses)

  const totalRaw = source.total ?? source.totalPages ?? source.total_count ?? source.count ?? 0
  const total =
    typeof totalRaw === 'number'
      ? totalRaw
      : typeof totalRaw === 'string' && totalRaw.trim() && !Number.isNaN(Number(totalRaw))
        ? Number(totalRaw)
        : 0

  return {
    list,
    total,
  }
}

/**
 * @template T
 * @param {{ post: (path: string, payload: unknown) => Promise<{ success: boolean, status: number, error?: string, data?: unknown, token?: string }> }} client
 * @param {string=} searchPath
 */
export const createPagedCollectionFetcher = (client, searchPath = '/search') => {
  /**
   * @param {PagedCollectionArgs} args
   */
  return async (args = {}) => {
    const page = typeof args.page === 'number' ? args.page : 1
    const size =
      typeof args.size === 'number'
        ? args.size
        : typeof args.limit === 'number'
          ? args.limit
          : 20

    const payload = {
      ...args,
      page,
      size,
    }

    const result = await client.post(searchPath, payload)
    if (!result.success) {
      return result
    }

    return {
      ...result,
      data: readPagedResponse(result.data),
    }
  }
}

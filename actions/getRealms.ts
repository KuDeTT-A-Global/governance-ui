import { getRealms } from '@solana/spl-governance'
import { Connection, PublicKey } from '@solana/web3.js'
import { notify } from '@utils/notifications'

// Use a more reliable RPC endpoint with higher rate limits
const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com",
  'confirmed'
)

const GOVERNANCE_PROGRAM_ID = new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw')

export const fetchRealms = async () => {
  try {
    // Add connection status check
    const status = await connection.getVersion()
    if (!status) {
      throw new Error('Connection failed')
    }

    const realms = await getRealms(connection, GOVERNANCE_PROGRAM_ID)
    
    // Add validation for returned realms
    if (!realms || !Object.keys(realms).length) {
      throw new Error('No realms found')
    }

    return realms

  } catch (error) {
    // Enhanced error handling with specific error types
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Error fetching realms:', errorMessage)
    
    // User notification
    notify({
      type: 'error',
      message: `Failed to fetch realms: ${errorMessage}`,
    })

    return []
  }
}

// Add retry mechanism
export const fetchRealmsWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const realms = await fetchRealms()
      if (realms.length) return realms
    } catch (e) {
      if (i === retries - 1) throw e
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  return []
}

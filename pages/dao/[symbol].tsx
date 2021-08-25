import { useRouter } from 'next/router'
import useWalletStore from '../../stores/useWalletStore'
import useRealm from '../../hooks/useRealm'
import React from 'react'
import ProposalFilter from '../../components/ProposalFilter'
import ProposalCard from '../../components/ProposalCard'
import Button from '../../components/Button'

export const ProposalStateLabels = {
  0: 'Draft',
  1: 'Draft',
  2: 'Active',
  3: 'Approved',
  4: 'Approved',
  5: 'Approved',
  6: 'Cancelled',
  7: 'Denied',
  8: 'Error',
}

const DAO = () => {
  const router = useRouter()
  const { symbol } = router.query

  const wallet = useWalletStore((s) => s.current)
  const { mint, proposals, realmTokenAccount, ownTokenRecord } = useRealm(
    symbol as string
  )

  // DEBUG print remove
  console.log(
    'governance page tokenAccount',
    realmTokenAccount && realmTokenAccount.publicKey.toBase58()
  )

  console.log(
    'governance page wallet',
    wallet?.connected && wallet.publicKey.toBase58()
  )

  console.log(
    'governance page tokenRecord',
    wallet?.connected && ownTokenRecord
  )

  const displayedProposal = Object.entries(proposals)
    .filter(([_k, v]) => v.info.votingAt)
    .sort(
      (a, b) => b[1].info.votingAt.toNumber() - a[1].info.votingAt.toNumber()
    )

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2>{`${displayedProposal.length} proposals`}</h2>
            <ProposalFilter />
          </div>
          {displayedProposal.map(([k, v]) => (
            <ProposalCard key={k} id={k} mint={mint} proposal={v['info']} />
          ))}
        </div>
        <div className="col-span-4">
          <div className="bg-bkg-2 col-span-4 p-6 rounded-md space-y-6">
            <h3 className="mb-4">MNGO balance</h3>

            <div className="flex space-x-4 items-center">
              <div>Deposited</div>
              <div className="col-span-3 bg-bkg-3 p-4 rounded">
                <div className="text-xl">
                  {ownTokenRecord
                    ? ownTokenRecord.info.governingTokenDepositAmount.toNumber()
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <div>In Wallet</div>
              <div className="col-span-3 bg-bkg-3 p-4 rounded">
                <div className="text-xl">
                  {realmTokenAccount
                    ? realmTokenAccount.account.amount.toString()
                    : 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button className="w-1/2">Deposit</Button>
              <Button className="w-1/2">Withdraw</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DAO
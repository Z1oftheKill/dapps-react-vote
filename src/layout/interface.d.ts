export interface WalletDialogProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  setAccount: (e: AccountType) => void
}

export interface WalletType {
  icon: string
  label: string
}

export interface AccountType {
  address: string
  balance: bigint
}

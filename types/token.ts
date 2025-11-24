export type TokenItemDataType = {
    token: string
    tokenType: string
    supply: number
    decimals: number
    name: string
    symbol: string
    metadataUri: string
    creator: string
    hardcap: number
    marketCapUsd: number
    holders: number
    priceSol: number
    mint_time?: number
    pool?: string
    txCount?: number
    isMigrated?: boolean
    migrationPool?: string | null
    photo?: string
    description?: string | null
    website?: string | null
    x?: string | null
    telegram?: string | null
    lastTradeExecutionPositionKey?: string | null
    lastTradeId?: string | null
    priceUsd?: number
    buys?: number
    sells?: number
    volumeSol?: number
    volumeUsd?: number
    version?: number
    list_time?: number
    last_tx_time?: number
    progress?: number
    progressSol?: number
    _balanceSol?: number
    _balanceTokens?: number
    configAddress?: string | null
}

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TokenItemDataType } from "@/types/token"
import { FC, memo } from "react"
import TableItem from "./TableItem"

type WebSocketPushMessage = {
    push?: {
        pub?: {
            data?: TokenItemDataType
        }
    }
    [key: string]: unknown
}

const TokensTable: FC<{ tokens: WebSocketPushMessage[] }> = memo(({ tokens }) => {
    return (
        <div className="w-full max-w-7xl bg-background/6">
            <div className="[&>div]:rounded-sm [&>div]:border ">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="min-w-[200px]">Token</TableHead>
                            <TableHead className="min-w-[180px]">CA</TableHead>
                            <TableHead className="min-w-[110px] text-right">Volume</TableHead>
                            <TableHead className="min-w-[130px] text-right">Market Cap</TableHead>
                            <TableHead className="min-w-[150px]">Progress</TableHead>
                            <TableHead className="min-w-[100px] text-right">Holders</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tokens.map((item, index) => {
                            const tokenData = item.push?.pub?.data
                            if (!tokenData || !tokenData.token) return null

                            const uniqueKey = tokenData.token || `token-${index}`

                            return <TableItem key={uniqueKey} tokenData={tokenData} />
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
})

TokensTable.displayName = "TokensTable"

export default TokensTable

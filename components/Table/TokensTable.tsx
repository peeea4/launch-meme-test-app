import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TokenItemDataType } from "@/types/token"
import { FC } from "react"
import TableItem from "./TableItem"

type WebSocketPushMessage = {
    push?: {
        pub?: {
            data?: TokenItemDataType
        }
    }
    [key: string]: unknown
}

const TokensTable: FC<{ tokens: WebSocketPushMessage[] }> = ({ tokens }) => {
    const getTokenKey = (data: TokenItemDataType, index: number): string => {
        return `${data.creator}-${data.token}-${index}`
    }

    return (
        <div className="w-full max-w-5xl">
            <div className="[&>div]:rounded-sm [&>div]:border ">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Token</TableHead>
                            <TableHead>CA</TableHead>
                            <TableHead>Volume</TableHead>
                            <TableHead>Market Cap</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Holders</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tokens.map((item, index) => {
                            const tokenData = item.push?.pub?.data
                            if (!tokenData) return null

                            return (
                                <TableItem
                                    key={getTokenKey(tokenData, index)}
                                    tokenData={tokenData}
                                />
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TokensTable

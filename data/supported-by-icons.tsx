import { TokenETH } from "@web3icons/react"
import { TokenSOL } from "@web3icons/react"
import { ExchangeBybit } from "@web3icons/react"
import { ExchangeKraken } from "@web3icons/react"
import { TokenPOLYX } from "@web3icons/react"
import { TokenMBX } from "@web3icons/react"

export const supportedByIcons = [
    {
        icon: <TokenSOL variant="branded" key="sol" size={64} />,
        title: "SOL",
        colors: [
            [45, 148, 255],
            [116, 201, 255],
            [0, 87, 255],
        ],
    },
    {
        icon: <TokenETH variant="branded" key="eth" size={64} />,
        title: "ETH",
        colors: [
            [99, 125, 240],
            [49, 88, 210],
            [130, 153, 248],
        ],
    },
    {
        icon: <ExchangeKraken variant="branded" key="kraken" size={64} />,
        title: "Kraken",
        colors: [
            [75, 0, 130],
            [88, 24, 141],
            [102, 51, 153],
        ],
    },
    {
        icon: <TokenPOLYX variant="branded" key="polyx" size={64} />,
        title: "POLYX",
        colors: [
            [138, 43, 226],
            [153, 50, 204],
            [186, 85, 211],
        ],
    },
    {
        icon: <TokenMBX variant="branded" key="mbx" size={64} />,
        title: "MBX",
        colors: [
            [75, 0, 130],
            [60, 0, 110],
            [50, 0, 90],
        ],
    },
    {
        icon: <ExchangeBybit variant="branded" key="bybit" size={64} />,
        title: "Bybit",
        colors: [
            [253, 186, 18],
            [255, 215, 0],
            [200, 160, 15],
        ],
    },
]

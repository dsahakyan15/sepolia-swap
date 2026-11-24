import ethIcon from "cryptocurrency-icons/svg/color/eth.svg";
import linkIcon from "cryptocurrency-icons/svg/color/link.svg";
import uniIcon from "cryptocurrency-icons/svg/color/uni.svg";
import usdcIcon from "cryptocurrency-icons/svg/color/usdc.svg";
import wethIcon from "@/assets/tokens/weth.svg";
import { NATIVE_ADDRESS, type Token } from "@/types/token";
import { contracts } from "./contracts";

export const ETH: Token = {
  address: NATIVE_ADDRESS,
  symbol: "ETH",
  name: "Sepolia Ether",
  decimals: 18,
  logoURI: ethIcon,
};

/** Токены по умолчанию в окне выбора. Свои токены пользователь может импортировать по адресу. */
export const DEFAULT_TOKENS: Token[] = [
  ETH,
  { address: contracts.weth.address, symbol: "WETH", name: "Wrapped Ether", decimals: 18, logoURI: wethIcon },
  {
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: usdcIcon,
  },
  { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", symbol: "UNI", name: "Uniswap", decimals: 18, logoURI: uniIcon },
  {
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    symbol: "LINK",
    name: "Chainlink",
    decimals: 18,
    logoURI: linkIcon,
  },
];

import type { Address } from "viem";
import { uniswapV2FactoryAbi, uniswapV2Router02Abi, wethAbi } from "@/abi";

/**
 * Реестр контрактов приложения (Sepolia).
 *
 * Каждая запись хранит { address, abi }, поэтому её можно передавать
 * в wagmi/viem как есть:
 *
 *   useReadContract({ ...contracts.uniswapV2Router, functionName: "WETH" })
 *
 * Чтобы добавить свой контракт:
 *   1. Положите ABI в src/abi/<name>.ts и экспортируйте его из src/abi/index.ts
 *   2. Добавьте запись сюда
 *   3. Напишите функции чтения в src/services и хук в src/hooks
 *
 * Адреса Uniswap V2: https://docs.uniswap.org/contracts/v2/reference/smart-contracts/v2-deployments
 */
export const contracts = {
  uniswapV2Router: {
    address: "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3" as Address,
    abi: uniswapV2Router02Abi,
  },
  uniswapV2Factory: {
    address: "0xF62c03E08ada871A0bEb309762E260a7a6a880E6" as Address,
    abi: uniswapV2FactoryAbi,
  },
  weth: {
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" as Address,
    abi: wethAbi,
  },
} as const;

/** Комиссия Uniswap V2 за один хоп: 0.3% */
export const UNISWAP_V2_FEE_BPS = 30n;

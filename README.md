# Sepolia Swap

DEX-интерфейс для обмена токенов через **Uniswap V2** в тестовой сети **Sepolia** с **MetaMask**.

Стек: Vite, React 19, TypeScript, [wagmi 2](https://wagmi.sh), [viem 2](https://viem.sh), TanStack Query.

## Запуск

```powershell
npm.cmd install
npm.cmd run dev        # http://localhost:5173
```

> В PowerShell используйте `npm.cmd`, либо один раз выполните
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, и тогда обычный `npm` тоже заработает.

| Команда | Что делает |
|---|---|
| `npm run dev` | dev-сервер с hot reload |
| `npm run build` | проверка типов и production-сборка в `dist/` |
| `npm run typecheck` | только проверка типов |
| `npm run preview` | локальный просмотр собранного `dist/` |

Свой RPC (Alchemy, Infura): скопируйте `.env.example` в `.env` и заполните `VITE_SEPOLIA_RPC_URL`.

## Архитектура

Код разделён на слои. Каждый слой зависит только от слоёв выше себя в списке:

```
src/
├── abi/            ABI контрактов (human-readable через viem parseAbi, полностью типизированы)
├── types/          общие типы: Token, SwapQuote, SwapSettings
├── config/         конфигурация: сеть, адреса контрактов, токены, настройки, wagmi
├── lib/            чистые функции без React и сети: форматирование, математика свапа, ошибки
├── services/       чтение из блокчейна: функции принимают PublicClient, без React
├── hooks/          React-хуки: связывают services/wagmi с UI
├── components/     UI-компоненты (у каждого свой .module.css)
│   ├── layout/     Header, Footer, ConnectButton, NetworkBadge
│   ├── swap/       SwapCard и его части, swapButtonState (логика главной кнопки)
│   ├── tokens/     выбор токена, импорт по адресу
│   └── common/     Modal, TxStatusMessage
├── app/            App и Providers (wagmi + react-query)
└── styles/         глобальные стили и CSS-переменные темы
```

Как проходит обмен:

1. `SwapCard` хранит выбранные токены и введённую сумму.
2. `useSwapQuote` вызывает `services/quote.ts`, тот вызывает `services/uniswapV2.ts` (`getAmountsOut` по маршрутам «напрямую» и «через WETH», выбирает лучший и считает влияние на цену по резервам пар).
3. `getSwapButtonState` (чистая функция) решает, что показать на кнопке: подключить, сменить сеть, approve или swap.
4. `useSwapActions` отправляет транзакцию, а `useTransaction` проводит её через статусы «подпись → ожидание → готово» и обновляет кэш (балансы, allowance).

## Как добавить свой контракт

Пример: свой контракт `MyVault` с методами `deposit(uint256)` и `balanceOf(address)`.

**1. ABI**: `src/abi/myVault.ts`

```ts
import { parseAbi } from "viem";

export const myVaultAbi = parseAbi([
  "function balanceOf(address user) view returns (uint256)",
  "function deposit(uint256 amount)",
  "event Deposited(address indexed user, uint256 amount)",
]);
```

Добавьте экспорт в `src/abi/index.ts`: `export { myVaultAbi } from "./myVault";`

> Если у вас JSON-ABI из Hardhat или Foundry, можно экспортировать его как есть:
> `export const myVaultAbi = [...] as const;` (обязательно `as const`, без этого не будет типизации).

**2. Адрес**: в `src/config/contracts.ts`

```ts
myVault: {
  address: "0x...." as Address,
  abi: myVaultAbi,
},
```

**3. Чтение**: хук в `src/hooks/useMyVaultBalance.ts`

```ts
import { useAccount, useReadContract } from "wagmi";
import { contracts } from "@/config/contracts";

export function useMyVaultBalance() {
  const { address } = useAccount();
  return useReadContract({
    ...contracts.myVault,
    functionName: "balanceOf", // автодополнение и проверка типов из ABI
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}
```

**4. Запись**: используйте общий `useTransaction`, он даст статусы, ссылку на Etherscan и обновление данных:

```ts
import { useWriteContract } from "wagmi";
import { contracts } from "@/config/contracts";
import { useTransaction } from "@/hooks/useTransaction";

export function useMyVaultDeposit() {
  const { writeContractAsync } = useWriteContract();
  const tx = useTransaction();

  const deposit = (amount: bigint) =>
    tx.run("Депозит", () =>
      writeContractAsync({ ...contracts.myVault, functionName: "deposit", args: [amount] }),
    );

  return { tx, deposit };
}
```

В компоненте покажите статус через `<TxStatusMessage tx={tx} />`.

Если логика чтения сложнее одного вызова (несколько вызовов, вычисления), вынесите её в `src/services/` как функцию от `PublicClient`, как сделано в `services/uniswapV2.ts`, и оберните в `useQuery`.

## Другие частые изменения

- **Токены по умолчанию**: `src/config/tokens.ts`
- **Проскальзывание, дедлайн, пороги влияния на цену**: `src/config/settings.ts`
- **Цвета темы**: CSS-переменные в `src/styles/global.css`
- **Другая сеть**: `src/config/chains.ts` (`appChain`) и адреса в `src/config/contracts.ts`

## Контракты (Sepolia)

| Контракт | Адрес |
|---|---|
| UniswapV2Router02 | `0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3` |
| UniswapV2Factory | `0xF62c03E08ada871A0bEb309762E260a7a6a880E6` |
| WETH | `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14` |

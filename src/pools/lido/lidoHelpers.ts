import { BaseProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { SwapInfo, SwapTypes, SwapV2 } from '../../types';
import { parseNewPool } from '../../pools';
import { ZERO, scale, bnum } from '../../bmath';
import { BigNumber } from 'utils/bignumber';
import { ZERO_ADDRESS, SubGraphPoolsBase } from '../../index';

export const Lido = {
    Networks: [1, 42],
    STETH: {
        1: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        42: '0x4803bb90d18a1cb7a2187344fe4feb0e07878d05',
    },
    WSTETHADDR: {
        1: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
        42: '0xa387b91e393cfb9356a460370842bc8dbb2f29af',
    },
    WETH: {
        1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        42: '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1',
    },
    DAI: {
        1: '0x6b175474e89094c44da98b954eedeac495271d0f',
        42: '0x04df6e4121c27713ed22341e7c7df330f56f289b',
    },
    USDC: {
        1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        42: '0xc2569dd7d0fd715b054fbf16e75b001e5c0c1115',
    },
    USDT: {
        1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        42: '0xcc08220af469192c53295fdd34cfb8df29aa17ab',
    },
    StaticPools: {
        // DAI/USDC/USDT
        staBal: {
            1: '0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000063',
            42: '0x5f304f6cf88dc76b414f301e05adfb5a429e8b670000000000000000000000f4',
        },
        // WETH/DAI (WETH/USDC on Kovan)
        wethDai: {
            1: '0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a',
            42: '0x3a19030ed746bd1c3f2b0f996ff9479af04c5f0a000200000000000000000004',
        },
        // WETH/wstETH Lido Pool
        wstEthWeth: {
            1: 'TODO',
            42: '0xe08590bde837eb9b2d42aa1196469d6e08fe96ec000200000000000000000101',
        },
    },
};

export const Routes = {
    1: {},
    42: {},
};

// MAINNET STATIC ROUTES FOR LIDO <> Stable
// DAI/wstETH: DAI > WETH > wstETH
Routes[1][`${Lido.DAI[1]}${Lido.WSTETHADDR[1]}0`] = {
    name: 'DAI/wstETH-SwapExactIn',
    tokenInDecimals: 18,
    tokenOutDecimals: 18,
    tokenAddresses: [Lido.DAI[1], Lido.WETH[1], Lido.WSTETHADDR[1]],
    swaps: [
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
    ],
};

// wstETH/DAI: wstETH > WETH > DAI
Routes[1][`${Lido.WSTETHADDR[1]}${Lido.DAI[1]}0`] = {
    name: 'wstETH/DAI-SwapExactIn',
    tokenInDecimals: 18,
    tokenOutDecimals: 18,
    tokenAddresses: [Lido.WSTETHADDR[1], Lido.WETH[1], Lido.DAI[1]],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
    ],
};

// DAI/wstETH: DAI > WETH > wstETH
Routes[1][`${Lido.DAI[1]}${Lido.WSTETHADDR[1]}1`] = {
    name: 'DAI/wstETH-SwapExactOut',
    tokenInDecimals: 18,
    tokenOutDecimals: 18,
    tokenAddresses: [Lido.DAI[1], Lido.WETH[1], Lido.WSTETHADDR[1]],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// wstETH/DAI: wstETH > WETH > DAI
Routes[1][`${Lido.WSTETHADDR[1]}${Lido.DAI[1]}1`] = {
    name: 'wstETH/DAI-SwapExactOut',
    tokenInDecimals: 18,
    tokenOutDecimals: 18,
    tokenAddresses: [Lido.WSTETHADDR[1], Lido.WETH[1], Lido.DAI[1]],
    swaps: [
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// USDC/wstETH: USDC > DAI > WETH > wstETH
Routes[1][`${Lido.USDC[1]}${Lido.WSTETHADDR[1]}0`] = {
    name: 'USDC/wstETH-SwapExactIn',
    tokenInDecimals: 6,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.USDC[1],
        Lido.DAI[1],
        Lido.WETH[1],
        Lido.WSTETHADDR[1],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.staBal[1],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '0',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
    ],
};

Routes[1][`${Lido.USDC[1]}${Lido.WSTETHADDR[1]}1`] = {
    name: 'USDC/wstETH-SwapExactOut',
    tokenInDecimals: 6,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.USDC[1],
        Lido.DAI[1],
        Lido.WETH[1],
        Lido.WSTETHADDR[1],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.staBal[1],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// wstETH/USDC: wstETH > WETH > DAI > USDC
Routes[1][`${Lido.WSTETHADDR[1]}${Lido.USDC[1]}0`] = {
    name: 'wstETH/USDC-SwapExactIn',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [
        Lido.WSTETHADDR[1],
        Lido.WETH[1],
        Lido.DAI[1],
        Lido.USDC[1],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.staBal[1],
            amount: '0',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
    ],
};

Routes[1][`${Lido.WSTETHADDR[1]}${Lido.USDC[1]}1`] = {
    name: 'wstETH/USDC-SwapExactOut',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [
        Lido.WSTETHADDR[1],
        Lido.WETH[1],
        Lido.DAI[1],
        Lido.USDC[1],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.staBal[1],
            amount: '',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// USDT/wstETH: USDT > DAI > WETH > wstETH
Routes[1][`${Lido.USDT[1]}${Lido.WSTETHADDR[1]}0`] = {
    name: 'USDT/wstETH-SwapExactIn',
    tokenInDecimals: 6,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.USDT[1],
        Lido.DAI[1],
        Lido.WETH[1],
        Lido.WSTETHADDR[1],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.staBal[1],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '0',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
    ],
};

Routes[1][`${Lido.USDT[1]}${Lido.WSTETHADDR[1]}1`] = {
    name: 'USDT/wstETH-SwapExactOut',
    tokenInDecimals: 6,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.USDT[1],
        Lido.DAI[1],
        Lido.WETH[1],
        Lido.WSTETHADDR[1],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.staBal[1],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// wstETH/USDT: wstETH > WETH > DAI > USDT
Routes[1][`${Lido.WSTETHADDR[1]}${Lido.USDT[1]}0`] = {
    name: 'wstETH/USDT-SwapExactIn',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [
        Lido.WSTETHADDR[1],
        Lido.WETH[1],
        Lido.DAI[1],
        Lido.USDT[1],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.staBal[1],
            amount: '0',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
    ],
};

Routes[1][`${Lido.WSTETHADDR[1]}${Lido.USDT[1]}1`] = {
    name: 'wstETH/USDT-SwapExactOut',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [
        Lido.WSTETHADDR[1],
        Lido.WETH[1],
        Lido.DAI[1],
        Lido.USDT[1],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.staBal[1],
            amount: '',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[1],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[1],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// KOVAN STATIC ROUTES FOR LIDO <> Stable
// USDC/wstETH: USDC > WETH > wstETH
Routes[42][`${Lido.USDC[42]}${Lido.WSTETHADDR[42]}0`] = {
    name: 'USDC/wstETH-SwapExactIn',
    tokenInDecimals: 6,
    tokenOutDecimals: 18,
    tokenAddresses: [Lido.USDC[42], Lido.WETH[42], Lido.WSTETHADDR[42]],
    swaps: [
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
    ],
};

// wstETH/USDC: wstETH > WETH > USDC
Routes[42][`${Lido.WSTETHADDR[42]}${Lido.USDC[42]}0`] = {
    name: 'wstETH/USDC-SwapExactIn',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [Lido.WSTETHADDR[42], Lido.WETH[42], Lido.USDC[42]],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
    ],
};

// USDC/wstETH: USDC > WETH > wstETH
Routes[42][`${Lido.USDC[42]}${Lido.WSTETHADDR[42]}1`] = {
    name: 'USDC/wstETH-SwapExactOut',
    tokenInDecimals: 6,
    tokenOutDecimals: 18,
    tokenAddresses: [Lido.USDC[42], Lido.WETH[42], Lido.WSTETHADDR[42]],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// wstETH/USDC: wstETH > WETH > USDC
Routes[42][`${Lido.WSTETHADDR[42]}${Lido.USDC[42]}1`] = {
    name: 'wstETH/USDC-SwapExactOut',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [Lido.WSTETHADDR[42], Lido.WETH[42], Lido.USDC[42]],
    swaps: [
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// DAI/wstETH: DAI > USDC > WETH > wstETH
Routes[42][`${Lido.DAI[42]}${Lido.WSTETHADDR[42]}0`] = {
    name: 'DAI/wstETH-SwapExactIn',
    tokenInDecimals: 18,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.DAI[42],
        Lido.USDC[42],
        Lido.WETH[42],
        Lido.WSTETHADDR[42],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.staBal[42],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '0',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
    ],
};

Routes[42][`${Lido.DAI[42]}${Lido.WSTETHADDR[42]}1`] = {
    name: 'DAI/wstETH-SwapExactOut',
    tokenInDecimals: 18,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.DAI[42],
        Lido.USDC[42],
        Lido.WETH[42],
        Lido.WSTETHADDR[42],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.staBal[42],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// wstETH/DAI: wstETH > WETH > USDC > DAI
Routes[42][`${Lido.WSTETHADDR[42]}${Lido.DAI[42]}0`] = {
    name: 'wstETH/DAI-SwapExactIn',
    tokenInDecimals: 18,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.WSTETHADDR[42],
        Lido.WETH[42],
        Lido.USDC[42],
        Lido.DAI[42],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.staBal[42],
            amount: '0',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
    ],
};

Routes[42][`${Lido.WSTETHADDR[42]}${Lido.DAI[42]}1`] = {
    name: 'wstETH/DAI-SwapExactOut',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [
        Lido.WSTETHADDR[42],
        Lido.WETH[42],
        Lido.USDC[42],
        Lido.DAI[42],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.staBal[42],
            amount: '',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// USDT/wstETH: USDT > USDC > WETH > wstETH
Routes[42][`${Lido.USDT[42]}${Lido.WSTETHADDR[42]}0`] = {
    name: 'USDT/wstETH-SwapExactIn',
    tokenInDecimals: 6,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.USDT[42],
        Lido.USDC[42],
        Lido.WETH[42],
        Lido.WSTETHADDR[42],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.staBal[42],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '0',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
    ],
};

Routes[42][`${Lido.USDT[42]}${Lido.WSTETHADDR[42]}1`] = {
    name: 'USDT/wstETH-SwapExactOut',
    tokenInDecimals: 6,
    tokenOutDecimals: 18,
    tokenAddresses: [
        Lido.USDT[42],
        Lido.USDC[42],
        Lido.WETH[42],
        Lido.WSTETHADDR[42],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.staBal[42],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// wstETH/USDT: wstETH > WETH > USDC > USDT
Routes[42][`${Lido.WSTETHADDR[42]}${Lido.USDT[42]}0`] = {
    name: 'wstETH/USDT-SwapExactIn',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [
        Lido.WSTETHADDR[42],
        Lido.WETH[42],
        Lido.USDC[42],
        Lido.USDT[42],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.staBal[42],
            amount: '0',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
    ],
};

Routes[42][`${Lido.WSTETHADDR[42]}${Lido.USDT[42]}1`] = {
    name: 'wstETH/USDT-SwapExactOut',
    tokenInDecimals: 18,
    tokenOutDecimals: 6,
    tokenAddresses: [
        Lido.WSTETHADDR[42],
        Lido.WETH[42],
        Lido.USDC[42],
        Lido.USDT[42],
    ],
    swaps: [
        {
            poolId: Lido.StaticPools.staBal[42],
            amount: '',
            assetInIndex: '2',
            assetOutIndex: '3',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wethDai[42],
            amount: '0',
            assetInIndex: '1',
            assetOutIndex: '2',
            userData: '0x',
        },
        {
            poolId: Lido.StaticPools.wstEthWeth[42],
            amount: '0',
            assetInIndex: '0',
            assetOutIndex: '1',
            userData: '0x',
        },
    ],
};

// Only want static routes for Lido <> Stable
export function isLidoStableSwap(
    chainId: number,
    tokenIn: string,
    tokenOut: string
): boolean {
    if (!Lido.Networks.includes(chainId)) return false;

    if (
        (tokenIn === Lido.WSTETHADDR[chainId] &&
            tokenOut === Lido.DAI[chainId]) ||
        (tokenIn === Lido.WSTETHADDR[chainId] &&
            tokenOut === Lido.USDC[chainId]) ||
        (tokenIn === Lido.WSTETHADDR[chainId] &&
            tokenOut === Lido.USDT[chainId]) ||
        (tokenIn === Lido.DAI[chainId] &&
            tokenOut === Lido.WSTETHADDR[chainId]) ||
        (tokenIn === Lido.USDC[chainId] &&
            tokenOut === Lido.WSTETHADDR[chainId]) ||
        (tokenIn === Lido.USDT[chainId] &&
            tokenOut === Lido.WSTETHADDR[chainId]) ||
        (tokenIn === Lido.STETH[chainId] && tokenOut === Lido.DAI[chainId]) ||
        (tokenIn === Lido.STETH[chainId] && tokenOut === Lido.USDC[chainId]) ||
        (tokenIn === Lido.STETH[chainId] && tokenOut === Lido.USDT[chainId]) ||
        (tokenIn === Lido.DAI[chainId] && tokenOut === Lido.STETH[chainId]) ||
        (tokenIn === Lido.USDC[chainId] && tokenOut === Lido.STETH[chainId]) ||
        (tokenIn === Lido.USDT[chainId] && tokenOut === Lido.STETH[chainId])
    )
        return true;
    else return false;
}

// Uses Vault queryBatchSwap to get return amount for swap
async function queryBatchSwap(
    swapType: SwapTypes,
    swaps: SwapV2[],
    assets: string[],
    provider: BaseProvider
): Promise<BigNumber> {
    const vaultAbi = require('../../abi/Vault.json');
    const vaultAddr = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
    const vaultContract = new Contract(vaultAddr, vaultAbi, provider);
    const funds = {
        sender: ZERO_ADDRESS,
        recipient: ZERO_ADDRESS,
        fromInternalBalance: false,
        toInternalBalance: false,
    };

    try {
        const deltas = await vaultContract.callStatic.queryBatchSwap(
            swapType,
            swaps,
            assets,
            funds
        );
        // negative amounts represent tokens (or ETH) sent by the Vault
        if (swapType === SwapTypes.SwapExactIn)
            return bnum(deltas[assets.length - 1].toString()).times(-1);
        else return bnum(deltas[0].toString());
    } catch (err) {
        console.error(`SOR - queryBatchSwap: ${err.message}`);
        return bnum(0);
    }
}

/*
Spot Price for path is product of each pools SP for relevant tokens.
(See helpersClass getSpotPriceAfterSwapForPath)
*/
function calculateMarketSp(
    swapType: SwapTypes,
    swaps: SwapV2[],
    assets: string[],
    pools: SubGraphPoolsBase
): BigNumber {
    const spotPrices: BigNumber[] = [];
    for (let i = 0; i < swaps.length; i++) {
        const swap = swaps[i];

        // Find matching pool from list so we can use balances, etc
        const pool = pools.pools.filter(p => p.id === swap.poolId);
        if (pool.length !== 1) return bnum(0);

        // This will get a specific pool type so we can call parse and spot price functions
        const newPool = parseNewPool(pool[0]);
        if (!newPool) return bnum(0);

        // Parses relevant balances, etc
        const poolPairData: any = newPool.parsePoolPairData(
            assets[swap.assetInIndex],
            assets[swap.assetOutIndex]
        );

        // Calculate current spot price
        let spotPrice: BigNumber;
        if (swapType === SwapTypes.SwapExactIn)
            spotPrice = newPool._spotPriceAfterSwapExactTokenInForTokenOut(
                poolPairData,
                ZERO
            );
        // Amount = 0 to just get current SP
        else
            spotPrice = newPool._spotPriceAfterSwapTokenInForExactTokenOut(
                poolPairData,
                ZERO
            ); // Amount = 0 to just get current SP

        // console.log(`${swap.poolId} ${spotPrice.toString()}`);
        spotPrices.push(spotPrice);
    }

    // SP for Path is product of all
    return spotPrices.reduce((a, b) => a.times(b));
}

/*
Used when SOR doesn't support paths with more than one hop.
Enables swapping of stables <> wstETH via WETH/DAI pool which has good liquidity.
*/
export async function getLidoStaticSwaps(
    pools: SubGraphPoolsBase,
    chainId: number,
    tokenIn: string,
    tokenOut: string,
    swapType: SwapTypes,
    swapAmount: BigNumber,
    provider: BaseProvider
): Promise<SwapInfo> {
    // Check for stETH tokens and convert to use wstETH for routing
    let isWrappingIn,
        isWrappingOut = false;
    if (tokenIn === Lido.STETH[chainId]) {
        tokenIn = Lido.WSTETHADDR[chainId];
        isWrappingIn = true;
    }
    if (tokenOut === Lido.STETH[chainId]) {
        tokenOut = Lido.WSTETHADDR[chainId];
        isWrappingOut = true;
    }

    let swapInfo: SwapInfo = {
        tokenAddresses: [],
        swaps: [],
        swapAmount: ZERO,
        tokenIn: '',
        tokenOut: '',
        returnAmount: ZERO,
        returnAmountConsideringFees: ZERO,
        marketSp: ZERO,
    };
    const staticRoute = Routes[chainId][`${tokenIn}${tokenOut}${swapType}`];
    if (!staticRoute) return swapInfo;

    swapInfo.tokenAddresses = staticRoute.tokenAddresses;
    swapInfo.swaps = staticRoute.swaps;
    if (swapType === SwapTypes.SwapExactIn)
        swapInfo.swapAmount = scale(swapAmount, staticRoute.tokenInDecimals);
    else swapInfo.swapAmount = scale(swapAmount, staticRoute.tokenOutDecimals);

    swapInfo.swaps[0].amount = swapInfo.swapAmount.toString();
    if (isWrappingIn) swapInfo.tokenIn = Lido.STETH[chainId];
    else swapInfo.tokenIn = tokenIn;

    if (isWrappingOut) swapInfo.tokenOut = Lido.STETH[chainId];
    else swapInfo.tokenOut = tokenOut;

    // Calculate SP as product of all pool SP in path
    swapInfo.marketSp = calculateMarketSp(
        swapType,
        swapInfo.swaps,
        swapInfo.tokenAddresses,
        pools
    );

    // Unlike main SOR here we haven't calculated the return amount for swaps so use query call on Vault to get value.
    swapInfo.returnAmount = await queryBatchSwap(
        swapType,
        swapInfo.swaps,
        swapInfo.tokenAddresses,
        provider
    );
    // Considering fees shouldn't matter as there won't be alternative options on V1
    swapInfo.returnAmountConsideringFees = swapInfo.returnAmount;
    return swapInfo;
}

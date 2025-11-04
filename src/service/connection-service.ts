import {ethers} from "ethers";
import {messageBox} from "./message-service.ts"
import {configuration} from "../config.ts";

interface TryingResult {
    success: boolean;
    signer?: ethers.Signer;
    provider?: ethers.Provider;
}

export const connectOnce = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const address = await signer.getAddress();
    return {chainId: network.chainId, address: address, provider, signer};
}

export const trying = async (showMessage:boolean): Promise<TryingResult> => {
    const {chainId, address, provider, signer} = await connectOnce();
    const supported = configuration().chainId.toString();
    const accountLength = address.length;
    const account = address.substring(0, 7) + "..." + address.substring(accountLength - 5);
    if (chainId.toString() === supported) {
        if (showMessage) {
            await messageBox("success", "", '连接成功：chainId: ' + chainId + " account: " + account);
        }
        return {success: true, provider, signer};
    }
    await messageBox("warning", "", '当前网络不匹配：chainId: ' + chainId + " account: " + account);
    return {success: false};
}

const switchToChain = async () => {
    const conf = configuration();
    const chainId = `0x${conf.chainId.toString(16)}`;
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId}]
        });
        await messageBox("info", "", "已切换到链: " + conf.chainId);
    } catch (switchError) {
        const error = switchError as { code?: number; message?: string };
        if (error.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: conf.params,
            });
            await switchToChain();
        } else {
            await messageBox("danger", "", "切换失败: " + error.message!);
        }
    }
};

export const connect = async () => {
    const {success} = await trying(true);
    if (success) {
        return;
    }
    await switchToChain();
    await trying(true);
}
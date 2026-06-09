import 'dotenv/config'; // Automatically loads .env variables
import express from 'express';
import { ethers } from 'ethers';

// ESM mein JSON import karne ke liye 'with { type: 'json' }' lazmi hai
import contractAbi from './abi.json' with { type: 'json' };

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

// Setup Provider and Wallet Signer
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tokenContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, wallet);

// 1. MINT TOKENS (Only Owner/Deployer Private Key can call this successfully)
app.post('/mint', async (req, res) => {
    try {
        const { to, amount } = req.body;
        if (!to || !amount) {
            return res.status(400).json({ error: "Missing 'to' or 'amount' in request body" });
        }

        // Convert user-friendly number (e.g., 50) to Wei (50 * 10^18)
        const formattedAmount = ethers.parseUnits(amount.toString(), 18);

        const tx = await tokenContract.mint(to, formattedAmount);
        await tx.wait(); // Wait for block confirmation

        res.status(200).json({
            message: "Tokens minted successfully",
            transactionHash: tx.hash
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. BURN TOKENS
app.post('/burn', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ error: "Missing 'amount' in request body" });
        }

        // Convert user-friendly number to Wei
        const formattedAmount = ethers.parseUnits(amount.toString(), 18);

        const tx = await tokenContract.burn(formattedAmount);
        await tx.wait();

        res.status(200).json({
            message: "Tokens burned successfully",
            transactionHash: tx.hash
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. GET BALANCE
app.get('/balance/:address', async (req, res) => {
    try {
        const address = req.params.address;
        
        const rawBalance = await tokenContract.balanceOf(address);
        // Convert Wei back to user-friendly format
        const balance = ethers.formatUnits(rawBalance, 18);

        res.status(200).json({
            balance: parseFloat(balance)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
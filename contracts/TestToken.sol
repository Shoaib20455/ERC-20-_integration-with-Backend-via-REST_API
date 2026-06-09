// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TestToken is ERC20, ERC20Burnable, Ownable {
    // constructor se arguments hata diye taake deployer hi sub kuch ho
    constructor()
        ERC20("TestToken", "STT")
        Ownable(msg.sender) // Deployer becomes the owner
    {
        // 1000 tokens mint ho rahe hain deployer (msg.sender) ko
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
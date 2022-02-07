# WIP

# Shared Account Upgrade

This document proposes the addition of several contracts and existing contract updates to improve quality of life for developers and users, improve RAM efficiency and token safety. 

# Features

- Addition of unique ```long_name```s per user. (12+ length [Pretty names](https://bytemaster.medium.com/eos-account-name-service-proposal-94f86df4b8b1)) 
- Simplified notification system for token transfers. 
- Reduced RAM costs for contract handling deposits and withdrawals of tokens.
- Standardized token bridging.
- Global Token Registry mapping ID numbers to all tokens (32 bit ID).
- Global User Registry mapping ID numbers to all user accounts, including ```long_name```s.
- Minimal changes to existing system contracts.

# Contracts
- [eosio.userid](#eosiouserid)
- [eosio.tokenid](#eosiotokenid)
- [eosio.system](#eosiosystem)
- [eosio.token](#eosiotoken)
- [eosio.tokens](#eosiotokens)
- [eosio.symbol](#eosiosymbol)
- [eosio.buyid](#eosiobuyid)
- [eosio.tbridge](#eosiobridge)

# Dictionary

| type              | name          | notes                                                                                                                                                |
|-------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| ```eosio::name``` | name          | Existing 64 bit EOS.IO account (`e.g. eosio.token`)                                                                                                  |
| ```uint32_t```    | account_num   | Sequentially assigned number registered in ```eosio.userid```                                                                                        |
| ```string```      | long_name     | 32 **Byte** user readable, unambiguous unique name. Aka [Pretty name](https://bytemaster.medium.com/eos-account-name-service-proposal-94f86df4b8b1). |
| ```uint32_t```    | token_num     | Sequentially assigned number registered in ```eosio.tokenid```                                                                                       |
|                   | native token  | A token hosted by eosio.tokens                                                                                                                       |
|                   | foreign token | A token hosted by it's own independent token contract, typically forked and deployed of eosio.token                                                  |

# Smart Contracts

## `eosio.userid`

Acts as a EOS account registry which maps EOS account ```name```'s to ```account_num```, ```long_name``` and vice versa.

A user may also specify an IPFS CID for additional account metadata. (e.g. ```avatar```, ```display_name```).

```long_name```'s are equivalent to [Pretty names](https://bytemaster.medium.com/eos-account-name-service-proposal-94f86df4b8b1). 


All RAM expenses paid for by ```eosio.name``` and network.  

### Table

    eosio::name => Account_Num(32 bit), Long_Name(32 byte), ipfs_profile
            Secondary  Account_Num->name
            Secondary  Long_Name->name

       checkname( optional eosio::name, optional AccountNum, optional longname ) // find or assert

       register( eosio::name, longname, ipfs )
            if( name == longname ) require_auth(name)
            else require_auth( eosio.buyid )
            return AccountNum  —- hazard (pending results are not final, see final irreversible transaction to get id)
                   updateprofile( longname, ipfs )
                        requireauth( longname owner )

## `eosio.tokenid`

Acts a token registry mapping a token contract account + token symbol e.g. *(eosio.token + EOS)* to a unique 32 bit ```token_num```

Any user can register a token onto the registry however only the token issuer may set additional metadata like a logo, display name, website, etc. 

## TABLE `token`
```c++

    Table
         TokenNum => TokenContract | Symbol | IPFS
         secondary 128 = TokenContract | Symbol
```

## ACTION `regtoken`
Register an existing token 
### params

- `{eosio::name} registrar` - Account registering token, any account can do this and merely is used to pay for the RAM expense.
- `{extended_symbol} token` - Contract + Token Symbol.

Callable by anyone willing to pay for the RAM.

## ACTION `setprofile`
Allows token issuers to set an IPFS CID which includes bonus metadata like token logo, display name, website, etc. 
### params

- `{uint32_t} tokenid` - Token ID
- `{string}  ipfs` - IPFS CID.

Callable only by token issuer.



## `eosio.system`
```eosio.system::enable(eosio::name feature)```

This new action enables system contract features. This release adds the `eosio.name` feature, which disables the namebid feature and delegates the authority to create new short names to the `eosio.name` contract. Once this feature is activated, bidding will stop and no auctions will close. Existing closed auctions may be claimed. Users may get refunds from existing open auctions or auctions which they have lost.

```eosio.system::newaccount```

This existing action will have the following rules for creating accounts:

- `eosio.*`: only the `eosio` account may create these (current rule).
- `*.x`: only the `x` account may create these (current rule).
- 12-character name with no periods: anyone may create these (current rule).
- Names with fewer than 12 characters and no periods:
  - If an auction has closed: only the winner may create the name
  - Else: only the `eosio.name` contract may create these.

```eosio.system::bidname```

This existing action will abort after the `eosio.name` feature is enabled.

```eosio.system::bidrefund```

Right now this action refunds bids in the `bidrefunds` table. After the `eosio.name` feature is enabled, it will also refund bids on open auctions (not closed auctions) in the `namebids` table.

# todo...
```
- Should it attempt to register AccountNum?

```

## `eosio.token`
No changes only manages existing EOS token.

## `eosio.tokens`

The sequel to ```eosio.token``` this contract enforces inflation, recalling and authorization limits decided by each token issuer. 

### Features
#### `Inflation Limiting`

Token issuers may specify a daily absolute inflation amount, daily inflation percentage and yearly inflation percentage. 
The issuer may update inflation but inflation must always be lower.

#### `Token Recalling`
Some token issuers may reserve the rights to revoke user tokens, therefore the token ```recall``` setting is enabled by default on all tokens allowing token issuers to transfer a users balance on their behalf, the issuer may permanently disable token recalling. 

#### `Inline transfer authorization`
Further changes on how each token hosted on ```eosio.tokens``` can be made by dapp developers by declaring an ```authorizer``` smart contract, then with an action of ```authtrans``` each ```eosio.tokens::transfer``` will trigger an inline action towards this account where the contract may pass or throw the contract action. 

Issuers may permanently disable the ability to specify an authorizer account. 

Only ```eosio.symbol``` has permissions to create new tokens.




      Table
           user32|token32 => balance64               BALANCES
      
      Table 
           token32 -> contract | symbol 
           Secondary128  contract | symbol -> token32

       registerToken( contract, symbol )
          requireAuth(contract) 
          return token32

      .credit()
           /// if not bridge….
           assert(false)

      transfer( variant<user32,name,longname,key> from,  variant<user32,name,longname,key> to,    amount, tokenid, memo )
            Debit from
                 inline_action_to_authorizer_contract  “authtrans( variant<user32,key> )”
            Credit to
                  Inline action to receiver_contract if specified  “noticecredit( variant<from>, amount, tokenid )”
            

       on_notify_transfer(...) /// legacy transfer require_recipient callback
              /// requires a bridge to exist or ABORT… ambiguity if multiple bridges for same token… unless bridges rely upon memo… to signal which path to take.

     

/// TODO: expand the bridge function
/// allow any existing token to be mapped to a new token 1:1 
        bridge( TokenContract, Symbol, RegisteredButUnissuedSymbol )
requireAuth( eosio.symbol )... TokenContract implmeents old standard
On deposit, issue 
On withdraw, burn 


## eosio.symbol
Sells token symbols on a buy-it-now system basing price of amount of sales in a specified time.

Buyers need only specify the ```symbol_code```, e.g. "EOS" or "CAT".

A tokens ```precision```, ```max_supply``` and other properties are not determined until redeemed.

Arbitrary prices, windows and thresholds.

| Letters | Price       | Window Time | Increase Threshold | Decrease Threshold | Floor      |
|---------|-------------|-------------|--------------------|--------------------|------------|
| 3       | 30.0000 EOS | 48 hours    | 6                  | 4                  | 4.0000 EOS |
| 4       | 15.0000 EOS | 48 hours    | 6                  | 4                  | 3.000 EOS  |
| 5       | 2.0000 EOS  | 12 hours    | 12                 | 8                  | 0.0000 EOS |

For each symbol length for sale, the network decides the ```initial_price```, ```floor_price``` *(in EOS)*, ```decrease_threshold```, ```increase_threshold``` and ```window``` length of time. 

Once purchased users can trade their symbols amongst users subject to a network configurable secondary sale fee before finally redeeming their symbol as a newly created token using the ```eosio.symbol::create``` action which then performs an inline action to ```eosio.token::create```. 

### Example

3 letter symbols are highly valuable, therefore a high ```initial_price``` may only lower by 10% if less than 4 sales are made in 24 hours, if over 6 sales are made, the price would raise by 10%.  


## `eosio.buyid`

Similar to ```eosio.symbol``` this contract is responsible for selling ```long_name```'s based on the sales and itme window method, however, names are differentiated not by length but **simple** and **premium** namnes. 

Like ```eosio.symbol``` ```long_name```s may be traded and transferred amongst users before being redeemed for a permanent mapping.

**Simple Names** 
- Contains _ or a number.
- Does not contain characters **a**, **e**, **i**, **o**, **u**.
- Longer than 15 characters. 

**Premium Names**

Any name falling outside the scope of simple.

## ACTION `purchase`
Allows users to buy 32 byte long name, musn’t already or be able to exist in current system namespace. 
### params

- `{name} owner` - buying account
- `{???}  long_name` - Long name being purchased.
- - Cannot be 12 characters.
- - No "a.b" account.
- - `eosio::is_account(name)` returns false
- - Is valid characters: a-z 0-9 _

PoW style pricing based on verbs in account name. 
Users can still trade long names before they are actually created on eosio.name
Long names exactly matching an owners account should go directly to eosio.name

## Eosio.exchange 
### Inherits BankAPI
         Table // from BankAPI
               (usernum,tokennum),balance 
      
         internal_transfer( from, to, amount )  // from BankAPI
              /// moves tokens from credit of one user to another user
              /// sync… 
          
         transfer( from, to, amount, fee, memo ) {        
              internal_transfer( from, to, amount, memo )    
         }

         .credit( userid(from), extended_asset a )  // from BankAPI
                  assert( get_sender() == a.contract );
                  tokennum =  lookup(a.contract + asset.symbol)    
                  CREDITS[tokennum|from] += a.amount
                  Call virtual on_credit(... )
         
         withdraw( from, extended_asset a ) {  // from BankAPI
                  require_auth( from );
                  Call virtual on_withdraw(... )
                  tokennum =  lookup(a.contract + asset.symbol)    
                  balances[tokennum|from] -= a.amount // check >= 0
                  Inline transfer( from_self, from, a );
         }



    eosio.tokens
      .credit( some other token… ) {
           
      } 

    (Owner  (Contract  Symbol))  Balance
    
    {Contract,Symbol} == Token ID
    128 bit number 
    
    Uint128 TokenNum = contract;
    TokenNum <<= 64
    TokenNum |= symbol
    
    Uint64_t TokenNum[2];
    TokenNum[0] = contract
    TokenNum[1] = symbol
    
    Scope64: Token ID (128bit…)
    Key64: Owner
    Value: Balance
    
    hash64( TokenNum ) -> 64bit identifier with potential for collision 
    
    Token64 -> Token128  
    
    Struct  {
        Uint64_t contract
        Uint64_t symbol;
        primary_key(){ sha256(contact+symbol); }
    }

## `eosio.tbridge`
Creates a bridge between Foreign and Native tokens. 

Users provide the token symbol used from `eosio.symbol` and specify the ```extended_asset``` to bridge between.

The contract will permanently remain issuer of the token, several more symbols may be provided to create further bridges to the same token.

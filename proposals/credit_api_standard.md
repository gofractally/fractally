# WIP

# Credit API Standard

This document proposes the creation of a standard Token Deposit and Withdraw library for smart contract use. 

# Features

- Reduced RAM for secondary indices on all deposit / withdraw.
- Simplified notification system. 
- Easier user experience with long names (12+ length) 
- Standardized token bridges.
- Token Registry (32 bit ID -> token).
- User Registry.
- Minimal changes to existing system contracts.

# Dictionary

- ```{eosio::name} name``` - Existing 64 bit EOS.IO account (e.g. eosio.token).

- ```{uint32_t} account_num``` - 32 bit sequentially assigned account number.

- ```{???} long_name``` - 32 **Byte** user readable, unambiguous unique name.

- ```{uint32_t} token_num``` - 32 bit sequentially assigned Token ID.

# Contracts

## `eosio.userid`

Maps EOS account ```name```'s to ```account_num```, ```long_name``` and vice versa.
A user may also specify an IPFS CID for additional account metadata. (e.g. ```avatar```, ```display_name```).

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

eosio.tokenid  
    Table
         TokenNum => TokenContract | Symbol | IPFS
         secondary 128 = TokenContract | Symbol

    register( anyuser,  token_contract, symbol )
        require_auth( anyuser ) anyuser pays for RAM

    setprofile( tokenid, ipfs ) require_auth( tokenid::issuer )
        // takes over RAM costs… yes

    check( contract, symbol, tokenid )

## `eosio.system`
```eosio.symbol::newaccount``` ACTION:

12-character name: anyone (current rule)
eosio.*: only eosio (current rule)
a.b: only b (current rule)
new short names (no periods): only eosio.name contract
Action to refund existing name bids
Should it attempt to register AccountNum?
        
## `eosio.token`
No changes only manages existing EOS token.

## `eosio.tokens`
### Inherits Bank API

Manages user created tokens and enforces inflation, recalling and authorization limits.
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

## `eosio.symbol`
Sells token symbols on a buy-it-now system basing price of amount of sales in a specified time.

Buyers need only specify the ```symbol_code```, e.g. "EOS" or "CAT".

A tokens precision, max_supply and other properties are not determined until redeemed.

- 3 letters cost X EOS per window of time.
- 4 letters cost Y EOS per window of time.
- 5 letters cost Z EOS per window of time.
- 6+ letters       Fixed fee

For each symbol length for sale, the network decides the ```initial_price```, ```floor_price``` *(in EOS)*, ```decrease_threshold```, ```increase_threshold``` and ```window``` length of time. 

### Example

- ```symlen = 3```
- ```decrease_threshold = 4```
- ```increase_threshold = 6```
- ```window = 24 hours```

3 letter symbols are highly valuable, therefore a high ```initial_price``` may only lower by 10% if less than 4 sales are made in 24 hours, if over 6 sales are made, the price would raise by 10%.  

Once purchased users can trade their symbols amongst users subject to a network configurable secondary sale fee before finally redeeming their symbol as a newly created token using the ```eosio.symbol::create``` action which then performs an inline action to ```eosio.token::create```. 

## `eosio.buyid`

Similar to ```eosio.symbol``` this contract is responsible for selling ```long_name```'s based on the sales and itme window method, however, names are differentiated not by length but **simple** and **premium** namnes. 

Like ```eosio.symbol``` ```long_name```s may be traded and transferred amongst users before being redeemed for a permanent mapping.

**Simple** 
- Contains _ or a number.
- Does not contain characters **a**, **e**, **i**, **o**, **u**.
- Longer than 15 characters. 

**Premium**

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
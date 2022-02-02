# WIP

# Credit API Standard

This document proposes the creation of a Standardized token Deposit and Withdraw library for smart contract use. 

Reduced RAM for secondary indices on all deposit / withdraw
Easier to understand notification system 
Easier user experience with names 
Standardized token bridges 
Token Registery that is independent from symbol registration
Assigns short 32bit ids to tokens
Minimal changes to existing system contracts


Name = 64 bit existing eosio account 
AccountNum = 32 bit sequentially assigned account number
Long_name = 32 BYTE user readable, unambiguous unique name
TokenNum = 32 bit sequentially assigned token id

eosio.userid  // all RAM paid for by eosio.name and producers
      Table
    Eosio::name => AccountNum(32 bit), long_name(32 byte), ipfs_profile
            Secondary  AccountNum->name
            Secondary  long_name->name

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


eosio.system 
    newaccount action:
12-character name: anyone (current rule)
eosio.*: only eosio (current rule)
a.b: only b (current rule)
new short names (no periods): only eosio.name contract
Action to refund existing name bids
Should it attempt to register AccountNum?
        
eosio.token
No change… only manages EOS

Eosio.tokens  inherits BankAPI
Manages user created tokens and enforces limites, etc..
Only eosio.symbol can create new user tokens
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

Eosio.symbol
Sells tokens on a buy-it-now, rate limited basis 
3 letter,   X EOS per window
4 letter,   Y EOS per window
5 letter,   Z EOS per window
6+ letter… fixed fee
Users can trade symbols before finally creating the token in the eosio.sybol::create action which then performs eosio.token::create. 
     

eosio.buyuid // buy User ID
     Purchase action:
Allows users to buy 32 byte long name, musn’t already or be able to exist in current system namespace. 
No 12 character names
No “a.b” accounts 
`eosio::is_account(name)` returns false
PoW style pricing based on verbs in account name. 
Users can still trade long names before they are actually created on eosio.name
Long names exactly matching an owners account should go directly to eosio.name
Valid char:  a-z 0-9 _ 
    
Simple          fixed fee 
        Contain _ or number  
        Or Don’t contain any aeiou
        Or Longer than 15
    Premium = ! Simple     24 per day (1 per hour on average) 
        Don’t have _ or Number 
        have aeiou 

Eosio.exchange inherit BankAPI
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
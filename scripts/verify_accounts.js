const fs = require('fs');

// List of all accounts from the GREET_POSTS
const accounts = [
  '@0xSharples', '@WuBlockchain', '@bonk_fun', '@aeyakovenko', '@JupiterExchange', '@MoonPay', '@DeRonin_', '@0xMoei', '@Zun2025', '@0xAbhiP', '@TimHaldorsson', '@OxJoshyy', '@CryptoUsopp', '@PixOnChain', '@DeFiMinty', '@farmercist_eth', '@tobific', '@splinter0n', '@cryptoleon_xyz', '@zaimiriQ', '@Deebs_DeFi', '@ripchillpill', '@banditxbt', '@connectwithveee', '@cysic_xyz', '@YuujiLux', '@BoxMrChen', '@OxTochi', '@WY_mask', '@Emma_H_E5', '@xiaoyubtc', '@wanghebbf', '@0xrudylu', '@Crypto_He', '@zerokn0wledge_', '@SuPeRjOeMaNiTo', '@pumatheuma', '@0xDexDuck', '@walirttt', '@MogeYuu28', '@msjojos', '@C2Dougie', '@Tradermomike', '@Spicy_Rich', '@Eyenidim', '@CryptoBeast2030', '@cryptohdaily', '@etcjitender', '@t1mmy_w3b', '@NFTreeProj3ct', '@CryptoSer23', '@Shoehorn1984', '@BritWashed', '@4lexx07', '@ThaScalpStation', '@CTPigeon', '@ztherookie', '@thetrevorlahey', '@Sith_AG', '@bigray0x', '@morsyxbt', '@Defi_Scribbler', '@_Quivira', '@DeFi_Finestt', '@SaneraGermaine', '@0xgeek_x', '@craigscoinpurse', '@AlphaWolfPRMR', '@natashalfawn', '@SailorManCrypto', '@NDIDI_GRAM', '@sandraaleow', '@morganacash', '@0xMistBlade', '@SolanaCoach', '@bittybitbit86', '@greenytrades', '@RiddlerNFT', '@doodlifts', '@crypto_adair', '@slingdeez', '@brad_or_bradley', '@eat_insanity', '@0xAmberCT', '@0xAndrewMoh', '@defikadic', '@grebbycrypto', '@Mikesi30', '@Boboafrica1', '@Web3Niels', '@eli5_defi', '@MartinezOnChain', '@GeraldFMonkey', '@BonkCapitalSOL', '@bjoernbonk', '@BONKRadio', '@iamkadense', '@TheOnlyNom', '@SolportTom', '@solportskg', '@HopiumPapi', '@RaydiumProtocol', '@SolJakey', '@solanasteve_', '@iseemonei', '@shortyo', '@colbyonpump', '@cuttypete69', '@a1lon9', '@nevergoon100', '@Kevpumpfun', '@whoiswhish', '@SolanaLegend', '@CryptoGuruX', '@DeFiDynamo', '@MemecoinMania', '@SolanaSniper', '@PumpFunHype', '@LetsBonkVibes', '@SolanaMoonshot', '@CryptoHustlerX', '@TokenTitan', '@SolanaVenture', '@MemeLordSol', '@BonkArmy', '@SolanaWhale', '@PumpFunGuru', '@LetsBonkBoss', '@CryptoWolfSOL', '@SolanaHodler', '@MemecoinMogul', '@DeFiDegenX', '@SolanaBuzz', '@PumpFunPro', '@BonkBros', '@SolanaTraderX', '@CryptoVibeZ', '@MemeCoinHunter', '@SolanaRocket', '@PumpFunFan', '@LetsBonkLife', '@SolanaSavage', '@CryptoBanterX', '@TokenTrendz', '@SolanaElite', '@PumpFunAddict', '@BonkBeast', '@SolanaChaser', '@MemeCoinVibe', '@CryptoSlinger', '@SolanaPioneer', '@PumpFunMaster', '@LetsBonkKing', '@SolanaWizard', '@CryptoMaverickX', '@TokenBlaze', '@SolanaSurfer', '@PumpFunViral', '@BonkBlitz', '@SolanaSpark', '@MemeCoinWizard', '@CryptoVoyageX', '@SolanaStorm', '@PumpFunFever', '@LetsBonkWave', '@SolanaCrusader', '@CryptoNomadX', '@TokenRush', '@SolanaVanguard', '@PumpFunPulse', '@BonkBoom', '@SolanaMaverick', '@MemeCoinRiser', '@CryptoBlitzX', '@SolanaVoyager', '@PumpFunRiser', '@LetsBonkHype', '@SolanaGlider', '@CryptoSpartanX', '@TokenVoyage', '@SolanaRiser', '@PumpFunChaser', '@BonkBuster', '@SolanaDegen', '@MemeCoinBlaze', '@CryptoRangerX', '@SolanaTitan', '@PumpFunSnipe', '@LetsBonkRiser', '@SolanaKnight', '@CryptoHawkX'
];

// Remove @ symbol for easier processing
const cleanAccounts = accounts.map(acc => acc.replace('@', ''));

console.log('Total accounts to verify:', cleanAccounts.length);
console.log('\nAccount list:');
cleanAccounts.forEach((account, index) => {
  console.log(`${index + 1}. ${account}`);
});

// Save to file for manual verification
const output = {
  totalAccounts: cleanAccounts.length,
  accounts: cleanAccounts,
  timestamp: new Date().toISOString()
};

fs.writeFileSync('accounts_to_verify.json', JSON.stringify(output, null, 2));
console.log('\n✅ Account list saved to accounts_to_verify.json');
console.log('\n📝 To verify these accounts, you can:');
console.log('1. Manually check each account on Twitter/X');
console.log('2. Use Twitter API to verify account existence');
console.log('3. Use a bulk Twitter account checker tool');
console.log('\n🔍 Quick manual check: Visit https://twitter.com/[username] for each account'); 
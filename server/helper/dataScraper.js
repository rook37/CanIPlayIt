import axios from "axios";
import fs from "fs";
import dotenv from 'dotenv'
dotenv.config();



async function ubiPlus() {
  let ubiURL = proces.env.UBI_URL
  let ubiPremBody = `{"query":"","attributesToRetrieve":["title","image_link","short_title","id","MasterID","Genre","release_date","partOfUbisoftPlus","anywherePlatforms","subscriptionExpirationDate","Edition","adult","partofSubscriptionOffer"],"hitsPerPage":999999,"facetFilters":[[],[],[],["partofSubscriptionOffer:Ubisoft+ Premium"]],"clickAnalytics":true}`;
  let ubiClassBody = `{"query":"","attributesToRetrieve":["title","image_link","short_title","id","MasterID","Genre","release_date","partOfUbisoftPlus","anywherePlatforms","subscriptionExpirationDate","Edition","adult","partofSubscriptionOffer"],"hitsPerPage":999999,"facetFilters":[[],[],[],["partofSubscriptionOffer:Ubisoft+ Classics"]],"clickAnalytics":true}`;
  
  try {
    let response = await axios.post(ubiURL, ubiPremBody);
    fs.writeFileSync("json/UbiPrem.json", JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
  try {
    let response = await axios.post(ubiURL, ubiClassBody);
    fs.writeFileSync("json/UbiClassic.json", JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
}


async function psPlus() {
let PSPlus = process.env.PS_PLUS
let PSClassics = process.env.PS_CLASSICS
let PSUbiClassics = PS_UBI_CLASSICS

await axiosGet(PSPlus, "PSPlus");
await axiosGet(PSClassics, "PSClassics")
await axiosGet(PSUbiClassics,"PSUbiClassics")
}


async function gamePass() {
  let allGameIds = process.env.XB_ULT
  let GPStandard = process.env.XB_STANDARD
  let GPCore = process.env.XB_CORE
  let GPPC = process.env.XB_PC
  let xbEAPlay = process.env.XB_EA_PLAY

  await axiosGet(allGameIds, "xbAllGames");
  await axiosGet(GPStandard, "xbStandard");
  await axiosGet(GPPC, "xbPC");
  await axiosGet(GPCore,"xbCore")
  await axiosGet(xbEAPlay, "xbEAPlay");
}


async function axiosGet(url, fileName) {
  try {
    let response = await axios.get(url);
    fs.writeFileSync(`json/${fileName}.json`, JSON.stringify(response.data));
  } catch (error) {
    console.log(`Error retrieving ${fileName}: ${error}`);
  }
}

psPlus();
ubiPlus();
gamePass();

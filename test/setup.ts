import { rm } from "fs/promises";
import { join } from "path";

global.beforeEach(async ()=>{
  try {
    await rm(join(__dirname, '..', 'test.sqlite')) // remove this file after ever time we run a test
  } catch (error) {};
});